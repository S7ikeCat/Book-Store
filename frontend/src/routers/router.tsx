import {createBrowserRouter} from "react-router-dom"
import App from "../App"
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckOutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import Dashboard from "../pages/dashboard/Dashboard";
import RequireAdmin from "../components/RequireAdmin";
import Wishes from "../pages/books/Wishes";
import OrderPage from "../pages/books/OrderPage";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import OrdersDashboard from "../pages/dashboard/OrdersDashboard";
import SingleBookDB from "../pages/books/SingleBookDB";
import AllTableJsonBooks from "../pages/home/AllTableJsonBooks";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/orders",
                element: <OrderPage/>
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/signup",
                element: <Register/>
            },
            {
                path: "/cart",
                element: <CartPage/>
            },
            {
                path: "/checkout",
                element: <CheckOutPage/>
            },
            {
                path: "/books",
                element: <AllTableJsonBooks />
            },
            {
                path: "/books/:id",
                element: <SingleBook />
            },
            {
                path: "/db/books/:id",
                element: <SingleBookDB />
            },
            {
                path: "/dashboard",
                element: (
                  <RequireAdmin>
                    <DashboardLayout />
                  </RequireAdmin>
                ),
                children: [
                  { path: "", element: <Dashboard /> },
                  { path: "orders", element: <OrdersDashboard /> },
                  { path: "users", element: <UserDashboard /> },
                ]
              },
              {
                path: "/favorites",
                element: <Wishes />
            },
              
        ]
    },
])

export default router;