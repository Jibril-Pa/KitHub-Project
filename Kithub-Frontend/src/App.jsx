import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './Home';
<<<<<<< HEAD
import Register from './Register';
=======
>>>>>>> Diego-
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
<<<<<<< HEAD
      <Route path="/register" element={<Register />} />
=======
>>>>>>> Diego-
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}