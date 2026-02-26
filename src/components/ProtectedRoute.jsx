import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center py-20 font-bold">Checking access...</div>;

  if (!user) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default ProtectedRoute;