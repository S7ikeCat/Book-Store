import { useEffect, useState } from 'react';
import BookCard from '../books/BookCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* --------------------------
  Тип данных книги
--------------------------- */
export type Book = {
  _id: number;           // уникальный ID книги
  title: string;         // название книги
  description: string;   // краткое описание
  newPrice: number;      // текущая цена
  oldPrice: number;      // старая цена (если есть скидка)
  coverImage: string;    // путь к обложке
  category: string;      // жанр книги
};

/* --------------------------
  Список категорий для фильтрации
--------------------------- */
const categories = ["All", "Business", "Fiction", "Horror", "Adventure"];

/* --------------------------
  Компонент TopSellers
  Отвечает за:
  - Загрузку списка книг
  - Фильтрацию по выбранной категории
  - Отображение слайдера с книгами
--------------------------- */
const TopSellers = () => {
  // Хранение списка всех книг
  const [books, setBooks] = useState<Book[]>([]);
  
  // Выбранная категория фильтрации
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

  /* --------------------------
    useEffect для загрузки данных
    Загружаем данные из файла books.json один раз при монтировании
  --------------------------- */
  useEffect(() => {
    fetch("books.json")
      .then(res => res.json())
      .then((data: Book[]) => setBooks(data));
  }, []);

  /* --------------------------
    Фильтрация книг по выбранной категории
    Если выбрано "Choose a genre", показываем все книги
    Иначе фильтруем по жанру (category)
  --------------------------- */
  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          book => book.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="py-10">
      {/* Заголовок раздела */}
      <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>

      {/* --------------------------
        Фильтр по категориям
        select меняет выбранную категорию
      --------------------------- */}
      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {categories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* --------------------------
        Swiper слайдер
        slidesPerView, spaceBetween и breakpoints управляют отображением
        navigation с кастомными кнопками
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
          - Перебираем отфильтрованные книги
          - Для каждой книги рендерим компонент BookCard
        --------------------------- */}
        {filteredBooks.map((book) => (
          <SwiperSlide key={book._id}>
            <BookCard book={book} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopSellers;
