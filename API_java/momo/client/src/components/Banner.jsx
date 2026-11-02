import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
        <LeftOutlined className="text-xl text-gray-800" />
    </button>
);

const CustomNextArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
        <RightOutlined className="text-xl text-gray-800" />
    </button>
);

function Banner() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        fade: true,
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        appendDots: (dots) => (
            <div style={{ bottom: '24px' }}>
                <ul className="flex items-center justify-center gap-2"> {dots} </ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-3 h-3 bg-white/60 rounded-full hover:bg-white transition-all duration-300 cursor-pointer" />
        ),
    };

    const images = [
        {
            id: 1,
            url: 'https://theme.hstatic.net/1000237375/1000756917/14/slider_item_1_image.jpg?v=1840',
            title: 'Bộ sưu tập mới',
            subtitle: 'Khám phá xu hướng thời trang 2024',
        },
        {
            id: 2,
            url: 'https://theme.hstatic.net/1000237375/1000756917/14/slider_item_2_image.jpg?v=1840',
            title: 'Ưu đãi đặc biệt',
            subtitle: 'Giảm giá lên đến 50%',
        },
        {
            id: 3,
            url: 'https://theme.hstatic.net/1000237375/1000756917/14/slider_item_4_image.jpg?v=1840',
            title: 'Phong cách độc đáo',
            subtitle: 'Tạo dấu ấn riêng của bạn',
        },
    ];

    return (
        <div className="pt-20 bg-gray-50">
            <div className="banner-container relative overflow-hidden">
                <Slider {...settings}>
                    {images.map((image) => (
                        <div key={image.id} className="relative">
                            <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={image.url}
                                    alt={image.title}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Banner;
