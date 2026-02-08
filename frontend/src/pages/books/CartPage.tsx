import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { clearCart, removeFromCart, addToCart, decrementQuantity } from "../../redux/features/cart/cartSlice";
import Swal from "sweetalert2";

/* --------------------------
  Тип для одного товара в корзине
--------------------------- */
export interface CartItem {
  _id: number;
  title: string;
  newPrice: number;
  category: string;
  coverImage: string;
  quantity: number;
}

/* --------------------------
  Тип состояния Redux
--------------------------- */
interface RootState {
  cart: {
    cartItems: CartItem[];
  };
}

/* --------------------------
  Компонент страницы корзины
--------------------------- */
const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  /* --------------------------
    Общая сумма корзины
  --------------------------- */
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.newPrice * item.quantity, 0)
    .toFixed(2);

  /* --------------------------
    Удаление товара из корзины
  --------------------------- */
  const handleRemoveFromCart = (item: CartItem) => {
    dispatch(removeFromCart(item._id));
    Swal.fire({
      icon: "info",
      title: "Removed",
      text: `${item.title} removed from cart`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  /* --------------------------
    Очистка корзины
  --------------------------- */
  const handleClearCart = () => {
    dispatch(clearCart());
    Swal.fire({
      icon: "info",
      title: "Cart cleared",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  /* --------------------------
    Увеличение количества книги
    Использует addToCart из cartSlice
    SweetAlert уведомление
  --------------------------- */
  const handleIncreaseQuantity = (item: CartItem) => {
    dispatch(
      addToCart({
        _id: item._id,
        title: item.title,
        newPrice: item.newPrice,
        oldPrice: item.newPrice,      // временно, чтобы соответствовать Book
        description: item.title,      // временно, чтобы соответствовать Book
        coverImage: item.coverImage,
        category: item.category,
      })
    );
    Swal.fire({
      icon: "success",
      title: "Added",
      text: `Added one more copy of ${item.title}`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  /* --------------------------
    Уменьшение количества книги
    Использует decrementQuantity из cartSlice
  --------------------------- */
  const handleDecreaseQuantity = (item: CartItem) => {
    dispatch(decrementQuantity(item._id));
  };

  return (
    <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {/* Заголовок и очистка корзины */}
        <div className="flex items-start justify-between">
          <div className="text-lg font-medium text-gray-900">Shopping cart</div>
          <div className="ml-3 flex h-7 items-center">
            <button
              type="button"
              onClick={handleClearCart}
              className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Список товаров */}
        <div className="mt-8">
          {cartItems.length > 0 ? (
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="flex py-6">
                  {/* Обложка книги */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      alt={item.title}
                      src={getImgUrl(item.coverImage)}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src = `http://localhost:3000/uploads/books/${item.coverImage}`;
                      }}
                    />
                  </div>

                  {/* Контент книги */}
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link to="/">{item.title}</Link>
                      </h3>
                      <p className="sm:ml-4">${item.newPrice}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 capitalize">
                      <strong>Category: </strong>
                      {item.category}
                    </p>

                    {/* --------------------------
                        Управление количеством (- / +)
                    --------------------------- */}
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    {/* Кнопка удалить */}
                    <div className="flex mt-2">
                      <button
                        onClick={() => handleRemoveFromCart(item)}
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No product found!</p>
          )}
        </div>
      </div>

      {/* Секция подвала корзины */}
      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${totalPrice}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Checkout
          </Link>
        </div>

        {/* Кнопка Continue Shopping */}
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <Link to="/">
            or
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;