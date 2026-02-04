import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import ErrorPage from "../Page/ErrorPage";
import Home from "../Page/Home";
import Register from "../Page/AuthenticationPage/Register";
import Login from "../Page/AuthenticationPage/Login";
import DashboardLayout from "../Page/DashboardPage/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "../Page/DashboardPage/ManageUsers";

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
            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        children: [
            {
                path: 'manage-users',
                Component: ManageUsers
            }
        ]
    }
])