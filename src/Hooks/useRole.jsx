import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

// const useRole = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const { isLoading: roleLoading, data } = useQuery({
//     queryKey: ['user-role', user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/user/${user.email}/role`);
//       return res.data;
//     }
//   });

//   return {
//     role: data?.role || 'user',
//     roleLoading
//   }
// };

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading, data } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user.email}/role`);
      return res.data;
    }
  });

  return {
    role: data?.role,
    status: data?.status,
    isLoading
  };
};

export default useRole;
