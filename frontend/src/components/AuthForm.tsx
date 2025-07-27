// AuthForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface Props {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<Props> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'register' ? 'register' : 'login';
      const body = mode === 'register' ? { name, email, password, role } : { email, password, role };
      const res : any = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`, body, { withCredentials: true });

      const user = res.data.user;
      setUser(user);
      localStorage.setItem('name', user.name);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', user.role);
    } catch (err) {
      console.error('Auth failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-50 p-4 rounded shadow">
      <h2 className="text-md font-semibold mb-3 text-center text-gray-700">
        {mode === 'register' ? 'Sign Up' : 'Login'}
      </h2>

      {mode === 'register' && (
        <>
          <input
            type="text"
            placeholder="Name"
            className="input mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            className="input mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        className="input mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        {mode === 'register' ? 'Sign Up' : 'Login'}
      </button>
    </form>
  );
};

export default AuthForm;
