import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    
    if (role && userInfo?.role !== role) {
      navigate('/');
    }
  }, [userInfo, navigate, role]);

  return userInfo ? children : null;
};

export default ProtectedRoute;