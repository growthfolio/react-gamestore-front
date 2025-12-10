import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/AuthContext';
import produtoService from '../../services/produto.service';
import Produto from '../../models/produtos/Produto';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import './Favoritos.css';

const Favoritos: React.FC = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const { favoritos, toggleFavorito } = useFavoritos();
    const { adicionarItem } = useCarrinho();
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!usuario) {
            navigate('/login');
            return;
        }
        carregarProdutosFavoritos();
    }, [favoritos, usuario, navigate]);

    const carregarProdutosFavoritos = async () => {
        try {
            setLoading(true);
            if (favoritos.length === 0) {
                setProdutos([]);
                return;
            }

            // Carrega os detalhes de cada produto favorito
            const promises = favoritos.map(fav => produtoService.buscarPorId(fav.produto.id));
            const produtosCarregados = await Promise.all(promises);
            setProdutos(produtosCarregados.filter((p): p is Produto => p !== null));
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoverFavorito = async (produtoId: number) => {
        await toggleFavorito(produtoId);
    };

    const handleAdicionarCarrinho = async (produto: Produto) => {
        try {
            await adicionarItem({ produtoId: produto.id, quantidade: 1 });
            alert(`${produto.nome} adicionado ao carrinho!`);
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            alert('Erro ao adicionar produto ao carrinho');
        }
    };

    const handleVerDetalhes = (produtoId: number) => {
        navigate(`/produtos/${produtoId}`);
    };

    if (loading) {
        return (
            <div className="favoritos-container">
                <div className="loading">Carregando favoritos...</div>
            </div>
        );
    }

    return (
        <div className="favoritos-container">
            <div className="favoritos-header">
                <Heart className="header-icon" size={32} />
                <h1>Meus Favoritos</h1>
                <p>{produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}</p>
            </div>

            {produtos.length === 0 ? (
                <div className="favoritos-vazio">
                    <Heart size={64} className="empty-icon" />
                    <h2>Nenhum favorito ainda</h2>
                    <p>Adicione produtos aos favoritos para vê-los aqui</p>
                    <button 
                        className="btn-explorar"
                        onClick={() => navigate('/produtos')}
                    >
                        Explorar Produtos
                    </button>
                </div>
            ) : (
                <div className="favoritos-grid">
                    {produtos.map(produto => (
                        <div key={produto.id} className="favorito-card">
                            <div 
                                className="produto-imagem"
                                onClick={() => handleVerDetalhes(produto.id)}
                            >
                                <img 
                                    src={produto.imagens?.[0] || '/placeholder-game.png'} 
                                    alt={produto.nome}
                                />
                                {produto.desconto && produto.desconto > 0 && (
                                    <span className="badge-desconto">-{produto.desconto}%</span>
                                )}
                            </div>

                            <div className="produto-info">
                                <h3 
                                    className="produto-nome"
                                    onClick={() => handleVerDetalhes(produto.id)}
                                >
                                    {produto.nome}
                                </h3>
                                
                                {produto.plataforma && (
                                    <span className="produto-plataforma">{produto.plataforma}</span>
                                )}

                                <div className="produto-preco">
                                    {produto.desconto && produto.desconto > 0 ? (
                                        <>
                                            <span className="preco-original">
                                                R$ {produto.preco.toFixed(2)}
                                            </span>
                                            <span className="preco-atual">
                                                R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="preco-atual">
                                            R$ {produto.preco.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {produto.estoque && produto.estoque > 0 ? (
                                    <span className="produto-estoque">
                                        {produto.estoque} em estoque
                                    </span>
                                ) : (
                                    <span className="produto-estoque-zero">
                                        Fora de estoque
                                    </span>
                                )}
                            </div>

                            <div className="produto-acoes">
                                <button
                                    className="btn-carrinho"
                                    onClick={() => handleAdicionarCarrinho(produto)}
                                    disabled={!produto.estoque || produto.estoque === 0}
                                    title="Adicionar ao carrinho"
                                >
                                    <ShoppingCart size={18} />
                                    Adicionar
                                </button>
                                <button
                                    className="btn-remover"
                                    onClick={() => handleRemoverFavorito(produto.id)}
                                    title="Remover dos favoritos"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favoritos;
