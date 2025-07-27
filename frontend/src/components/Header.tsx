// Header.tsx
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from '../components/GoogleLogin';
import AuthForm from '../components/AuthForm';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HeaderContent: React.FC = () => {
  const { user, setUser } = useUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDashboard = () => {
    if (user?.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };
  
  if (!user) {
    return (
      <div className="p-4 border-b bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={() => setMode('login')} className="text-blue-600 font-medium">
            Login
          </button>
          <button onClick={() => setMode('register')} className="text-blue-600 font-medium">
            Register
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <AuthForm mode={mode} />
          <GoogleLoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b bg-white shadow-sm flex justify-between items-center">
      <h1 className="text-lg font-bold text-gray-800">Welcome, {user.name}</h1>
      <button
          onClick={() => navigate('/')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
        >
          Home
        </button>

        <button
          onClick={handleDashboard}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Dashboard
        </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
      >
        Logout
      </button>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <HeaderContent />
    </GoogleOAuthProvider>
  );
};

export default Header;
