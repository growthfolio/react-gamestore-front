import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import produtoService from '../../services/produto.service';
import categoriaService from '../../services/categoria.service';
import Produto from '../../models/produtos/Produto';
import Categoria from '../../models/categorias/Categoria';
import { ShoppingCart, GameController } from '@phosphor-icons/react';

function Home() {
    const navigate = useNavigate();
    const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [produtosResponse, categoriasResponse] = await Promise.all([
                produtoService.listar({ page: 0, size: 8, sort: 'nome,asc' }),
                categoriaService.listar()
            ]);
            setProdutosDestaque(produtosResponse.content);
            setCategorias(categoriasResponse.slice(0, 6));
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };
    const data = [
        { id: '1', image: 'https://cdn2.unrealengine.com/egs-prince-of-persia-lost-crown-carousel-desktop-1920x1080-c7ae57efc8ab.jpg?h=720&quality=medium&resize=1&w=1280' },
        { id: '2', image: 'https://cdn2.unrealengine.com/egs-skull-and-bones-carousel-desktop-1248x702-8814fa009b18.jpg?h=720&quality=medium&resize=1&w=1280' },
        { id: '3', image: 'https://cdn2.unrealengine.com/egs-stalker-2-carousel-desktop-1920x1080-5c65e98f5d81.jpg?h=720&quality=medium&resize=1&w=1280' },
        { id: '4', image: 'https://cdn2.unrealengine.com/egs-horizon-forbidden-west-carousel-desktop-1920x1080-358478b6468a.jpg?h=720&quality=medium&resize=1&w=1280' },
    ];

    return (
        <>
            <div className=' container-slider shadow-lg shadow-dark-30 my-10'>
                <Swiper
                    slidesPerView={1}
                    effect="fade"
                    loop={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: true,
                      }}
                    pagination={{ type: 'progressbar',}}
                    navigation={false}
                    modules={[Pagination, Navigation, Autoplay, EffectFade]}
                    className='mySwiper rounded-b-xl'
                >
                    {data.map((item) => (
                        <SwiperSlide key={item.id}>
                            <img
                                src={item.image}
                                alt="Slider"
                                className='slide-item  rounded-b-xl'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>

            {/* Categorias */}
            <div className="container mx-auto px-6 my-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Explore por Categoria</h2>
                {loading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categorias.map(categoria => (
                            <div
                                key={categoria.id}
                                onClick={() => navigate(`/produtos?categoria=${categoria.id}`)}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer text-center hover:scale-105"
                            >
                                <GameController size={48} className="mx-auto mb-3 text-red-500" />
                                <h3 className="text-white font-semibold">{categoria.nome}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Produtos em Destaque */}
            <div className="container mx-auto px-6 my-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
                    <button
                        onClick={() => navigate('/produtos')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                    >
                        Ver Todos
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">Carregando produtos...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {produtosDestaque.map(produto => (
                            <div
                                key={produto.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                                onClick={() => navigate(`/produtos/${produto.id}`)}
                            >
                                <div className="relative h-64 bg-gray-100">
                                    <img
                                        src={produto.imagens?.[0] || '/placeholder-game.png'}
                                        alt={produto.nome}
                                        className="w-full h-full object-cover"
                                    />
                                    {produto.desconto && produto.desconto > 0 && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            -{produto.desconto}%
                                        </span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{produto.nome}</h3>
                                    
                                    {produto.plataforma && (
                                        <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mb-2">
                                            {produto.plataforma}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-2 mb-2">
                                        {produto.desconto && produto.desconto > 0 ? (
                                            <>
                                                <span className="text-gray-500 line-through text-sm">
                                                    R$ {produto.preco.toFixed(2)}
                                                </span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold text-green-600">
                                                R$ {produto.preco.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {produto.estoque && produto.estoque > 0 ? (
                                        <span className="text-sm text-green-600">Em estoque</span>
                                    ) : (
                                        <span className="text-sm text-red-600 font-bold">Esgotado</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16 my-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-4">Os Melhores Jogos em um Só Lugar</h2>
                    <p className="text-xl mb-8">Explore nosso catálogo completo de games para todas as plataformas</p>
                    <button
                        onClick={() => navigate('/produtos')}
                        className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-all inline-flex items-center gap-2"
                    >
                        <ShoppingCart size={24} weight="bold" />
                        Explorar Catálogo
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;