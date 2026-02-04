import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";
import type { Book } from "../home/TopSellers";
import booksData from "../../../public/books.json"; 
import { useEffect } from "react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { toggleFavorite } from "../../redux/features/favorites/favorites";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/Store";



const SingleBook = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state: RootState) => state.favorites.items
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  const book = booksData.find((b: Book) => String(b._id) === id);

  if (!book) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Book not found
      </div>
    );
  }

  
  
  const isFavorite = favorites.some(item => item._id === book._id);
  

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white shadow-md">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* --------- Image --------- */}
        <div className="lg:w-1/3 flex justify-center">
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            className="w-full max-w-xs lg:max-w-full rounded-lg shadow-lg object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* --------- Content --------- */}
        <div className="lg:w-2/3 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
              {book.title}
            </h1>

            <p className="text-gray-600 mb-6">
              <span className="font-semibold">Category:</span> {book.category}
            </p>

            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6">
  {/* PRICE */}
  <div className="flex items-baseline gap-3 mb-4 sm:mb-0">
    <span className="text-2xl sm:text-3xl font-bold text-red-500">
      ${book.newPrice}
    </span>
    <span className="text-gray-400 line-through text-lg">
      ${book.oldPrice}
    </span>

    {/* ❤️ FAVORITE */}
    <button
      onClick={() => dispatch(toggleFavorite(book))}
      className="ml-3 transition-transform hover:scale-110"
      title="Add to favorites"
    >
      {isFavorite ? (
      <HiHeart className="text-purple-800 w-6 h-6" />
    ) : (
      <HiOutlineHeart className="text-gray-800 w-6 h-6" />
    )}
    </button>
  </div>

  {/* ADD TO CART */}
  <button
    onClick={() => dispatch(addToCart(book))}
    className="btn-primary flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 w-full sm:w-auto justify-center"
  >
    <FiShoppingCart className="text-xl" />
    Add to Cart
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default SingleBook;
