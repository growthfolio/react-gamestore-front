import { useState } from 'react';
import { Star } from 'lucide-react';
import avaliacaoService from '../../../services/avaliacao.service';
import { useAuth } from '../../../contexts/AuthContext';

interface FormularioAvaliacaoProps {
    produtoId: number;
    onAvaliacaoEnviada?: () => void;
}

const FormularioAvaliacao = ({ 
    produtoId, 
    onAvaliacaoEnviada 
}: FormularioAvaliacaoProps) => {
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
                produtoId,
                nota,
                comentario: comentario.trim()
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
        } catch (error: unknown) {
            console.error('Erro ao enviar avaliação:', error);
            const apiError = error as { response?: { data?: { message?: string } } };
            setErro(apiError.response?.data?.message || 'Erro ao enviar avaliação');
        } finally {
            setLoading(false);
        }
    };

    const renderEstrelas = () => {
        return [1, 2, 3, 4, 5].map((estrela) => (
            <Star
                key={estrela}
                size={32}
                className={`cursor-pointer transition-all hover:scale-110 ${
                    estrela <= (hoverNota || nota) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-neutral-600'
                }`}
                onClick={() => setNota(estrela)}
                onMouseEnter={() => setHoverNota(estrela)}
                onMouseLeave={() => setHoverNota(0)}
            />
        ));
    };

    if (!usuario) {
        return (
            <div className="card-gaming p-6 mt-8">
                <div className="text-center py-4 bg-neutral-800 rounded-lg">
                    <p className="text-neutral-400">Faça login para avaliar este produto</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-gaming p-6 mt-8">
            <h3 className="heading-gamer text-xl text-neutral-100 mb-6">Avaliar Produto</h3>

            {sucesso && (
                <div className="bg-accent-500/10 border border-accent-500/30 text-accent-400 
                               px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    ✓ Avaliação enviada com sucesso!
                </div>
            )}

            {erro && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 
                               px-4 py-3 rounded-lg mb-4">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-300">
                        Sua nota:
                    </label>
                    <div className="flex gap-2">
                        {renderEstrelas()}
                    </div>
                    <span className="text-sm text-neutral-500">
                        {nota > 0 ? `${nota} ${nota === 1 ? 'estrela' : 'estrelas'}` : 'Clique para avaliar'}
                    </span>
                </div>

                <div className="space-y-2">
                    <label htmlFor="comentario" className="block text-sm font-medium text-neutral-300">
                        Seu comentário:
                    </label>
                    <textarea
                        id="comentario"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Compartilhe sua experiência com este produto..."
                        rows={5}
                        maxLength={500}
                        required
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg
                                   text-neutral-100 placeholder:text-neutral-500 resize-y
                                   focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                                   transition-colors"
                    />
                    <span className="block text-right text-sm text-neutral-500">
                        {comentario.length}/500 caracteres
                    </span>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || nota === 0}
                >
                    {loading ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
            </form>
        </div>
    );
};

export default FormularioAvaliacao;
