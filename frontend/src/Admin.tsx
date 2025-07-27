import React from 'react';
import { useUser } from './context/UserContext';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const {user, setUser} = useUser();
  const navigate = useNavigate();
  if (!user) {
    return <p>Welcome Admin</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👑 Admin Dashboard</h1>
      <button onClick={() => { setUser(null); navigate("/") }}>Logout</button>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default AdminPage;
