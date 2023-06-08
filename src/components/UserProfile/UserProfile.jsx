import React, {useEffect, useState} from 'react';
import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';
import PropTypes from 'prop-types';
import {getProfile} from '../../api/api.js';

export const UserProfile = ({loader}) => {
  const auth = useEasyauth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await getProfile();
      setProfile(response.data);
    })();
  }, [auth]);

  if (auth.user?.access_token) {
    if (!profile) {
      return loader||'Lodaing...';
    } else {
      return (
        <ul>
          <li>Email: {profile.email}</li>
          <li>Email verified: {JSON.stringify(profile.emailVerified)}</li>
          <li>Phone: {profile.phone}</li>
          <li>Phone verified: {JSON.stringify(profile.phoneVerified)}</li>
        </ul>
      );
    }
  } else {
    return null;
  }
};

UserProfile.propTypes = {
  loader: PropTypes.element,
};
