import React, {useEffect, useState} from 'react';
import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';

export const UserProfile = () => {
  const auth = useEasyauth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = auth.user?.access_token;
        const response = await fetch(
            process.env.REACT_APP_EASYAUTH_APP_URL +
             '/tenantbackend/api/profile',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
        );
        setProfile(await response.json());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [auth]);

  if (!profile) {
    return <div>Loading...</div>;
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
