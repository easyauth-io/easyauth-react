import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';
import PropTypes from 'prop-types';
import React from 'react';

export const SignOutButton = ({callback, children}) => {
  const auth = useEasyauth();
  if (!children) {
    return (
      <a
        href={
          process.env.REACT_APP_EASYAUTH_APP_URL +
          '/logout?target=' +
          btoa(callback || window.location.href)
        }
      >
        <button
          onClick={() => {
            auth.removeUser();
          }}
        >
          Sign Out
        </button>
      </a>
    );
  }
  return (
    <a
      href={
        process.env.REACT_APP_EASYAUTH_APP_URL +
        '/logout?target=' +
        btoa(callback || window.location.href)
      }
    >
      <div
        onClick={() => {
          auth.removeUser();
        }}
      >
        {children}
      </div>
    </a>
  );
};


SignOutButton.propTypes = {
  callback: PropTypes.string,
  children: PropTypes.node,
};
