import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ShareNetwork, WhatsappLogo, TwitterLogo, Link as LinkIcon, Warning, User } from '@phosphor-icons/react';
import { LoadingOverlay } from '../../components/loaders';
import { ProdutoDetalhe } from '../../models/produtos/Media';
import produtoService from '../../services/produto.service';
import avaliacaoService, { Avaliacao, MediaAvaliacao } from '../../services/avaliacao.service';
import { useAuth } from '../../contexts/AuthContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage, ErrorMessages } from '../../utils/errorHandler';
import FormularioAvaliacao from '../../components/avaliacoes/formularioAvaliacao/FormularioAvaliacao';
import LoginSuggestionModal from '../../components/modals/LoginSuggestionModal';
import ProductCarousel from '../../components/produtos/ProductCarousel';
import MediaGallery from '../../components/produtos/MediaGallery';

function DetalheProduto() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { adicionarItem } = useCarrinho();
  const { isFavorito, toggleFavorito } = useFavoritos();
  const toast = useToast();

  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState<MediaAvaliacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [favorito, setFavorito] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction] = useState<'favorite' | 'cart' | 'checkout'>('cart');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'descricao' | 'avaliacoes'>('descricao');

  useEffect(() => {
    // Scroll para o topo ao carregar a página
    window.scrollTo(0, 0);
    
    if (slug) {
      carregarProduto();
      carregarAvaliacoes();
    }
  }, [slug]);

  useEffect(() => {
    if (produto?.id) {
      setFavorito(isFavorito(produto.id));
      // Salvar no histórico de vistos recentemente
      saveToRecentlyViewed(produto.id);
    }
  }, [produto?.id, isFavorito]);

  const saveToRecentlyViewed = (produtoId: number) => {
    const key = 'gamestore_recently_viewed';
    const saved = localStorage.getItem(key);
    let items: number[] = saved ? JSON.parse(saved) : [];
    items = [produtoId, ...items.filter(i => i !== produtoId)].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(items));
  };

  async function carregarProduto() {
    try {
      setIsLoading(true);
      const produtoData = await produtoService.buscarPorSlug(slug!);
      setProduto(produtoData);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      toast.error('Erro', getErrorMessage(error, ErrorMessages.loadFailed('produto')));
      navigate('/produtos');
    } finally {
      setIsLoading(false);
    }
  }

  async function carregarAvaliacoes() {
    if (!produto?.id) return;
    
    try {
      const [avaliacoesData, mediaData] = await Promise.all([
        avaliacaoService.listarPorProduto(produto.id),
        avaliacaoService.buscarMedia(produto.id),
      ]);
      setAvaliacoes(avaliacoesData);
      setMediaAvaliacao(mediaData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  }

  // Recarregar avaliações quando produto for carregado
  useEffect(() => {
    if (produto?.id) {
      carregarAvaliacoes();
    }
  }, [produto?.id]);

  async function handleAdicionarCarrinho() {
    if (!produto?.id) return;
    
    try {
      await adicionarItem({ produtoId: produto.id, quantidade });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  }

  async function handleToggleFavorito() {
    if (!produto?.id) return;
    
    try {
      const novoStatus = await toggleFavorito(produto.id);
      setFavorito(novoStatus);
      toast.success(novoStatus ? 'Favoritado!' : 'Removido', novoStatus ? 'Produto adicionado aos favoritos' : 'Produto removido dos favoritos');
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Confira ${produto?.nome} na GameStore!`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copiado!', 'O link foi copiado para a área de transferência');
        break;
    }
    setShowShareMenu(false);
  };

  const renderStars = (nota: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={20} weight={i < nota ? 'fill' : 'regular'} className={i < nota ? 'text-yellow-400' : 'text-neutral-600'} />
    ));
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message="Carregando produto..." />;
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-neutral-950 py-12">
        <div className="container mx-auto text-center">
          <p className="text-xl text-neutral-400">Produto não encontrado</p>
          <Link to="/produtos" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">Voltar para produtos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
          <Link to="/home" className="hover:text-primary-400">Home</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-primary-400">Jogos</Link>
          <span>/</span>
          <span className="text-neutral-200 truncate max-w-[200px]">{produto.nome}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria de Mídia (Imagens e Vídeos) */}
          <div className="relative">
            <MediaGallery
              videos={produto.midia?.videos}
              screenshots={produto.midia?.screenshots}
              artworks={produto.midia?.artworks}
              fallbackImage={produto.midia?.capa}
              productName={produto.nome}
            />
            
            {/* Share Button - posicionado sobre a galeria */}
            <div className="absolute top-4 right-4 z-20">
              <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 bg-neutral-900/80 rounded-full hover:bg-neutral-800 transition-colors">
                <ShareNetwork size={20} className="text-neutral-300" />
              </button>
              
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 bg-neutral-800 rounded-gaming border border-neutral-700 overflow-hidden shadow-lg z-10">
                  <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 w-full text-left text-sm">
                    <WhatsappLogo size={18} className="text-green-500" /> WhatsApp
                  </button>
                  <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 w-full text-left text-sm">
                    <TwitterLogo size={18} className="text-blue-400" /> Twitter
                  </button>
                  <button onClick={() => handleShare('copy')} className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 w-full text-left text-sm">
                    <LinkIcon size={18} className="text-neutral-400" /> Copiar Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="heading-gamer text-2xl md:text-3xl text-neutral-100 mb-2">{produto.nome}</h1>
              
              {/* Avaliação */}
              {mediaAvaliacao && mediaAvaliacao.total > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(Math.round(mediaAvaliacao.media))}</div>
                  <span className="text-neutral-400">{mediaAvaliacao.media.toFixed(1)} ({mediaAvaliacao.total} avaliações)</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {produto.plataforma && (
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">{produto.plataforma}</span>
              )}
              {produto.categoria?.tipo && (
                <Link to={`/produtos?categoria=${produto.categoria.id}`} className="px-3 py-1 bg-secondary-500/20 text-secondary-400 rounded-full text-sm hover:bg-secondary-500/30 transition-colors">
                  {produto.categoria.tipo}
                </Link>
              )}
            </div>

            {/* Preço */}
            <div className="card-gaming p-4">
              {produto.desconto && produto.desconto > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500 line-through text-lg">R$ {produto.preco.toFixed(2)}</span>
                    <span className="bg-accent-500 text-neutral-950 px-2 py-1 rounded text-sm font-bold">-{produto.desconto}%</span>
                  </div>
                  <div className="text-3xl font-bold text-accent-500">R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}</div>
                </>
              ) : (
                <div className="text-3xl font-bold text-accent-500">R$ {produto.preco.toFixed(2)}</div>
              )}
              
              {/* Estoque baixo */}
              {produto.estoque > 0 && produto.estoque <= 5 && (
                <div className="flex items-center gap-2 mt-2 text-amber-400 text-sm">
                  <Warning size={16} weight="fill" />
                  Últimas {produto.estoque} unidades!
                </div>
              )}
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-neutral-500">Desenvolvedor:</span><p className="font-semibold text-neutral-200">{produto.desenvolvedor || '-'}</p></div>
              <div><span className="text-neutral-500">Publisher:</span><p className="font-semibold text-neutral-200">{produto.publisher || '-'}</p></div>
              <div><span className="text-neutral-500">Plataforma:</span><p className="font-semibold text-neutral-200">{produto.plataforma || '-'}</p></div>
              <div><span className="text-neutral-500">Estoque:</span><p className="font-semibold text-neutral-200">{produto.estoque} unidades</p></div>
            </div>

            {/* Ações */}
            {produto.ativo && produto.estoque > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-neutral-300 font-medium">Quantidade:</label>
                  <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="px-3 py-2 hover:bg-neutral-800 text-neutral-300 transition-colors">-</button>
                    <input type="number" value={quantidade} onChange={(e) => setQuantidade(Math.max(1, Math.min(produto.estoque, Number(e.target.value))))} className="w-16 text-center border-x border-neutral-700 bg-neutral-900 text-neutral-100" min="1" max={produto.estoque} />
                    <button onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))} className="px-3 py-2 hover:bg-neutral-800 text-neutral-300 transition-colors">+</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleAdicionarCarrinho} className="btn-primary flex-1 py-3 px-6 flex items-center justify-center gap-2">
                    <ShoppingCart size={24} weight="bold" />
                    Adicionar ao Carrinho
                  </button>
                  <button
                    onClick={handleToggleFavorito}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      favorito ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart size={24} weight={favorito ? 'fill' : 'regular'} />
                  </button>
                </div>

                {!isAuthenticated && (
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={24} className="text-primary-400" />
                      <h3 className="text-primary-400 font-semibold">Crie sua conta e aproveite!</h3>
                    </div>
                    <p className="text-neutral-300 text-sm mb-3">Faça login para acompanhar seus pedidos e sincronizar seu carrinho.</p>
                    <div className="flex gap-2">
                      <Link to="/login" className="btn-primary text-sm py-2 px-4 flex-1 text-center">Fazer Login</Link>
                      <Link to="/cadastro" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm py-2 px-4 rounded-lg transition-colors border border-neutral-600 flex-1 text-center">Criar Conta</Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">Produto indisponível no momento</div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-neutral-800">
            <button onClick={() => setActiveTab('descricao')} className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'descricao' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-neutral-400 hover:text-neutral-200'}`}>
              Descrição
            </button>
            <button onClick={() => setActiveTab('avaliacoes')} className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'avaliacoes' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-neutral-400 hover:text-neutral-200'}`}>
              Avaliações ({mediaAvaliacao?.total || 0})
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'descricao' ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{produto.descricao || 'Sem descrição disponível.'}</p>
              </div>
            ) : (
              <div>
                <FormularioAvaliacao produtoId={produto.id} onAvaliacaoEnviada={carregarAvaliacoes} />
                
                {mediaAvaliacao && mediaAvaliacao.total > 0 ? (
                  <div className="space-y-6 mt-8">
                    <div className="card-gaming p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-accent-500">{mediaAvaliacao.media.toFixed(1)}</div>
                        <div>
                          <div className="flex mb-2">{renderStars(Math.round(mediaAvaliacao.media))}</div>
                          <p className="text-neutral-400">Baseado em {mediaAvaliacao.total} avaliações</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {avaliacoes.map((avaliacao) => (
                        <div key={avaliacao.id} className="card-gaming p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-neutral-100">{avaliacao.usuario.nome}</p>
                              <div className="flex mt-1">{renderStars(avaliacao.nota)}</div>
                            </div>
                            <span className="text-sm text-neutral-500">{new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {avaliacao.comentario && <p className="text-neutral-300 mt-2">{avaliacao.comentario}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-500 text-center py-8">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Produtos Relacionados */}
        {produto.categoria && (
          <ProductCarousel
            title="Produtos Relacionados"
            categoriaId={produto.categoria.id}
            excludeId={produto.id}
            icon={<span className="text-secondary-400">🎮</span>}
          />
        )}

        <ProductCarousel
          title="Você também pode gostar"
          excludeId={produto.id}
          icon={<span className="text-accent-400">⭐</span>}
        />
      </div>

      <LoginSuggestionModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} action={loginAction} productName={produto?.nome} />
    </div>
  );
}

export default DetalheProduto;
