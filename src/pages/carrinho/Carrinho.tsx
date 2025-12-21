import { useNavigate, Link } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../utils/errorHandler';
import { CarrinhoItem } from '../../services/carrinho.service';
import { ShoppingCart, Trash, Plus, Minus, CreditCard, Package, ShieldCheck, Truck, User, Tag, GameController } from '@phosphor-icons/react';
import { getProductUrl } from '../../utils/productUrl';

const Carrinho = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { itens, localItens, atualizarItem, removerItem, limparCarrinho, totalItens } = useCarrinho();
  const toast = useToast();

  // Usa itens do servidor se logado, senão usa locais
  const carrinhoItens = isAuthenticated ? itens : localItens;

  const calcularTotal = () => {
    if (isAuthenticated) {
      return itens.reduce((total: number, item: CarrinhoItem) => total + item.subtotal, 0);
    }
    return localItens.reduce((total, item) => {
      const preco = item.desconto ? item.preco! * (1 - item.desconto / 100) : item.preco!;
      return total + preco * item.quantidade;
    }, 0);
  };

  const handleAtualizarQuantidade = async (itemId: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    try {
      await atualizarItem(itemId, novaQuantidade);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      toast.error('Erro', getErrorMessage(error, 'Erro ao atualizar quantidade'));
    }
  };

  const handleRemoverItem = async (itemId: number) => {
    if (window.confirm('Deseja remover este item do carrinho?')) {
      try {
        await removerItem(itemId);
      } catch (error) {
        console.error('Erro ao remover item:', error);
      }
    }
  };

  const handleLimparCarrinho = async () => {
    if (window.confirm('Deseja limpar todo o carrinho?')) {
      try {
        await limparCarrinho();
        toast.success('Carrinho limpo', 'Todos os itens foram removidos');
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
      }
    }
  };

  const handleFinalizarCompra = () => {
    if (!isAuthenticated) {
      toast.warning('Login necessário', 'Faça login para finalizar a compra');
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  // Renderiza item do carrinho local (visitante)
  const renderLocalItem = (item: typeof localItens[0]) => {
    const precoFinal = item.desconto ? item.preco! * (1 - item.desconto / 100) : item.preco!;
    
    return (
      <div key={item.produtoId} className="card-gaming p-4 flex gap-4 items-center relative">
        <Link to={getProductUrl({ id: item.produtoId, slug: item.slug, nome: item.nome })} className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-lg group">
          {item.imagem ? (
            <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <GameController size={32} className="text-neutral-600" />
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/produtos/${item.produtoId}`} className="font-semibold text-neutral-100 hover:text-primary-400 transition-colors line-clamp-1">
            {item.nome}
          </Link>
          
          <div className="flex items-center gap-2 mt-2">
            {item.desconto && item.desconto > 0 ? (
              <>
                <span className="line-through text-neutral-500 text-sm">R$ {item.preco?.toFixed(2)}</span>
                <span className="text-accent-500 font-bold">R$ {precoFinal.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-accent-500 font-bold">R$ {item.preco?.toFixed(2)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => handleAtualizarQuantidade(item.produtoId, item.quantidade - 1)} disabled={item.quantidade <= 1} className="w-8 h-8 flex items-center justify-center rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors">
              <Minus size={14} />
            </button>
            <span className="w-10 text-center font-bold text-neutral-100">{item.quantidade}</span>
            <button onClick={() => handleAtualizarQuantidade(item.produtoId, item.quantidade + 1)} className="w-8 h-8 flex items-center justify-center rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors">
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-neutral-500">Subtotal</span>
          <p className="text-lg font-bold text-neutral-100">R$ {(precoFinal * item.quantidade).toFixed(2)}</p>
        </div>

        <button onClick={() => handleRemoverItem(item.produtoId)} className="absolute top-2 right-2 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <Trash size={18} />
        </button>
      </div>
    );
  };

  // Renderiza item do carrinho do servidor (logado)
  const renderServerItem = (item: CarrinhoItem) => (
    <div key={item.id} className="card-gaming p-4 flex gap-4 items-center relative">
      <Link to={getProductUrl({ id: item.produtoId, slug: item.produtoSlug, nome: item.produtoNome })} className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-lg group">
        {item.produtoImagem ? (
          <img src={item.produtoImagem} alt={item.produtoNome} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <GameController size={32} className="text-neutral-600" />
          </div>
        )}
        {item.descontoUnitario > 0 && (
          <span className="absolute top-2 left-2 bg-accent-500 text-neutral-950 px-2 py-0.5 rounded font-bold text-xs">
            -{Math.round((item.descontoUnitario / item.precoUnitario) * 100)}%
          </span>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/produtos/${item.produtoId}`} className="font-semibold text-neutral-100 hover:text-primary-400 transition-colors line-clamp-1">
          {item.produtoNome}
        </Link>
        
        {item.plataforma && (
          <span className="inline-block bg-neutral-800 px-2 py-1 rounded text-xs text-neutral-400 mt-1">{item.plataforma}</span>
        )}

        <div className="flex items-center gap-2 mt-2">
          {item.descontoUnitario > 0 ? (
            <>
              <span className="line-through text-neutral-500 text-sm">R$ {item.precoUnitario.toFixed(2)}</span>
              <span className="text-accent-500 font-bold">R$ {item.precoComDesconto.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-accent-500 font-bold">R$ {item.precoUnitario.toFixed(2)}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => handleAtualizarQuantidade(item.id, item.quantidade - 1)} disabled={item.quantidade <= 1} className="w-8 h-8 flex items-center justify-center rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors">
            <Minus size={14} />
          </button>
          <span className="w-10 text-center font-bold text-neutral-100">{item.quantidade}</span>
          <button onClick={() => handleAtualizarQuantidade(item.id, item.quantidade + 1)} disabled={item.quantidade >= item.estoqueDisponivel} className="w-8 h-8 flex items-center justify-center rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors">
            <Plus size={14} />
          </button>
        </div>
        
        <span className="text-xs text-neutral-500 mt-1 block">{item.estoqueDisponivel} disponíveis</span>
      </div>

      <div className="text-right hidden md:block">
        <span className="text-xs text-neutral-500">Subtotal</span>
        <p className="text-lg font-bold text-neutral-100">R$ {item.subtotal.toFixed(2)}</p>
      </div>

      <button onClick={() => handleRemoverItem(item.id)} className="absolute top-2 right-2 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
        <Trash size={18} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingCart className="text-primary-500" size={32} weight="bold" />
            <h1 className="heading-gamer text-3xl">Meu Carrinho</h1>
          </div>
          <p className="text-neutral-400">{totalItens} {totalItens === 1 ? 'item' : 'itens'}</p>
        </div>

        {carrinhoItens.length === 0 ? (
          <div className="card-gaming p-12 text-center max-w-lg mx-auto">
            <ShoppingCart size={64} className="mx-auto text-neutral-600 mb-4" />
            <h2 className="heading-gamer text-xl text-neutral-300 mb-2">Seu carrinho está vazio</h2>
            <p className="text-neutral-500 mb-6">Adicione produtos ao carrinho para continuar</p>
            <button className="btn-primary" onClick={() => navigate('/produtos')}>
              <Package size={18} weight="bold" />
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Lista de Itens */}
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium" onClick={handleLimparCarrinho}>
                  <Trash size={16} />
                  Limpar Carrinho
                </button>
              </div>

              {isAuthenticated 
                ? itens.map((item: CarrinhoItem) => renderServerItem(item))
                : localItens.map(item => renderLocalItem(item))
              }
            </div>

            {/* Resumo */}
            <div className="card-gaming p-6 h-fit lg:sticky lg:top-24">
              <h2 className="heading-gamer text-xl mb-6 pb-4 border-b border-neutral-800">Resumo do Pedido</h2>
              
              {/* Cupom */}
              <div className="mb-4">
                <label className="text-sm text-neutral-400 mb-2 block">Cupom de desconto</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Digite o cupom" className="flex-1 input-gaming text-sm py-2" />
                  <button className="btn-outline px-4 py-2 text-sm">
                    <Tag size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'}):</span>
                  <span>R$ {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Frete:</span>
                  <span className="text-accent-400">Grátis</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-neutral-800 mb-6">
                <span className="text-lg font-semibold text-neutral-100">Total:</span>
                <span className="text-2xl font-bold text-accent-500">R$ {calcularTotal().toFixed(2)}</span>
              </div>

              <button className="w-full btn-primary py-3 flex items-center justify-center gap-2 mb-4" onClick={handleFinalizarCompra}>
                <CreditCard size={20} weight="bold" />
                {isAuthenticated ? 'Finalizar Compra' : 'Fazer Login e Comprar'}
              </button>

              {!isAuthenticated && (
                <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={20} className="text-primary-400" />
                    <span className="font-semibold text-primary-400 text-sm">Faça login para finalizar</span>
                  </div>
                  <p className="text-neutral-400 text-xs">Seu carrinho será sincronizado automaticamente ao fazer login.</p>
                </div>
              )}

              {/* Benefícios */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <Truck size={18} className="text-accent-400" />
                  <span>Frete grátis acima de R$ 199</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <ShieldCheck size={18} className="text-accent-400" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <CreditCard size={18} className="text-accent-400" />
                  <span>Parcele em até 12x sem juros</span>
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
