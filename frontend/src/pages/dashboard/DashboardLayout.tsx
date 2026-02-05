import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaShoppingCart, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const links = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/dashboard/orders" },
    { name: "Books", icon: <FaBoxOpen />, path: "/dashboard/books" },
    { name: "Users", icon: <FaUsers />, path: "/dashboard/users" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed md:relative z-20 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="mt-6 flex flex-col">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors rounded ${isActive ? "bg-gray-200 font-semibold" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon} {link.name}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 mt-6 text-red-600 hover:bg-red-100 transition-colors rounded"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 shadow">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button onClick={() => setSidebarOpen(true)}>
            <FaBars className="text-2xl" />
          </button>
        </div>

        <div className="p-6 overflow-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;