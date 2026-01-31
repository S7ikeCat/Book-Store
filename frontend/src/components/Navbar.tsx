import { useState } from 'react';
import { HiBars3CenterLeft } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { HiOutlineUser, HiOutlineHeart } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";

import avatarIMG from "../assets/avatar.png";
import { useSelector } from 'react-redux';
import type { RootState } from "../redux/Store";

/* --------------------------
  Навигационные пункты дропдауна пользователя
--------------------------- */
const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

/* --------------------------
  Компонент Navbar
  Отвечает за:
  - Основную навигацию сайта
  - Поиск
  - Аватар пользователя с дропдаун меню
  - Кнопки "Любимые" и корзина
--------------------------- */
const Navbar = () => {
  // Состояние дропдауна пользователя
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const cartItems = useSelector(
    (state: RootState) => state.cart.cartItems
  );


  // Пример текущего пользователя (true = авторизован)
  const currentUser = false;

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* --------------------------
          Левая часть Navbar
          - Иконка меню
          - Поисковая строка
        --------------------------- */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiBars3CenterLeft className="size-6" />
          </Link>

          {/* Поисковый input */}
          <div className="relative sm:w-72 w-40 space-x-2">
            <IoIosSearch className="absolute inline-block left-3 inset-y-2" />
            <input
              type="text"
              placeholder="Search here"
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* --------------------------
          Правая часть Navbar
          - Аватар пользователя с дропдаун меню
          - Кнопка "Любимые"
          - Корзина
        --------------------------- */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          {/* Аватар пользователя */}
          <div>
            {currentUser ? (
              <>
                <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarIMG}
                    alt="Avatar"
                    className={`size-7 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ''}`}
                  />
                </button>

                {/* Дропдаун меню пользователя */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li key={item.name} onClick={() => setDropdownOpen(false)}>
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>

          {/* Кнопка "Любимые" */}
          <button className="hidden sm:block">
            <HiOutlineHeart className="size-6" />
          </button>

          {/* Корзина */}
          <Link
            to="/cart"
            className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm"
          >
            <FiShoppingCart />
            {
              cartItems.length > 0 ? <span className="text-sm font-semibold sm:ml-1">{cartItems.length}</span>
              : <span className="text-sm font-semibold sm:ml-1">0</span>
            }
            
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
