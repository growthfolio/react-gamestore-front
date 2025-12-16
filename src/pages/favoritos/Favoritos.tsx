import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/AuthContext';
import produtoService from '../../services/produto.service';
import { Produto } from '../../models/produtos/Produto';
import { ShoppingCart, Trash2, Heart, Package, Loader2 } from 'lucide-react';

const Favoritos = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const { favoritos, toggleFavorito } = useFavoritos();
    const { adicionarItem } = useCarrinho();
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarProdutosFavoritos();
    }, [favoritos]);

    const carregarProdutosFavoritos = async () => {
        try {
            setLoading(true);
            if (!usuario || favoritos.length === 0) {
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
            // Toast já é exibido pelo CarrinhoContext
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            // Toast já é exibido pelo CarrinhoContext
        }
    };

    const handleVerDetalhes = (produtoId: number) => {
        navigate(`/produtos/${produtoId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center py-16 text-neutral-400">
                        <Loader2 size={32} className="animate-spin mr-3" />
                        Carregando favoritos...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Heart className="text-red-500" size={32} />
                        <h1 className="heading-gamer text-3xl">Meus Favoritos</h1>
                    </div>
                    <p className="text-neutral-400 body-md">
                        {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}
                    </p>
                </div>

                {produtos.length === 0 ? (
                    /* Lista Vazia */
                    <div className="card-gaming p-12 text-center">
                        <Heart size={64} className="mx-auto text-neutral-600 mb-4" />
                        <h2 className="heading-gamer text-xl text-neutral-300 mb-2">
                            Nenhum favorito ainda
                        </h2>
                        <p className="text-neutral-500 mb-6">
                            Adicione produtos aos favoritos para vê-los aqui
                        </p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/produtos')}
                        >
                            <Package size={18} />
                            Explorar Produtos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {produtos.map(produto => (
                            <div 
                                key={produto.id} 
                                className="card-gaming overflow-hidden hover:shadow-glow-md 
                                           hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Imagem */}
                                <div 
                                    className="relative w-full h-40 overflow-hidden cursor-pointer group"
                                    onClick={() => handleVerDetalhes(produto.id)}
                                >
                                    <img 
                                        src={produto.imagens?.[0] || '/placeholder-game.png'} 
                                        alt={produto.nome}
                                        className="w-full h-full object-cover transition-transform 
                                                   duration-300 group-hover:scale-105"
                                    />
                                    {produto.desconto && produto.desconto > 0 && (
                                        <span className="absolute top-2 right-2 bg-accent-500 text-neutral-950 
                                                       px-2 py-1 rounded font-bold text-sm">
                                            -{produto.desconto}%
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 
                                        className="font-gaming font-semibold text-neutral-100 mb-1 
                                                   cursor-pointer hover:text-primary-400 transition-colors
                                                   line-clamp-1 text-sm"
                                        onClick={() => handleVerDetalhes(produto.id)}
                                    >
                                        {produto.nome}
                                    </h3>
                                    
                                    {produto.plataforma && (
                                        <span className="inline-block bg-neutral-800 px-2 py-0.5 rounded 
                                                       text-xs text-neutral-400 mb-1">
                                            {produto.plataforma}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {produto.desconto && produto.desconto > 0 ? (
                                            <>
                                                <span className="line-through text-neutral-500 text-xs">
                                                    R$ {produto.preco.toFixed(2)}
                                                </span>
                                                <span className="text-accent-500 font-bold text-base">
                                                    R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-accent-500 font-bold text-base">
                                                R$ {produto.preco.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Ações */}
                                <div className="flex gap-2 px-3 pb-3">
                                    <button
                                        className="flex-1 flex items-center justify-center gap-1 
                                                   px-3 py-1.5 bg-accent-500 text-neutral-950 rounded-lg
                                                   hover:bg-accent-400 transition-colors font-semibold text-sm
                                                   disabled:bg-neutral-700 disabled:text-neutral-500 
                                                   disabled:cursor-not-allowed"
                                        onClick={() => handleAdicionarCarrinho(produto)}
                                        disabled={!produto.estoque || produto.estoque === 0}
                                        title="Adicionar ao carrinho"
                                    >
                                        <ShoppingCart size={14} />
                                        Adicionar
                                    </button>
                                    <button
                                        className="p-1.5 bg-red-500/10 text-red-400 rounded-lg
                                                   hover:bg-red-500/20 transition-colors"
                                        onClick={() => handleRemoverFavorito(produto.id)}
                                        title="Remover dos favoritos"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favoritos;
