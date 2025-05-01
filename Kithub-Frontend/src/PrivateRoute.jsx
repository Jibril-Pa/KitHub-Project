import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ isLoggedIn, children }) {
  if (isLoggedIn === null) return null; // or a loading spinner
  return isLoggedIn ? children : <Navigate to="/" replace />;
}