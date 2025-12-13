import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/AuthContext';
import { CarrinhoItem } from '../../services/carrinho.service';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import './Carrinho.css';

const Carrinho: React.FC = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const { itens, atualizarItem, removerItem, limparCarrinho, totalItens } = useCarrinho();
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
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
        setLoading(true);
        // TODO: Implementar lógica de checkout
        setTimeout(() => {
            alert('Funcionalidade de checkout em desenvolvimento!');
            setLoading(false);
        }, 1000);
    };

    const handleVerDetalhes = (produtoId: number) => {
        navigate(`/produtos/${produtoId}`);
    };

    if (!usuario) {
        return null;
    }

    return (
        <div className="carrinho-container">
            <div className="carrinho-header">
                <ShoppingCart className="header-icon" size={32} />
                <h1>Meu Carrinho</h1>
                <p>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</p>
            </div>

            {itens.length === 0 ? (
                <div className="carrinho-vazio">
                    <ShoppingCart size={64} className="empty-icon" />
                    <h2>Seu carrinho está vazio</h2>
                    <p>Adicione produtos ao carrinho para continuar</p>
                    <button 
                        className="btn-explorar"
                        onClick={() => navigate('/produtos')}
                    >
                        Explorar Produtos
                    </button>
                </div>
            ) : (
                <div className="carrinho-content">
                    <div className="carrinho-itens">
                        <div className="carrinho-acoes-header">
                            <button 
                                className="btn-limpar"
                                onClick={handleLimparCarrinho}
                            >
                                <Trash2 size={18} />
                                Limpar Carrinho
                            </button>
                        </div>

                        {itens.map((item: CarrinhoItem) => (
                            <div key={item.id} className="carrinho-item">
                                <div 
                                    className="item-imagem"
                                    onClick={() => handleVerDetalhes(item.produtoId)}
                                >
                                    <img 
                                        src={item.produtoImagem || '/placeholder-game.png'} 
                                        alt={item.produtoNome}
                                    />
                                    {item.descontoUnitario > 0 && (
                                        <span className="badge-desconto">
                                            -{Math.round((item.descontoUnitario / item.precoUnitario) * 100)}%
                                        </span>
                                    )}
                                </div>

                                <div className="item-info">
                                    <h3 
                                        className="item-nome"
                                        onClick={() => handleVerDetalhes(item.produtoId)}
                                    >
                                        {item.produtoNome}
                                    </h3>
                                    
                                    {item.plataforma && (
                                        <span className="item-plataforma">{item.plataforma}</span>
                                    )}

                                    <div className="item-preco-unitario">
                                        {item.descontoUnitario > 0 ? (
                                            <>
                                                <span className="preco-original">
                                                    R$ {item.precoUnitario.toFixed(2)}
                                                </span>
                                                <span className="preco-unitario">
                                                    R$ {item.precoComDesconto.toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="preco-unitario">
                                                R$ {item.precoUnitario.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <span className="item-estoque">
                                        {item.estoqueDisponivel} disponíveis
                                    </span>
                                </div>

                                <div className="item-quantidade">
                                    <button
                                        className="btn-quantidade"
                                        onClick={() => handleAtualizarQuantidade(item.id, item.quantidade - 1)}
                                        disabled={item.quantidade <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="quantidade-valor">{item.quantidade}</span>
                                    <button
                                        className="btn-quantidade"
                                        onClick={() => handleAtualizarQuantidade(item.id, item.quantidade + 1)}
                                        disabled={item.quantidade >= item.estoqueDisponivel}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="item-subtotal">
                                    <span className="subtotal-label">Subtotal:</span>
                                    <span className="subtotal-valor">
                                        R$ {item.subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    className="btn-remover-item"
                                    onClick={() => handleRemoverItem(item.id)}
                                    title="Remover item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="carrinho-resumo">
                        <h2>Resumo do Pedido</h2>
                        
                        <div className="resumo-linha">
                            <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'}):</span>
                            <span>R$ {calcularTotal().toFixed(2)}</span>
                        </div>

                        <div className="resumo-linha">
                            <span>Frete:</span>
                            <span className="frete-gratis">GRÁTIS</span>
                        </div>

                        <div className="resumo-divider"></div>

                        <div className="resumo-total">
                            <span>Total:</span>
                            <span className="total-valor">R$ {calcularTotal().toFixed(2)}</span>
                        </div>

                        <button
                            className="btn-finalizar"
                            onClick={handleFinalizarCompra}
                            disabled={loading}
                        >
                            <CreditCard size={20} />
                            {loading ? 'Processando...' : 'Finalizar Compra'}
                        </button>

                        <div className="resumo-info">
                            <p>✓ Compra 100% segura</p>
                            <p>✓ Frete grátis para todo Brasil</p>
                            <p>✓ Entrega garantida</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carrinho;
