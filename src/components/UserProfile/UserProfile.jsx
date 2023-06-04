import React, {useEffect, useState} from 'react';
import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';
import {getProfile} from '../../api/api.js';

export const UserProfile = () => {
  const auth = useEasyauth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const token = auth.user?.access_token;
      const response = await getProfile(token);
      setProfile(response.data);
    })();
  }, [auth]);

  if (!profile) {
    return null;
  }

  return (
    <ul>
      <li>Email: {profile.email}</li>
      <li>Email verified: {JSON.stringify(profile.emailVerified)}</li>
      <li>Phone: {profile.phone}</li>
      <li>Phone verified: {JSON.stringify(profile.phoneVerified)}</li>
    </ul>
  );
};
