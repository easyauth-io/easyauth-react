import React, {useState, useRef, useEffect} from 'react';
import {useUser} from '../../hooks/useUser/useUser.jsx';
import {useEasyauth} from '../../hooks/useEasyauth/useEasyauth.jsx';
import PropTypes from 'prop-types';
import {iconUser} from '../uiComponents/iconUser.js';
import {UserProfile} from '../UserProfile/UserProfile.jsx';
import {Modal} from '@mantine/core';


export const UserButton = ({position, profileRedirect}) => {
  const auth = useEasyauth();
  const {user} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef(null);
  const [open, setOpen] = useState(false);


  const ProfileModal = () => {
    const handleClose = () => {
      setOpen(false);
    };
    return (
      <Modal centered opened={open} onClose={handleClose}>
        <UserProfile />
      </Modal>
    );
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    auth.removeUser();
  };

  const handleAccount = () => {
    setIsOpen(false);
    if (!profileRedirect) {
      setOpen(true);
    }
  };

  const cardStyle = {
    position: 'absolute',
    top: '50px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  if (position === 'left') {
    cardStyle.left = '0';
  } else if (position === 'right') {
    cardStyle.right = '0';
  } else {
    cardStyle.right = '0';
  }

  return (
    <>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <button
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            padding: '0',
            border: 'none',
            backgroundColor: '#ccc',
          }}
          onClick={handleButtonClick}
        >
          <img
            src={iconUser()}
            alt="profile icon"
            style={{width: '100%', height: '100%'}}
          />
        </button>

        <ProfileModal/>
        {isOpen && (
          <div ref={cardRef} style={cardStyle}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <img
                src={iconUser()}
                alt="Profile Icon"
                style={{width: '30px', height: '30px', marginRight: '10px'}}
              />
              <div
                style={{
                  color: 'black',
                  fontSize: '16px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.email}
              </div>
            </div>
            <button
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '5px 10px',
                marginBottom: '10px',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
            <a
              href={profileRedirect}
              style={{
                backgroundColor: '#17a2b8',
              }}
            >
              <button
                style={{
                  backgroundColor: '#17a2b8',
                  color: '#fff',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
                onClick={handleAccount}
              >
                Account
              </button>
            </a>
          </div>
        )}
      </div>
    </>
  );
};


UserButton.propTypes = {
  position: PropTypes.string,
  profileRedirect: PropTypes.string,
};
