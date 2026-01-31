import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';

import { Link } from 'react-router-dom';
import news1 from "../../assets/news/news-1.png";
import news2 from "../../assets/news/news-2.png";
import news3 from "../../assets/news/news-3.png";
import news4 from "../../assets/news/news-4.png";

/* --------------------------
  Массив новостей
  - Каждая новость содержит id, title, description и изображение
--------------------------- */
const news = [
  {
    id: 1,
    title: "Global Climate Summit Calls for Urgent Action",
    description: "World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.",
    image: news1
  },
  {
    id: 2,
    title: "Breakthrough in AI Technology Announced",
    description: "A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.",
    image: news2
  },
  {
    id: 3,
    title: "New Space Mission Aims to Explore Distant Galaxies",
    description: "NASA has unveiled plans for a new space mission that will aim to explore distant galaxies, with hopes of uncovering insights into the origins of the universe.",
    image: news3
  },
  {
    id: 4,
    title: "Stock Markets Reach Record Highs Amid Economic Recovery",
    description: "Global stock markets have reached record highs as signs of economic recovery continue to emerge following the challenges posed by the global pandemic.",
    image: news4
  },
  {
    id: 5,
    title: "Innovative New Smartphone Released by Leading Tech Company",
    description: "A leading tech company has released its latest smartphone model, featuring cutting-edge technology, improved battery life, and a sleek new design.",
    image: news2
  }
];

/* --------------------------
  Компонент News
  Отвечает за:
  - Отображение слайдера с новостями
  - Кастомные стрелки навигации с Tailwind
  - Адаптивное отображение слайдов
--------------------------- */
const News = () => {
  return (
    <div className="py-16">
      {/* Заголовок раздела */}
      <h2 className="text-3xl font-semibold mb-6">News</h2>

      {/* --------------------------
        Swiper слайдер
        - slidesPerView, spaceBetween и breakpoints управляют отображением
        - navigation использует кастомные кнопки
      --------------------------- */}
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={{
          nextEl: '.my-next', // селектор кнопки "вперед"
          prevEl: '.my-prev', // селектор кнопки "назад"
        }}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 2, spaceBetween: 50 },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper relative"
      >
        {/* --------------------------
          Кастомные кнопки навигации
          - Белый круглый фон
          - Полупрозрачные до hover
          - Синие стрелки
        --------------------------- */}
        <div className="my-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer opacity-40 hover:opacity-100 transition-opacity duration-300">
          <span className="text-blue-600 text-lg font-bold">‹</span>
        </div>
        <div className="my-next absolute right-0 top-1/2 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer opacity-40 hover:opacity-100 transition-opacity duration-300">
          <span className="text-blue-600 text-lg font-bold">›</span>
        </div>

        {/* --------------------------
          Слайды Swiper
          - Перебираем массив news
          - Каждый элемент рендерим в слайде с заголовком, описанием и изображением
        --------------------------- */}
        {news.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-12">
              {/* Контент новости */}
              <div className="py-4">
                <Link to="/">
                  <h3 className="text-lg font-medium hover:text-blue-500 mb-4">
                    {item.title}
                  </h3>
                </Link>
                <div className="w-12 h-[4px] bg-primary mb-5"></div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              {/* Изображение новости */}
              <div className="flex-shrink-0">
                <img src={item.image} alt="" className="w-full object-cover" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default News;
