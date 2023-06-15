import React, {useEffect, useState} from 'react';
import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';
import PropTypes from 'prop-types';
import {getProfile} from '../../api/api.js';
import {
  Box,
  Chip,
  Divider,
  PopoverPaper,
  Typography,
} from '@mui/material';

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
        <PopoverPaper sx={{m: 2, p: 2, width: 300}}>
          <Box sx={{display: 'flex', alignItems: 'center', marginBottom: 2}}>
            <Typography variant="h6" sx={{flexGrow: 1}}>
          Profile
            </Typography>
            <Divider />
          </Box>
          <Typography variant="button">Email</Typography>
          <Divider />
          {profile.email}{' '}
          <Chip

            size="small"
            color={profile.emailVerified ? 'success' : 'error'}
            label={profile.emailVerified ? 'Verified' : 'Not Verified'}
          />
          <ul />
          <Typography variant="button">Phone </Typography>
          <Divider />
          {profile.phone}{' '}
          <Chip
            size="small"
            color={profile.phoneVerified ? 'success' : 'error'}
            label={profile.phoneVerified ? 'Verified' : 'Not Verified'}
          />

        </PopoverPaper>
      );
    }
  } else {
    return null;
  }
};

UserProfile.propTypes = {
  loader: PropTypes.element,
};
