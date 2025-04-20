import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './Home';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}