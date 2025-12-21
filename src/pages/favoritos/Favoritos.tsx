import { useNavigate, Link } from 'react-router-dom';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, ShoppingCart, Trash, GameController, User, Star, ShareNetwork } from '@phosphor-icons/react';
import { useToast } from '../../contexts/ToastContext';
import { getProductUrl } from '../../utils/productUrl';

function Favoritos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favoritos, localFavoritos, toggleFavorito, totalFavoritos } = useFavoritos();
  const { adicionarItem } = useCarrinho();
  const toast = useToast();

  const handleRemover = async (produtoId: number) => {
    try {
      await toggleFavorito(produtoId);
      toast.success('Removido', 'Produto removido dos favoritos');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const handleAddToCart = async (produtoId: number) => {
    try {
      await adicionarItem({ produtoId, quantidade: 1 });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const handleAddAllToCart = async () => {
    if (isAuthenticated) {
      for (const item of favoritos) {
        try {
          await adicionarItem({ produtoId: item.produto.id, quantidade: 1 });
        } catch {
          // Continua com os próximos
        }
      }
    } else {
      for (const item of localFavoritos) {
        try {
          await adicionarItem({ produtoId: item.produtoId, quantidade: 1 });
        } catch {
          // Continua com os próximos
        }
      }
    }
    toast.success('Adicionados!', 'Todos os favoritos foram adicionados ao carrinho');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Confira minha lista de favoritos na GameStore!`;
    
    // Tenta usar Web Share API (mobile/navegadores modernos)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Meus Favoritos - GameStore', text, url });
        return;
      } catch (err) {
        // Usuário cancelou ou erro - fallback para clipboard
        if ((err as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', err);
        }
      }
    }
    
    // Fallback: copia para clipboard
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      toast.success('Link copiado!', 'Compartilhe sua lista de favoritos');
    } catch {
      toast.error('Erro', 'Não foi possível copiar o link');
    }
  };

  // Renderiza favorito local (visitante)
  const renderLocalFavorito = (item: typeof localFavoritos[0]) => {
    const precoFinal = item.desconto ? item.preco! * (1 - item.desconto / 100) : item.preco!;
    
    return (
      <div key={item.produtoId} className="card-gaming overflow-hidden group">
        <Link to={getProductUrl({ id: item.produtoId, slug: item.slug, nome: item.nome })} className="block relative aspect-[3/4] bg-neutral-800 overflow-hidden">
          {item.imagem ? (
            <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GameController size={48} className="text-neutral-600" />
            </div>
          )}
          {item.desconto && item.desconto > 0 && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-accent-500 text-neutral-900 text-xs font-bold rounded-full">
              -{item.desconto}%
            </span>
          )}
        </Link>

        <div className="p-4">
          <Link to={`/produtos/${item.produtoId}`} className="font-semibold text-neutral-100 hover:text-primary-400 transition-colors line-clamp-1 block mb-2">
            {item.nome}
          </Link>

          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} weight="fill" className="text-yellow-400" />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {item.desconto && item.desconto > 0 ? (
              <>
                <span className="text-xs text-neutral-500 line-through">R$ {item.preco?.toFixed(2)}</span>
                <span className="text-lg font-bold text-accent-400">R$ {precoFinal.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-accent-400">R$ {item.preco?.toFixed(2)}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => handleAddToCart(item.produtoId)} className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2">
              <ShoppingCart size={16} weight="bold" />
              Adicionar
            </button>
            <button onClick={() => handleRemover(item.produtoId)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderiza favorito do servidor (logado)
  const renderServerFavorito = (item: typeof favoritos[0]) => {
    const produto = item.produto;
    // Usa precoComDesconto se disponível, senão calcula
    const precoFinal = produto.precoComDesconto || produto.preco;
    const temDesconto = produto.precoComDesconto && produto.precoComDesconto < produto.preco;
    
    return (
      <div key={item.id} className="card-gaming overflow-hidden group">
        <Link to={getProductUrl(produto)} className="block relative aspect-[3/4] bg-neutral-800 overflow-hidden">
          {produto.imagemPrincipal ? (
            <img src={produto.imagemPrincipal} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GameController size={48} className="text-neutral-600" />
            </div>
          )}
          {temDesconto && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-accent-500 text-neutral-900 text-xs font-bold rounded-full">
              OFERTA
            </span>
          )}
        </Link>

        <div className="p-4">
          <Link to={getProductUrl(produto)} className="font-semibold text-neutral-100 hover:text-primary-400 transition-colors line-clamp-1 block mb-1">
            {produto.nome}
          </Link>

          {produto.plataforma && (
            <span className="text-xs text-neutral-500 mb-2 block">{produto.plataforma}</span>
          )}

          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} weight="fill" className="text-yellow-400" />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {temDesconto ? (
              <>
                <span className="text-xs text-neutral-500 line-through">R$ {produto.preco.toFixed(2)}</span>
                <span className="text-lg font-bold text-accent-400">R$ {precoFinal.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-accent-400">R$ {produto.preco.toFixed(2)}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => handleAddToCart(produto.id)} className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2">
              <ShoppingCart size={16} weight="bold" />
              Adicionar
            </button>
            <button onClick={() => handleRemover(produto.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const hasItems = isAuthenticated ? favoritos.length > 0 : localFavoritos.length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-accent-500" size={32} weight="fill" />
              <h1 className="heading-gamer text-3xl">Meus Favoritos</h1>
            </div>
            <p className="text-neutral-400">{totalFavoritos} {totalFavoritos === 1 ? 'item' : 'itens'}</p>
          </div>

          {hasItems && (
            <div className="flex gap-3">
              <button onClick={handleShare} className="btn-outline px-4 py-2 flex items-center gap-2 text-sm">
                <ShareNetwork size={18} />
                Compartilhar
              </button>
              <button onClick={handleAddAllToCart} className="btn-primary px-4 py-2 flex items-center gap-2 text-sm">
                <ShoppingCart size={18} weight="bold" />
                Adicionar Todos
              </button>
            </div>
          )}
        </div>

        {/* Login Banner para visitantes */}
        {!isAuthenticated && hasItems && (
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <User size={24} className="text-primary-400" />
              <div>
                <p className="font-semibold text-primary-400">Faça login para salvar seus favoritos</p>
                <p className="text-neutral-400 text-sm">Seus favoritos serão sincronizados automaticamente</p>
              </div>
            </div>
            <Link to="/login" className="btn-primary px-6 py-2">Fazer Login</Link>
          </div>
        )}

        {!hasItems ? (
          <div className="card-gaming p-12 text-center max-w-lg mx-auto">
            <Heart size={64} className="mx-auto text-neutral-600 mb-4" />
            <h2 className="heading-gamer text-xl text-neutral-300 mb-2">Nenhum favorito ainda</h2>
            <p className="text-neutral-500 mb-6">Adicione jogos aos favoritos para acompanhá-los</p>
            <button className="btn-primary" onClick={() => navigate('/produtos')}>
              <GameController size={18} weight="bold" />
              Explorar Jogos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {isAuthenticated 
              ? favoritos.map(item => renderServerFavorito(item))
              : localFavoritos.map(item => renderLocalFavorito(item))
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;
