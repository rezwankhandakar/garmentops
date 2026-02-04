import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';

const AdminRoute = ({children}) => {
    const {user, loading}= useAuth()
    const {role, roleLoading}= useRole()

    if (loading || roleLoading) {
       return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
    }

    if (role !== 'admin'){
        return <div>Forbidden</div>
    }
    return children
};

export default AdminRoute;