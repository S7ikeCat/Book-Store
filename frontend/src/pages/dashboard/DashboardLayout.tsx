import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ реально выходим
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // redux тоже чистим (пусть будет)
    dispatch(logout());

    setSidebarOpen(false);
    navigate("/login", { replace: true });
  };

  const links = useMemo(
    () => [
      // ✅ end нужен, чтобы /dashboard НЕ подсвечивался на /dashboard/users и т.д.
      { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard", end: true },
      { name: "Orders", icon: <FaShoppingCart />, path: "/dashboard/orders", end: false },
      // ❌ Books убрали
      { name: "Users", icon: <FaUsers />, path: "/dashboard/users", end: false },
    ],
    []
  );

  // ESC закрывает sidebar на мобилке
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar (без Logout) */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-screen-2xl px-4 py-3 flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border bg-white hover:bg-gray-50"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FaBars className="text-xl" />
          </button>

          <div className="leading-tight">
            <div className="font-bold text-lg">Admin Panel</div>
            <div className="text-xs text-gray-500 hidden sm:block">
              Manage products, users and orders
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-screen-2xl flex">
        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <button
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu overlay"
          />
        )}

        {/* Sidebar */}
        <aside
          className={[
            "fixed md:sticky top-[57px] z-50 md:z-10",
            "h-[calc(100vh-57px)]",
            "w-[280px] shrink-0",
            "bg-white border-r",
            "transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          ].join(" ")}
        >
          <div className="p-4">
            <div className="rounded-2xl bg-gray-50 border p-4">
              <div className="text-xs text-gray-500">Navigation</div>
              <div className="font-semibold">Admin tools</div>
            </div>

            <nav className="mt-4 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.end} // ✅ ключевое исправление active
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-4 py-3 rounded-2xl border",
                      "transition-colors",
                      isActive
                        ? "bg-blue-50 border-blue-100 text-blue-700"
                        : "bg-white border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200",
                    ].join(" ")
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Logout только здесь */}
            <div className="mt-6 border-t pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border bg-white hover:bg-red-50 text-red-600"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 w-full min-w-0">
          <div className="p-4 sm:p-6">
            <div className="w-full min-w-0 overflow-x-hidden">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;