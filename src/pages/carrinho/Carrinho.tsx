import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/AuthContext';
import { CarrinhoItem } from '../../services/carrinho.service';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Package, Shield, Truck } from 'lucide-react';

const Carrinho = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const { itens, atualizarItem, removerItem, limparCarrinho, totalItens } = useCarrinho();

    useEffect(() => {
        if (!usuario) {
            navigate('/login');
        }
    }, [usuario, navigate]);

    const calcularTotal = () => {
        return itens.reduce((total: number, item: CarrinhoItem) => {
            return total + item.subtotal;
        }, 0);
    };

    const handleAtualizarQuantidade = async (itemId: number, novaQuantidade: number) => {
        if (novaQuantidade < 1) return;

        const item = itens.find((i: CarrinhoItem) => i.id === itemId);
        if (!item) return;

        if (novaQuantidade > item.estoqueDisponivel) {
            alert(`Quantidade máxima disponível: ${item.estoqueDisponivel}`);
            return;
        }

        try {
            await atualizarItem(itemId, novaQuantidade);
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            alert('Erro ao atualizar quantidade');
        }
    };

    const handleRemoverItem = async (itemId: number) => {
        if (window.confirm('Deseja remover este item do carrinho?')) {
            try {
                await removerItem(itemId);
            } catch (error) {
                console.error('Erro ao remover item:', error);
                alert('Erro ao remover item');
            }
        }
    };

    const handleLimparCarrinho = async () => {
        if (window.confirm('Deseja limpar todo o carrinho?')) {
            try {
                await limparCarrinho();
            } catch (error) {
                console.error('Erro ao limpar carrinho:', error);
                alert('Erro ao limpar carrinho');
            }
        }
    };

    const handleFinalizarCompra = () => {
        navigate('/checkout');
    };

    const handleVerDetalhes = (produtoId: number) => {
        navigate(`/produtos/${produtoId}`);
    };

    if (!usuario) {
        return null;
    }

    return (
        <div className="min-h-screen bg-neutral-950 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <ShoppingCart className="text-primary-500" size={32} />
                        <h1 className="heading-gamer text-3xl">Meu Carrinho</h1>
                    </div>
                    <p className="text-neutral-400 body-md">
                        {totalItens} {totalItens === 1 ? 'item' : 'itens'}
                    </p>
                </div>

                {itens.length === 0 ? (
                    /* Carrinho Vazio */
                    <div className="card-gaming p-12 text-center">
                        <ShoppingCart size={64} className="mx-auto text-neutral-600 mb-4" />
                        <h2 className="heading-gamer text-xl text-neutral-300 mb-2">
                            Seu carrinho está vazio
                        </h2>
                        <p className="text-neutral-500 mb-6">
                            Adicione produtos ao carrinho para continuar
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
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                        {/* Lista de Itens */}
                        <div className="space-y-4">
                            {/* Ações do Carrinho */}
                            <div className="flex justify-end">
                                <button 
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 
                                               rounded-lg hover:bg-red-500/20 transition-colors body-sm font-medium"
                                    onClick={handleLimparCarrinho}
                                >
                                    <Trash2 size={16} />
                                    Limpar Carrinho
                                </button>
                            </div>

                            {/* Itens */}
                            {itens.map((item: CarrinhoItem) => (
                                <div 
                                    key={item.id} 
                                    className="card-gaming p-4 grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr_auto_auto_auto] 
                                               gap-4 items-center relative"
                                >
                                    {/* Imagem */}
                                    <div 
                                        className="relative w-[100px] md:w-[120px] h-[140px] md:h-[160px] 
                                                   overflow-hidden rounded-lg cursor-pointer group"
                                        onClick={() => handleVerDetalhes(item.produtoId)}
                                    >
                                        <img 
                                            src={item.produtoImagem || '/placeholder-game.png'} 
                                            alt={item.produtoNome}
                                            className="w-full h-full object-cover transition-transform 
                                                       duration-300 group-hover:scale-105"
                                        />
                                        {item.descontoUnitario > 0 && (
                                            <span className="absolute top-2 right-2 bg-accent-500 text-neutral-950 
                                                           px-2 py-0.5 rounded font-bold text-xs">
                                                -{Math.round((item.descontoUnitario / item.precoUnitario) * 100)}%
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col gap-2">
                                        <h3 
                                            className="font-gaming font-semibold text-neutral-100 cursor-pointer 
                                                       hover:text-primary-400 transition-colors"
                                            onClick={() => handleVerDetalhes(item.produtoId)}
                                        >
                                            {item.produtoNome}
                                        </h3>
                                        
                                        {item.plataforma && (
                                            <span className="inline-block bg-neutral-800 px-2 py-1 rounded 
                                                           text-xs text-neutral-400 w-fit">
                                                {item.plataforma}
                                            </span>
                                        )}

                                        <div className="flex items-center gap-2">
                                            {item.descontoUnitario > 0 ? (
                                                <>
                                                    <span className="line-through text-neutral-500 text-sm">
                                                        R$ {item.precoUnitario.toFixed(2)}
                                                    </span>
                                                    <span className="text-accent-500 font-bold">
                                                        R$ {item.precoComDesconto.toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-accent-500 font-bold">
                                                    R$ {item.precoUnitario.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-xs text-neutral-500">
                                            {item.estoqueDisponivel} disponíveis
                                        </span>
                                    </div>

                                    {/* Quantidade */}
                                    <div className="flex items-center gap-2 bg-neutral-900 rounded-lg p-1
                                                    col-span-2 md:col-span-1 justify-self-start">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-md
                                                       bg-neutral-800 text-neutral-300 hover:bg-neutral-700
                                                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={() => handleAtualizarQuantidade(item.id, item.quantidade - 1)}
                                            disabled={item.quantidade <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-neutral-100">
                                            {item.quantidade}
                                        </span>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-md
                                                       bg-neutral-800 text-neutral-300 hover:bg-neutral-700
                                                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={() => handleAtualizarQuantidade(item.id, item.quantidade + 1)}
                                            disabled={item.quantidade >= item.estoqueDisponivel}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="flex flex-col items-end min-w-[100px]
                                                    hidden md:flex">
                                        <span className="text-xs text-neutral-500 mb-1">Subtotal:</span>
                                        <span className="text-lg font-bold text-neutral-100">
                                            R$ {item.subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Remover */}
                                    <button
                                        className="absolute top-4 right-4 md:relative md:top-auto md:right-auto
                                                   p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        onClick={() => handleRemoverItem(item.id)}
                                        title="Remover item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Resumo */}
                        <div className="card-gaming p-6 h-fit lg:sticky lg:top-6">
                            <h2 className="heading-gamer text-xl mb-6 pb-4 border-b border-neutral-800">
                                Resumo do Pedido
                            </h2>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-neutral-300">
                                    <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'}):</span>
                                    <span>R$ {calcularTotal().toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-neutral-300">
                                    <span>Frete:</span>
                                    <span className="text-accent-500 font-semibold">GRÁTIS</span>
                                </div>
                            </div>

                            <div className="h-px bg-neutral-800 my-4" />

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-semibold text-neutral-100">Total:</span>
                                <span className="text-2xl font-bold text-accent-500">
                                    R$ {calcularTotal().toFixed(2)}
                                </span>
                            </div>

                            <button
                                className="btn-accent w-full justify-center text-lg py-3 mb-6"
                                onClick={handleFinalizarCompra}
                            >
                                <CreditCard size={20} />
                                Finalizar Compra
                            </button>

                            <div className="pt-4 border-t border-neutral-800 space-y-3">
                                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                    <Shield size={16} className="text-accent-500" />
                                    <span>Compra 100% segura</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                    <Truck size={16} className="text-accent-500" />
                                    <span>Frete grátis para todo Brasil</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                    <Package size={16} className="text-accent-500" />
                                    <span>Entrega garantida</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carrinho;
