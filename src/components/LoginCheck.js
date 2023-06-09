import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('jwt-token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  return null;
};

export default LoginCheck;
