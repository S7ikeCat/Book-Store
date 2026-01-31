import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import BookCard from '../books/BookCard';
import type { Book } from './TopSellers';

/* --------------------------
  Компонент Recommended
  Отвечает за:
  - Загрузку списка книг
  - Отображение слайдера с рекомендуемыми книгами
  - Кастомные стрелки навигации с Tailwind
--------------------------- */
const Recommended = () => {
  // Состояние для списка книг
  const [books, setBooks] = useState<Book[]>([]);

  /* --------------------------
    useEffect для загрузки данных
    Загружаем книги из books.json один раз при монтировании
  --------------------------- */
  useEffect(() => {
    fetch("books.json")
      .then(res => res.json())
      .then((data: Book[]) => setBooks(data));
  }, []);

  return (
    <div className="py-16">
      {/* Заголовок раздела */}
      <h2 className="text-3xl font-semibold mb-6">Recommended For You</h2>

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
          1180: { slidesPerView: 3, spaceBetween: 50 },
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
          - Берем книги с 8 по 18 (например, рекомендуемые)
          - Для каждой книги рендерим компонент BookCard
        --------------------------- */}
        {books.length > 0 &&
          books.slice(8, 18).map((book, i) => (
            <SwiperSlide key={i}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Recommended;
