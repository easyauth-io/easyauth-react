import {useEffect, useState} from 'react';
import {useEasyauth} from '../useEasyauth/useEasyauth.jsx';
import {getProfile} from '../../api/api.js';

export const useUser = () => {
  const auth = useEasyauth();
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getProfile();
      setUser(response.data);
    };

    fetchUser();
  }, []);

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: Object.keys(user).length ?
      false :
      auth.isAuthenticated ?
      true :
      false,
    user: user,
  };
};
