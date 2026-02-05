import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import ErrorPage from "../Page/ErrorPage";
import Home from "../Page/Home";
import Register from "../Page/AuthenticationPage/Register";
import Login from "../Page/AuthenticationPage/Login";
import DashboardLayout from "../Page/DashboardPage/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "../Page/DashboardPage/ManageUsers";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import BuyerRoute from "./BuyerRoute";
import MyOrders from "../Page/BuyerPage/MyOrders";
import AddProduct from "../Page/ManagerPage/AddProduct";
import AllProducts from "../Page/AllProducts";
import ProductDetails from "../Page/ProductDetails";
import BookingPage from "../Page/BookingPage";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                path: '/',
                Component: Home
            },
            {
                path: 'register',
                Component: Register
            },
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'products',
                Component: AllProducts
            },
            {
                path: 'product/:id',
                Component: ProductDetails
            },
            {
                path: 'booking/:id',
                Component: BookingPage
            }

        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        children: [
            {
                path: 'manage-users',
                element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
            },
            {
                path: 'add-product',
                element: <ManagerRoute><AddProduct></AddProduct></ManagerRoute>
            },
            {
                path: 'my-orders',
                element: <BuyerRoute><MyOrders></MyOrders></BuyerRoute>
            }
        ]
    }
])