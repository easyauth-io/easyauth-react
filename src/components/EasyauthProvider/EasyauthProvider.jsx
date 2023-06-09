import React from 'react';
import PropTypes from 'prop-types';
import {AuthProvider} from 'react-oidc-context';
import {WebStorageStateStore} from 'oidc-client-ts';
import {MantineProvider} from '@mantine/core';

export const EasyauthProvider = ({
  authority,
  clientId,
  redirectUri,
  children,
}) => {
  const onSigninCallback = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };
  const oidcConfig = {
    authority:
      (authority || process.env.REACT_APP_EASYAUTH_APP_URL) + '/tenantbackend',
    client_id: clientId || process.env.REACT_APP_EASYAUTH_CLIENT_ID,
    redirect_uri: redirectUri || process.env.REACT_APP_EASYAUTH_REDIRECT_URL,
    onSigninCallback: onSigninCallback,
    userStore: new WebStorageStateStore({store: window.localStorage}),
  };
  return (
    <div>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AuthProvider {...oidcConfig}>{children}</AuthProvider>
      </MantineProvider>
    </div>
  );
};

EasyauthProvider.propTypes = {
  authority: PropTypes.string,
  clientId: PropTypes.string,
  redirectUri: PropTypes.string,
  children: PropTypes.node,
};
