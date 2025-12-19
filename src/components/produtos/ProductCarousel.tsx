import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Heart, ShoppingCart, Star, GameController, CaretLeft, CaretRight } from '@phosphor-icons/react';
import produtoService, { Produto } from '../../services/produto.service';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { getProductUrl } from '../../utils/productUrl';
import 'swiper/css';
import 'swiper/css/navigation';

interface ProductCarouselProps {
  title: string;
  icon?: React.ReactNode;
  categoriaId?: number;
  excludeId?: number;
  limit?: number;
}

function ProductCarousel({ title, icon, categoriaId, excludeId, limit = 8 }: ProductCarouselProps) {
  const navigate = useNavigate();
  const { adicionarItem } = useCarrinho();
  const { toggleFavorito, isFavorito } = useFavoritos();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselId = `carousel-${title.replace(/\s/g, '-').toLowerCase()}`;

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const params: any = { page: 0, size: limit + 1 };
        if (categoriaId) params.categoriaId = categoriaId;
        
        const response = await produtoService.listar(params);
        let items = response.content || [];
        
        if (excludeId) {
          items = items.filter(p => p.id !== excludeId);
        }
        
        setProdutos(items.slice(0, limit));
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, [categoriaId, excludeId, limit]);

  const handleAddToCart = async (produto: Produto, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await adicionarItem({ produtoId: produto.id, quantidade: 1 });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const handleToggleFavorito = async (produtoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorito(produtoId);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="heading-gamer text-xl mb-6 flex items-center gap-3">
          {icon}
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-gaming animate-pulse">
              <div className="aspect-[3/4] bg-neutral-800" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-neutral-700 rounded w-3/4" />
                <div className="h-5 bg-neutral-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (produtos.length === 0) return null;

  return (
    <div className="py-8 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-gamer text-xl flex items-center gap-3">
          {icon}
          {title}
        </h2>
        <div className="flex gap-2">
          <button className={`${carouselId}-prev p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50`}>
            <CaretLeft size={20} className="text-neutral-300" />
          </button>
          <button className={`${carouselId}-next p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50`}>
            <CaretRight size={20} className="text-neutral-300" />
          </button>
        </div>
      </div>

      <Swiper
        slidesPerView={2}
        spaceBetween={16}
        navigation={{
          prevEl: `.${carouselId}-prev`,
          nextEl: `.${carouselId}-next`,
        }}
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {produtos.map((produto) => (
          <SwiperSlide key={produto.id}>
            <div
              onClick={() => navigate(getProductUrl(produto))}
              className="card-gaming overflow-hidden group cursor-pointer hover:shadow-glow-sm transition-all"
            >
              <div className="relative aspect-[3/4] bg-neutral-800 overflow-hidden">
                {produto.imagens?.[0] ? (
                  <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GameController size={40} className="text-neutral-600" />
                  </div>
                )}
                
                {produto.desconto && produto.desconto > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent-500 text-neutral-900 text-xs font-bold rounded-full">
                    -{produto.desconto}%
                  </span>
                )}

                <button
                  onClick={(e) => handleToggleFavorito(produto.id, e)}
                  className={`absolute top-2 left-2 p-1.5 rounded-full transition-all ${
                    isFavorito(produto.id) ? 'bg-accent-500 text-neutral-900' : 'bg-neutral-800/80 text-neutral-300 hover:bg-accent-500 hover:text-neutral-900'
                  }`}
                >
                  <Heart size={16} weight={isFavorito(produto.id) ? 'fill' : 'regular'} />
                </button>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => handleAddToCart(produto, e)}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                  >
                    <ShoppingCart size={16} weight="bold" />
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold text-neutral-100 mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
                  {produto.nome}
                </h3>
                
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} weight="fill" className="text-yellow-400" />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {produto.desconto && produto.desconto > 0 ? (
                    <>
                      <span className="text-xs text-neutral-500 line-through">R$ {produto.preco.toFixed(2)}</span>
                      <span className="text-sm font-bold text-accent-400">
                        R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-accent-400">R$ {produto.preco.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductCarousel;
