import React from 'react';
import PropTypes from 'prop-types';
import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';

export const SignedIn = ({children}) => {
  const auth = useEasyauth();
  if (auth.isAuthenticated) {
    return <>{children}</>;
  }
  return null;
};

SignedIn.propTypes = {
  children: PropTypes.node,
};
