import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import Forbidden from '../Page/Forbidden';

const ManagerRoute = ({children}) => {
        const {loading}= useAuth()
    const {role, status, isLoading}= useRole()

    if (loading || isLoading) {
       return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
    }

    if (role !== 'manager' || status !== 'approved'){
        return <Forbidden></Forbidden>
    }
    return children
};

export default ManagerRoute;