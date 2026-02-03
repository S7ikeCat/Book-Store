import {createBrowserRouter} from "react-router-dom"
import App from "../App"
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckOutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import Dashboard from "../components/Dashboard";
import RequireAdmin from "../components/RequireAdmin";


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
                element: <div>Orders</div>
            },
            {
                path: "/about",
                element: <div>About</div>
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
                path: "/books/:id",
                element: <SingleBook />
            },
            {
                path: "/dashboard",
                element: (
                  <RequireAdmin>
                    <Dashboard />
                  </RequireAdmin>
                )
              },
              
              
        ]
    },
])

export default router;