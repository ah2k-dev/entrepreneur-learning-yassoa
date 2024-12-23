import React from 'react'
import { getUserData, useAuth } from '../services/hooks';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const isAuthenticated = useAuth();
  const user = getUserData();

  if (!isAuthenticated) {
      return <Navigate to="/login" />;
  } else {
      return <Navigate to="/dashboard" />;

  }
}
export default Home