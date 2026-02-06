// import axios from 'axios';
// import React, { useEffect } from 'react';
// import useAuth from './useAuth';
// import { useNavigate } from 'react-router';

// const axiosSecure = axios.create({
//     baseURL: 'http://localhost:5000'
// })

// const useAxiosSecure = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const reqInterceptor = axiosSecure.interceptors.request.use(config => {
//             if(user?.accessToken) {
//                 config.headers.Authorization = `Bearer ${user.accessToken}`;
//             }
//             return config;
//         });

//         const resInterceptor = axiosSecure.interceptors.response.use(
//             response => response,
//             error => {
//                 const statusCode = error.response?.status;
//                 if(statusCode === 401 || statusCode === 403){
//                     logout()
//                     .then(() => {
//                         navigate('/login');
//                     });
//                 }
//                 return Promise.reject(error);
//             }
//         );

//         return () => {
//             axiosSecure.interceptors.request.eject(reqInterceptor);
//             axiosSecure.interceptors.response.eject(resInterceptor);
//         };
//     }, [user, logout, navigate]);

//     return axiosSecure;
// };

// export default useAxiosSecure;


import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const idToken = await user.getIdToken(); // 🔑 Firebase ID Token
          config.headers.Authorization = `Bearer ${idToken}`;
        }

        return config;
      }
    );

    // 🔹 Response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          logout().then(() => navigate("/login"));
        }
        return Promise.reject(error);
      }
    );

    // 🔹 Cleanup
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;

