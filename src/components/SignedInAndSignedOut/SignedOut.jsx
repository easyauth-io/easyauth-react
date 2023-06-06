import React from 'react';
import PropTypes from 'prop-types';
import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';

export const SignedOut = ({children}) => {
  const auth = useEasyauth();
  if (!auth.isAuthenticated) {
    return <>{children}</>;
  }
  return null;
};

SignedOut.propTypes = {
  children: PropTypes.node,
};
