import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineUser, HiOutlineHeart, HiHeart } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { GoHome } from "react-icons/go";

import avatarIMG from "../assets/avatar.png";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/Store";

/* --------------------------
  Навигация пользователя
--------------------------- */
const navigation = [
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state: RootState) => state.cart.cartItems
  );

  // 🔑 Авторизация
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ADMIN | USER
  const isAuth = !!token;

  // 🚪 Logout с возвратом на главную
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setDropdownOpen(false);

    // Перезагрузка страницы и переход на главную
    window.location.href = "/";
  };

  const favorites = useSelector(
    (state: RootState) => state.favorites.items
  );

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* ---------------- LEFT ---------------- */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <span className="inline-flex w-8 h-8 items-center justify-center">
              <GoHome className="w-7 h-7 transition-transform duration-200 hover:scale-110" />
            </span>
          </Link>

          <div className="relative sm:w-72 w-40">
            <IoIosSearch className="absolute inline-block left-3 inset-y-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search here"
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* ---------------- RIGHT ---------------- */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          {/* USER ICON / AVATAR */}
          <div className="relative">
            {isAuth ? (
              <>
                <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarIMG}
                    alt="Avatar"
                    className="size-7 rounded-full ring-2 ring-blue-500"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {/* ADMIN ONLY */}
                      {role === "ADMIN" && (
                        <li>
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </li>
                      )}

                      {/* COMMON LINKS */}
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => setDropdownOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}

                      {/* LOGOUT */}
                      <li>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <HiOutlineUser className="size-6 text-gray-700" />
              </Link>
            )}
          </div>

          {/* FAVORITES */}
          <button className="hidden sm:block">
            <Link to="/favorites">
              {favorites.length > 0 ? (
                <HiHeart className="size-6 text-purple-800" />
              ) : (
                <HiOutlineHeart className="size-6" />
              )}
            </Link>
          </button>

          {/* CART */}
          <Link
            to="/cart"
            className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm hover:bg-blue-700 transition-colors"
          >
            <FiShoppingCart />
            <span className="text-sm font-semibold sm:ml-1">{cartItems.length}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;