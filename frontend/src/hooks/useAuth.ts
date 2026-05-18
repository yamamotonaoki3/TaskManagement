import { useNavigate } from 'react-router-dom';

import { getToken, removeToken } from '../api/authApi';

export function useAuth() {
  const navigate = useNavigate();

  function logout() {
    removeToken();
    navigate('/login');
  }

  function isAuthenticated(): boolean {
    return getToken() !== null;
  }

  return { logout, isAuthenticated };
}
