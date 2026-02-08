import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/Store";
import { getImgUrl } from "../../utils/getImgUrl";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { removeFavorite } from "../../redux/features/favorites/favorites";
import { FiShoppingCart } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import { useState } from "react";

const Wishes = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [search, setSearch] = useState("");

  // Фильтруем только по названию книги
  const filtered = favorites.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search book..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No favorite books yet</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(book => (
            <div
              key={book._id}
              className="border rounded-lg p-4 relative hover:shadow-lg"
            >
              {/* Remove from favorites */}
              <button
                onClick={() => dispatch(removeFavorite(book._id))}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <HiX />
              </button>

              {/* Book cover */}
              <img
                src={getImgUrl(book.coverImage)}
                alt={book.title}
                className="h-48 mx-auto mb-4 object-contain"
                onError={(e) => {
                  e.currentTarget.src = `http://localhost:3000/uploads/books/${book.coverImage}`;
                }}
              />

              {/* Title */}
              <h3 className="font-semibold mb-2">{book.title}</h3>

              {/* Category */}
              <p className="text-sm text-gray-500 mb-4">{book.category}</p>

              {/* Add to Cart */}
              <button
                onClick={() => dispatch(addToCart(book))}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FiShoppingCart />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishes;
