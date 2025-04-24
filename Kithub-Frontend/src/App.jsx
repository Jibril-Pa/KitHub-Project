import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './Home';
import Register from './Register';
import Settings from './Settings';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}