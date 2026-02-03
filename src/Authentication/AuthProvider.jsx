import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from './Firebase.config';
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {
     const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // 🔹 Track Auth State
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser); // Firebase থেকে user set করা হচ্ছে
    setLoading(false);    // এখন loading শেষ
  });


  return () => unsubscribe();
}, []);

   // 🔹 Context value
  const authInfo = {
    user,
    loading,
  };


    return (
            <AuthContext.Provider value={authInfo}>
                {children}
            </AuthContext.Provider>
    );
};


export default AuthProvider;