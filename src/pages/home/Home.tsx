import logoReact from '../../assets/react.svg';
import './Home.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';






function Home() {
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


            <div className="bg-dark-10 flex justify-center py-10">
                <div className='container grid grid-cols-2 text-dark-60'>
                    {/* <div className="flex flex-col gap-4 items-center justify-center py-4">
                        <h2 className='text-5xl font-bold'>Seja bem vinde!</h2>
                        <p className='text-xl'>Os melhores games você encontra aqui!</p>

                        <div className="flex justify-around gap-4">

                            <button className='rounded bg-dark-60 text-dark-10 uppercase
                             py-2 px-4' style={{ letterSpacing: '1.5px' }}>Ver Produtos</button>
                        </div>
                    </div> */}

                    <div className="flex justify-center">
                        <img src={logoReact} className='w-2/3' />

                    </div>
                </div>
            </div>

        </>
    );
}

export default Home;