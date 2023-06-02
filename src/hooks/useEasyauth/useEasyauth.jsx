import {useAuth} from 'react-oidc-context';

export const useEasyauth = () => {
  const auth = useAuth();
  return auth;
};
