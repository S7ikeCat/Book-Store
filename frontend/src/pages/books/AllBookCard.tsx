import { FiShoppingCart } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import type { Book } from '../home/TopSellers';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { toggleFavorite } from "../../redux/features/favorites/favorites";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/Store";


/* --------------------------
  Типы пропсов для BookCard
--------------------------- */
type BookCardProps = {
  book: Book;
};

const AllBookCard = ({ book }: BookCardProps) => {
    const dispatch = useDispatch()
  
    const favorites = useSelector((state: RootState) => state.favorites.items)
    const isFavorite = favorites.some(item => item._id === book._id)
  
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-3 flex flex-col h-full">
  
        {/* -------- Cover Image -------- */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-md overflow-hidden">
          <Link to={`/db/books/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="w-full p-2 rounded-md"
              onError={(e) => {
                // fallback на файлы из uploads/books
                e.currentTarget.src = `http://localhost:3000/uploads/books/${book.coverImage}`;
              }}
            />
          </Link>
  
          {/* Favorite button */}
          <button
            onClick={() => dispatch(toggleFavorite(book))}
            className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full shadow"
          >
            {isFavorite ? (
              <HiHeart className="text-purple-700 w-5 h-5" />
            ) : (
              <HiOutlineHeart className="text-gray-800 w-5 h-5" />
            )}
          </button>
        </div>
  
        {/* -------- Content -------- */}
        <div className="mt-3 flex flex-col flex-1">
  
          {/* Title */}
          <Link to={`/db/books/${book._id}`}>
            <h3 className="text-sm sm:text-base font-semibold line-clamp-2 hover:text-blue-600">
              {book.title}
            </h3>
          </Link>
  
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-3">
          {book.description.length > 50
              ? `${book.description.slice(0, 50)}...`
              : book.description}
          </p>
  
          {/* Price */}
          <div className="mt-2 font-medium text-sm sm:text-base">
            ${book.newPrice}
            {book.oldPrice && (
              <span className="line-through ml-2 text-gray-400 text-xs sm:text-sm">
                ${book.oldPrice}
              </span>
            )}
          </div>
  
          {/* Add to Cart button */}
          <button
            onClick={() => dispatch(addToCart(book))}
            className="mt-auto bg-[rgb(255,206,26)] text-black text-base font-secondary font-bold hover:bg-secondary hover:text-white sm:text-sm py-2 px-3 sm:py-2 sm:px-4 rounded flex items-center gap-2 w-fit transition"
          >
            <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            Add to Cart
          </button>
  
        </div>
      </div>
    )
  }
  
  export default AllBookCard