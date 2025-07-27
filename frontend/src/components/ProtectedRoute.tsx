import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children, role }: { children: JSX.Element , role : string }) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.post<{ verified: boolean }>(
          `${import.meta.env.VITE_API_URL}/api/auth/verify`,
          {role},
          { withCredentials: true }
        );

        setIsVerified(res.data.verified);
      } catch (err) {
        console.error('Verification failed:', err);
        setIsVerified(false);
      }
    };

    verifyUser();
  }, []);

  if (isVerified === null) return <p>Loading...</p>;
  if (!isVerified) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
