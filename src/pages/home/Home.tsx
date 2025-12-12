import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import produtoService, { Produto } from '../../services/produto.service';
import categoriaService, { Categoria } from '../../services/categoria.service';
import { ShoppingCart, GameController, Heart, Star, ArrowUp, Fire, Clock, Sparkle, Users, Headset, ShieldCheck } from '@phosphor-icons/react';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useAuth } from '../../contexts/AuthContext';

function Home() {
    const navigate = useNavigate();
    const { adicionarItem } = useCarrinho();
    const { toggleFavorito, isFavorito } = useFavoritos();
    const { isAuthenticated } = useAuth();
    
    const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
    const [produtosOfertas, setProdutosOfertas] = useState<Produto[]>([]);
    const [produtosLancamentos, setProdutosLancamentos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeTab, setActiveTab] = useState<'destaque' | 'lancamentos'>('destaque');
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState(86400); // 24 horas em segundos

    useEffect(() => {
        carregarDados();
        
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 86400);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            
            // Carrega produtos e categorias separadamente para evitar falha total
            const produtosPromise = produtoService.listar({ page: 0, size: 12, sort: 'nome,asc' })
                .catch(err => {
                    console.error('Erro ao carregar produtos:', err);
                    return { content: [] };
                });
                
            const categoriasPromise = categoriaService.listar()
                .catch(err => {
                    console.error('Erro ao carregar categorias:', err);
                    return { content: [] };
                });
            
            const [produtosResponse, categoriasResponse] = await Promise.all([
                produtosPromise,
                categoriasPromise
            ]);
            
            const produtos = produtosResponse.content || [];
            setProdutosDestaque(produtos.slice(0, 8));
            setProdutosOfertas(produtos.filter(p => p.desconto && p.desconto > 0).slice(0, 4));
            setProdutosLancamentos(produtos.slice(8, 16));
            setCategorias(categoriasResponse.content?.slice(0, 6) || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            // Falha silenciosa - define arrays vazios
            setProdutosDestaque([]);
            setProdutosOfertas([]);
            setProdutosLancamentos([]);
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (produto: Produto, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await adicionarItem({ produtoId: produto.id, quantidade: 1 });
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    };

    const handleToggleFavorito = async (produtoId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await toggleFavorito(produtoId);
        } catch (error) {
            console.error('Erro ao favoritar:', error);
        }
    };

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Newsletter:', email);
        setEmail('');
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const heroSlides = [
        { 
            id: '1', 
            image: 'https://cdn2.unrealengine.com/egs-prince-of-persia-lost-crown-carousel-desktop-1920x1080-c7ae57efc8ab.jpg?h=720&quality=medium&resize=1&w=1280',
            title: 'Prince of Persia: The Lost Crown',
            subtitle: 'Aventura épica te aguarda'
        },
        { 
            id: '2', 
            image: 'https://cdn2.unrealengine.com/egs-skull-and-bones-carousel-desktop-1248x702-8814fa009b18.jpg?h=720&quality=medium&resize=1&w=1280',
            title: 'Skull and Bones',
            subtitle: 'Navegue pelos mares perigosos'
        },
        { 
            id: '3', 
            image: 'https://cdn2.unrealengine.com/egs-stalker-2-carousel-desktop-1920x1080-5c65e98f5d81.jpg?h=720&quality=medium&resize=1&w=1280',
            title: 'S.T.A.L.K.E.R. 2',
            subtitle: 'Sobreviva na zona radioativa'
        },
        { 
            id: '4', 
            image: 'https://cdn2.unrealengine.com/egs-horizon-forbidden-west-carousel-desktop-1920x1080-358478b6468a.jpg?h=720&quality=medium&resize=1&w=1280',
            title: 'Horizon Forbidden West',
            subtitle: 'Explore o oeste proibido'
        },
    ];

    const testimonials = [
        { name: 'João Silva', text: 'Melhor loja de jogos! Entrega rápida e preços imbatíveis.', rating: 5 },
        { name: 'Maria Santos', text: 'Atendimento excelente e grande variedade de jogos.', rating: 5 },
        { name: 'Pedro Costa', text: 'Compro aqui há anos. Sempre confiável e seguro.', rating: 5 },
    ];

    const ProductCard = ({ produto }: { produto: Produto }) => (
        <div
            className="group card-gaming overflow-hidden hover:shadow-glow-md hover:-translate-y-1 cursor-pointer relative"
            onClick={() => navigate(`/produtos/${produto.id}`)}
        >
            <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img
                    src={produto.imagens?.[0] || '/placeholder-game.png'}
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                />
                {produto.desconto && produto.desconto > 0 && (
                    <span className="absolute top-2 right-2 badge-gaming bg-error-500 text-white px-3 py-1 rounded-full shadow-glow-sm">
                        -{produto.desconto}%
                    </span>
                )}
                <button
                    onClick={(e) => handleToggleFavorito(produto.id, e)}
                    className={`absolute top-2 left-2 p-2 rounded-full transition-all ${
                        isFavorito(produto.id) ? 'bg-accent-500 text-neutral-900 shadow-glow-neon' : 'bg-neutral-800/90 text-neutral-300 hover:bg-accent-500 hover:text-neutral-900'
                    }`}
                >
                    <Heart size={20} weight={isFavorito(produto.id) ? 'fill' : 'regular'} />
                </button>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={(e) => handleAddToCart(produto, e)}
                        className="btn-primary px-6 py-3 flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform"
                    >
                        <ShoppingCart size={20} weight="bold" />
                        <span className="cta-gaming">Adicionar</span>
                    </button>
                </div>
            </div>

            <div className="p-4">
                <h3 className="heading-sm text-neutral-0 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary-400 transition-colors">{produto.nome}</h3>
                
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} weight="fill" className="text-yellow-400" />
                    ))}
                    <span className="body-sm text-neutral-400 ml-1">(4.8)</span>
                </div>

                {produto.plataforma && (
                    <span className="badge-gaming bg-neutral-800 text-neutral-300 px-2 py-1 rounded mb-2">
                        {produto.plataforma}
                    </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                    {produto.desconto && produto.desconto > 0 ? (
                        <>
                            <span className="text-neutral-500 line-through body-sm">
                                R$ {produto.preco.toFixed(2)}
                            </span>
                            <span className="price-gaming text-xl">
                                R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className="price-gaming text-xl">
                            R$ {produto.preco.toFixed(2)}
                        </span>
                    )}
                </div>

                {produto.estoque && produto.estoque > 0 ? (
                    <span className="body-sm text-success-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                        Em estoque
                    </span>
                ) : (
                    <span className="body-sm text-error-500 font-bold">Esgotado</span>
                )}
            </div>
        </div>
    );

    const SkeletonCard = () => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-300"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    );

    return (
        <>
            {/* Hero Section com Overlay */}
            <div className="container-slider shadow-glow-lg my-10 relative">
                <Swiper
                    slidesPerView={1}
                    effect="fade"
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{ 
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next-gaming',
                        prevEl: '.swiper-button-prev-gaming',
                    }}
                    modules={[Pagination, Navigation, Autoplay, EffectFade]}
                    className="mySwiper rounded-gaming overflow-hidden border border-neutral-800"
                >
                    {heroSlides.map((item, index) => (
                        <SwiperSlide key={item.id}>
                            <div className="relative group">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="slide-item w-full h-[500px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-secondary-900/20"></div>
                                </div>
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white px-6 max-w-4xl">
                                        <div className="mb-4">
                                            <span className="badge-gaming bg-accent-500 text-neutral-900 px-4 py-2 rounded-full">
                                                DESTAQUE #{index + 1}
                                            </span>
                                        </div>
                                        <h1 className="heading-gamer text-4xl md:text-6xl mb-6 text-glow-primary animate-fade-in">
                                            {item.title}
                                        </h1>
                                        <p className="body-xl mb-8 text-neutral-200 max-w-2xl mx-auto">
                                            {item.subtitle}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button
                                                onClick={() => navigate('/produtos')}
                                                className="btn-primary px-8 py-4 text-lg transform hover:scale-105 shadow-glow-md inline-flex items-center gap-3"
                                            >
                                                <Fire size={24} weight="fill" />
                                                <span className="cta-gaming">Explorar Agora</span>
                                            </button>
                                            <button
                                                onClick={() => navigate('/produtos')}
                                                className="btn-outline px-8 py-4 text-lg inline-flex items-center gap-3"
                                            >
                                                <GameController size={24} weight="bold" />
                                                <span className="cta-gaming">Ver Jogos</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Gaming overlay effects */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                    <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    
                    {/* Custom Navigation Buttons */}
                    <div className="swiper-button-prev-gaming absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-900/80 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all cursor-pointer group border border-neutral-700 hover:border-primary-500">
                        <svg className="w-6 h-6 text-neutral-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div className="swiper-button-next-gaming absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-900/80 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all cursor-pointer group border border-neutral-700 hover:border-primary-500">
                        <svg className="w-6 h-6 text-neutral-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Swiper>
            </div>

            {/* Estatísticas */}
            <div className="bg-neutral-950 border-y border-neutral-800 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="transform hover:scale-105 transition-transform group">
                            <GameController size={48} className="mx-auto mb-3 text-primary-500 group-hover:text-primary-400 transition-colors" />
                            <h3 className="heading-md text-accent-400 text-glow-accent">500+</h3>
                            <p className="body-base text-neutral-300">Jogos Disponíveis</p>
                        </div>
                        <div className="transform hover:scale-105 transition-transform group">
                            <Users size={48} className="mx-auto mb-3 text-secondary-500 group-hover:text-secondary-400 transition-colors" />
                            <h3 className="heading-md text-accent-400 text-glow-accent">50K+</h3>
                            <p className="body-base text-neutral-300">Clientes Satisfeitos</p>
                        </div>
                        <div className="transform hover:scale-105 transition-transform group">
                            <Headset size={48} className="mx-auto mb-3 text-accent-500 group-hover:text-accent-400 transition-colors" />
                            <h3 className="heading-md text-accent-400 text-glow-accent">24/7</h3>
                            <p className="body-base text-neutral-300">Suporte Online</p>
                        </div>
                        <div className="transform hover:scale-105 transition-transform group">
                            <ShieldCheck size={48} className="mx-auto mb-3 text-primary-500 group-hover:text-primary-400 transition-colors" />
                            <h3 className="heading-md text-accent-400 text-glow-accent">100%</h3>
                            <p className="body-base text-neutral-300">Jogos Originais</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ofertas Especiais com Countdown */}
            {produtosOfertas.length > 0 && (
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12 my-12">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Fire size={32} weight="fill" className="animate-pulse text-accent-400" />
                                <h2 className="heading-gamer heading-lg text-glow-accent">Ofertas Relâmpago</h2>
                                <Fire size={32} weight="fill" className="animate-pulse text-accent-400" />
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <Clock size={28} weight="fill" className="text-primary-400" />
                                <span className="heading-sm text-primary-400 font-accent">Termina em: {formatTime(timeLeft)}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {produtosOfertas.map(produto => (
                                <ProductCard key={produto.id} produto={produto} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Categorias */}
            <div className="container mx-auto px-6 my-12">
                <h2 className="heading-lg mb-8 text-center flex items-center justify-center gap-3 text-secondary-400">
                    <Sparkle size={32} weight="fill" className="text-secondary-500" />
                    <span className="text-glow-secondary">Explore por Categoria</span>
                    <Sparkle size={32} weight="fill" className="text-secondary-500" />
                </h2>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categorias.map(categoria => (
                            <div
                                key={categoria.id}
                                className="group relative overflow-hidden rounded-lg cursor-pointer"
                                onClick={() => navigate(`/produtos?categoria=${categoria.id}`)}
                            >
                                <div className="aspect-square bg-gradient-gaming p-6 flex flex-col items-center justify-center text-white transition-all group-hover:scale-105 group-hover:shadow-glow-md rounded-gaming">
                                    <GameController size={48} className="mb-3 group-hover:text-accent-300 transition-colors" />
                                    <h3 className="heading-sm text-center group-hover:text-glow-primary transition-all">{categoria.tipo}</h3>
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity rounded-gaming"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs: Produtos em Destaque / Lançamentos */}
            <div className="container mx-auto px-6 my-12">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('destaque')}
                            className={`px-6 py-3 rounded-gaming transition-all ${
                                activeTab === 'destaque'
                                    ? 'btn-primary'
                                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-primary-400'
                            }`}
                        >
                            <span className="cta-gaming flex items-center gap-2">
                                <Fire size={20} weight="fill" />
                                Em Destaque
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('lancamentos')}
                            className={`px-6 py-3 rounded-gaming transition-all ${
                                activeTab === 'lancamentos'
                                    ? 'btn-accent'
                                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-accent-400'
                            }`}
                        >
                            <span className="cta-gaming flex items-center gap-2">
                                <Sparkle size={20} weight="fill" />
                                Lançamentos
                            </span>
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/produtos')}
                        className="btn-outline px-6 py-3"
                    >
                        <span className="cta-gaming">Ver Todos</span>
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {(activeTab === 'destaque' ? produtosDestaque : produtosLancamentos).map(produto => (
                            <ProductCard key={produto.id} produto={produto} />
                        ))}
                    </div>
                )}
            </div>

            {/* Depoimentos */}
            <div className="bg-neutral-900 py-16">
                <div className="container mx-auto px-6">
                    <h2 className="heading-lg text-center mb-12 text-primary-400 text-glow-primary">O que nossos clientes dizem</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="card-gaming p-6 hover:shadow-glow-sm transition-all">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={20} weight="fill" className="text-accent-400" />
                                    ))}
                                </div>
                                <p className="body-lg text-neutral-300 mb-4 italic">"{testimonial.text}"</p>
                                <p className="heading-sm text-neutral-100">- {testimonial.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-gaming py-16 my-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="heading-gamer heading-lg mb-6 text-glow-primary">Os Melhores Jogos em um Só Lugar</h2>
                    <p className="body-xl mb-8 text-neutral-200">Explore nosso catálogo completo de games para todas as plataformas</p>
                    <button
                        onClick={() => navigate('/produtos')}
                        className="btn-accent px-8 py-4 text-lg inline-flex items-center gap-3 transform hover:scale-105"
                    >
                        <ShoppingCart size={24} weight="bold" />
                        <span className="cta-gaming">Explorar Catálogo</span>
                    </button>
                </div>
            </div>

            {/* Newsletter */}
            <div className="bg-neutral-950 border-t border-neutral-800 py-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="heading-lg mb-4 text-secondary-400 text-glow-secondary">Fique por dentro das novidades</h2>
                    <p className="body-lg mb-8 text-neutral-300">Receba ofertas exclusivas e lançamentos em primeira mão</p>
                    <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu e-mail"
                            required
                            className="input-gaming flex-1"
                        />
                        <button 
                            type="submit"
                            className="btn-primary px-6 py-3"
                        >
                            <span className="cta-gaming">Inscrever</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Botão Voltar ao Topo */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-500 text-white p-4 rounded-full shadow-glow-md transition-all transform hover:scale-110 z-50 animate-bounce hover:shadow-glow-lg"
                    aria-label="Voltar ao topo"
                >
                    <ArrowUp size={24} weight="bold" />
                </button>
            )}
        </>
    );
}

export default Home;
