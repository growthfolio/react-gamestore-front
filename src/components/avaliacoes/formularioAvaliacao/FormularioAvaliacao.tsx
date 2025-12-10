import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { avaliacaoService } from '../../services/avaliacao.service';
import { useAuth } from '../../contexts/AuthContext';
import './FormularioAvaliacao.css';

interface FormularioAvaliacaoProps {
    produtoId: number;
    onAvaliacaoEnviada?: () => void;
}

const FormularioAvaliacao: React.FC<FormularioAvaliacaoProps> = ({ 
    produtoId, 
    onAvaliacaoEnviada 
}) => {
    const { usuario } = useAuth();
    const [nota, setNota] = useState(0);
    const [hoverNota, setHoverNota] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!usuario) {
            setErro('Você precisa estar logado para avaliar');
            return;
        }

        if (nota === 0) {
            setErro('Selecione uma nota de 1 a 5 estrelas');
            return;
        }

        if (comentario.trim().length < 10) {
            setErro('O comentário deve ter pelo menos 10 caracteres');
            return;
        }

        try {
            setLoading(true);
            setErro('');

            await avaliacaoService.criar({
                nota,
                comentario: comentario.trim(),
                produto: { id: produtoId }
            });

            setSucesso(true);
            setNota(0);
            setComentario('');

            if (onAvaliacaoEnviada) {
                onAvaliacaoEnviada();
            }

            setTimeout(() => {
                setSucesso(false);
            }, 3000);
        } catch (error: any) {
            console.error('Erro ao enviar avaliação:', error);
            setErro(error.response?.data?.message || 'Erro ao enviar avaliação');
        } finally {
            setLoading(false);
        }
    };

    const renderEstrelas = () => {
        return [1, 2, 3, 4, 5].map((estrela) => (
            <Star
                key={estrela}
                size={32}
                className={`estrela ${
                    estrela <= (hoverNota || nota) ? 'preenchida' : ''
                }`}
                onClick={() => setNota(estrela)}
                onMouseEnter={() => setHoverNota(estrela)}
                onMouseLeave={() => setHoverNota(0)}
            />
        ));
    };

    if (!usuario) {
        return (
            <div className="formulario-avaliacao-container">
                <div className="avaliacao-login-requerido">
                    <p>Faça login para avaliar este produto</p>
                </div>
            </div>
        );
    }

    return (
        <div className="formulario-avaliacao-container">
            <h3>Avaliar Produto</h3>

            {sucesso && (
                <div className="mensagem-sucesso">
                    ✓ Avaliação enviada com sucesso!
                </div>
            )}

            {erro && (
                <div className="mensagem-erro">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="formulario-avaliacao">
                <div className="avaliacao-nota">
                    <label>Sua nota:</label>
                    <div className="estrelas-container">
                        {renderEstrelas()}
                    </div>
                    <span className="nota-texto">
                        {nota > 0 ? `${nota} ${nota === 1 ? 'estrela' : 'estrelas'}` : 'Clique para avaliar'}
                    </span>
                </div>

                <div className="avaliacao-comentario">
                    <label htmlFor="comentario">Seu comentário:</label>
                    <textarea
                        id="comentario"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Compartilhe sua experiência com este produto..."
                        rows={5}
                        maxLength={500}
                        required
                    />
                    <span className="contador-caracteres">
                        {comentario.length}/500 caracteres
                    </span>
                </div>

                <button
                    type="submit"
                    className="btn-enviar-avaliacao"
                    disabled={loading || nota === 0}
                >
                    {loading ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
            </form>
        </div>
    );
};

export default FormularioAvaliacao;
