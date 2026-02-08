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
import Payment from "../Page/Payment";
import AdminAllProducts from "../Page/AdminPage/AdminAllProducts";
import AllOrders from "../Page/AdminPage/AllOrders";
import PandingOrders from "../Page/ManagerPage/PandingOrders";
import ManageProducts from "../Page/ManagerPage/ManageProducts";
import ApproveOrders from "../Page/ManagerPage/ApproveOrders";
import MyProfele from "../Page/ManagerPage/MyProfileBuyer";
import MyProfileBuyer from "../Page/BuyerPage/MyProfileBuyer";

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
                element: <PrivateRoute><ProductDetails></ProductDetails></PrivateRoute>
            },
            {
                path: 'booking/:id',
                Component: BookingPage
            },
            {
                path: "/payment/:id",
                element: <PrivateRoute><Payment></Payment></PrivateRoute>,
            }


        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        children: [
            // ....................AdminRoute..................//
            {
                path: 'manage-users',
                element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
            },
            {
                path: 'admin-allproducts',
                element: <AdminRoute><AdminAllProducts></AdminAllProducts></AdminRoute>,
            },
            {
                path: 'all-orders',
                element: <AdminRoute><AllOrders></AllOrders></AdminRoute>
            },
            // ...............ManagerRoute......................//
            {
                path: 'add-product',
                element: <ManagerRoute><AddProduct></AddProduct></ManagerRoute>
            },
            {
                path: 'manage-products',
                element: <ManagerRoute><ManageProducts></ManageProducts></ManagerRoute>
            },
            {
                path: 'pending-orders',
                element: <ManagerRoute><PandingOrders></PandingOrders></ManagerRoute>
            },
            {
                path: 'approve-orders',
                element: <ManagerRoute><ApproveOrders></ApproveOrders></ManagerRoute>
            },
            {
                path: 'my-profile',
                element: <ManagerRoute><MyProfele></MyProfele></ManagerRoute>
            },
            // ...................BuyerRoute.......................//
            {
                path: 'my-orders',
                element: <BuyerRoute><MyOrders></MyOrders></BuyerRoute>
            },

            {
                path: 'my-profile-buyer',
                element: <BuyerRoute><MyProfileBuyer></MyProfileBuyer></BuyerRoute>
            },
        
        ]
    }
])