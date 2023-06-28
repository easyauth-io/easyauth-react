import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';
import PropTypes from 'prop-types';
import React from 'react';

export const SignOutButton = ({callback, children}) => {
  const auth = useEasyauth();
  const logoutLink =
    auth.settings.authority.substring(0, auth.settings.authority.lastIndexOf('/')) +
    '/logout?target=' +
    btoa(callback || window.location.href);

  return (
    <div
      onClick={() => {
        auth.removeUser().then(() => (window.location.href = logoutLink));
      }}
    >
      {children ? children : <button style={{cursor: 'pointer'}}>Sign Out</button>}
    </div>
  );
};


SignOutButton.propTypes = {
  callback: PropTypes.string,
  children: PropTypes.node,
};
