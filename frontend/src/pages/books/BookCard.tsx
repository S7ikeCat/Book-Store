import { FiShoppingCart } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import type { Book } from '../home/TopSellers';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

/* --------------------------
  Типы пропсов для BookCard
--------------------------- */
type BookCardProps = {
  book: Book;
};

const BookCard = ({ book }: BookCardProps) => {
  const dispatch = useDispatch();

  const handleAddToCart = (book: Book) => {
    dispatch(addToCart(book));
  };

  return (
    <div className="rounded-lg transition-shadow duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">

        {/* -------- Cover (clickable) -------- */}
        <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
          <Link to={`/books/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="w-full bg-cover p-2 rounded-md hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        {/* -------- Content -------- */}
        <div className="flex flex-col justify-between">

          {/* Title (clickable) */}
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-600 mb-5">
            {book.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book.description}
          </p>

          {/* Prices */}
          <p className="font-medium mb-5">
            ${book.newPrice}
            <span className="line-through font-normal ml-2 text-gray-400">
              ${book.oldPrice}
            </span>
          </p>

          {/* Add to cart (NOT clickable for navigation) */}
          <button
            onClick={() => handleAddToCart(book)}
            className="btn-primary px-6 flex items-center gap-1 w-fit"
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
