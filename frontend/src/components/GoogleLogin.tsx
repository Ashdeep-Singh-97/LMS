// GoogleLoginButton.tsx
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface GoogleLoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
  };
}

const GoogleLoginButton: React.FC = () => {
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const { setUser } = useUser();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post<GoogleLoginResponse>(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          token: credentialResponse.credential,
          role,
        }
      );

      const user = response.data.user;
      setUser(user);
      localStorage.setItem('name', user.name);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', user.role);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
      />
    </div>
  );
};

export default GoogleLoginButton;
