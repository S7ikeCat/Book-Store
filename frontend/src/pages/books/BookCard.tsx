import { FiShoppingCart } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import type { Book } from '../home/TopSellers';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

/* --------------------------
  Типы пропсов для BookCard
  book: объект книги из TopSellers
--------------------------- */
type BookCardProps = {
  book: Book;
};

/* --------------------------
  Компонент BookCard
  Отвечает за:
    - Отображение одной книги в слайдере или списке
    - Ссылку на страницу книги
    - Отображение обложки, названия, описания и цены
    - Кнопку "Add to Cart"
    - Адаптивный дизайн через Tailwind
--------------------------- */
const BookCard = ({ book }: BookCardProps) => {
  const dispatch = useDispatch();

  /* --------------------------
    Добавление книги в корзину
    Использует Redux addToCart
    book: объект типа Book
  --------------------------- */
  const handleAddToCart = (book: Book) => {
    dispatch(addToCart(book));
  };

  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">

        {/* --------------------------
          Обложка книги
          - Ссылка на страницу книги
          - Эффект hover: увеличение картинки
        --------------------------- */}
        <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
          <Link to={`/books/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="w-full bg-cover p-2 rounded-md hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        {/* --------------------------
          Контент книги
          - Название книги с hover эффектом
          - Краткое описание (обрезка до 80 символов)
          - Цена: новая + старая с зачёркиванием
          - Кнопка "Add to Cart"
        --------------------------- */}
        <div className="flex flex-col justify-between">
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book.title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-5">
            {book.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book.description}
          </p>

          <p className="font-medium mb-5">
            ${book.newPrice}
            <span className="line-through font-normal ml-2">
              ${book.oldPrice}
            </span>
          </p>

          <button 
            onClick={() => handleAddToCart(book)}
            className="btn-primary px-6 flex items-center gap-1"
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookCard;
