import {
  Badge,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  PasswordInput,
  PinInput,
  Space,
  Stepper,
  Switch,
  Text,
} from '@mantine/core';
import React, {useState} from 'react';
import {
  disableTwoFactor,
  enableConfirmTwoFactor,
  enableTwoFactor,
} from '../../api/api.js';
import {useFocusTrap, useMediaQuery} from '@mantine/hooks';
import {toast} from 'react-hot-toast';
import PropTypes from 'prop-types';

const TwoFactorAuthentication = ({twoFaStatus, setProfileData}) => {
  const focusTrapRef = useFocusTrap();
  const mobileView = useMediaQuery('(min-width: 56.25em)');
  const [authQR, setAuthQR] = useState('');
  const [authPin, setAuthPin] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) =>
      current < (twoFaStatus ? 2 : 3) ? current + 1 : current,
    );
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleChange = () => {
    setActive(0);
    setModalVisible(true);
  };
  const handleAuthCodeSubmit = async (val) => {
    const response = await enableConfirmTwoFactor(val || authPin);
    if (response.ok) {
      setProfileData(response.data);
      setPassword('');
      setModalVisible(false);
      setActive(0);
    } else {
      toast.error(response.data.errors);
    }
  };
  const handelPasswordSubmit = async (e) => {
    e.preventDefault();
    if (twoFaStatus) {
      const response = await disableTwoFactor(password);
      if (response.ok) {
        setProfileData(response.data);
        setPassword('');
        setModalVisible(false);
        setActive(0);
      } else {
        toast.error(response.data.errors);
      }
    } else {
      const response = await enableTwoFactor(password);
      if (response.ok) {
        setAuthQR(response.data.url);
        nextStep();
      } else {
        toast.error(response.data.errors);
      }
    }
  };
  const ModalSteps = () => {
    if (twoFaStatus) {
      return (
        <>
          <Stepper active={active} onStepClick={setActive} breakpoint="sm">
            <Stepper.Step label="First step" description="disable 2FA">
              Do you want to <Badge color="red">disable</Badge> 2Factor
              Authentication?
              <Flex justify="end" gap={10}>
                <Button onClick={nextStep}>Yes</Button>
                <Button onClick={() => setModalVisible(false)} color="red">
                  No
                </Button>
              </Flex>
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Verify Password">
              Step 2: Confirm Password
            </Stepper.Step>
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
        </>
      );
    } else {
      return (
        <>
          <Stepper active={active} onStepClick={setActive} breakpoint="sm">
            <Stepper.Step label="First step" description="enable 2FA">
              Do you want to <Badge color="green">Enable </Badge> 2Factor
              Authentication?
              <Flex m={20} justify="end" gap={10}>
                <Button onClick={nextStep}>Yes</Button>
                <Button onClick={() => setModalVisible(false)} color="red">
                  No
                </Button>
              </Flex>
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Verify Password">
              Step 2: Confirm Password
            </Stepper.Step>
            <Stepper.Step label="Third step" description="Verify 2fa code">
              Step 3: Scan the below QR with your Authenticatior App. ex google
              Authenticator
              <Center m={20}>
                <div
                  style={{
                    border: '2px solid #000',
                    height: 210,
                    width: 210,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img src={authQR} alt="" />
                </div>
              </Center>
            </Stepper.Step>
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
        </>
      );
    }
  };

  return (
    <Flex align={'center'} mt={5}>
      2Factor Authentication : <Space w="md" />{' '}
      <Switch
        size="md"
        onLabel="ON"
        offLabel="OFF"
        checked={twoFaStatus}
        onChange={() => handleChange()}
      />
      <Modal
        title="2Factor Authentication"
        size={!mobileView ? '100%' : 'auto'}
        onClose={() => setModalVisible(false)}
        opened={modalVisible}
      >
        <ModalSteps />
        {active === 1 && (
          <>
            <form onSubmit={handelPasswordSubmit}>
              <PasswordInput
                ref={focusTrapRef}
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Flex justify="end" m={10} gap={10}>
                <Button type="submit">Submit</Button>
                <Button onClick={() => setModalVisible(false)} color="red">
                  Cancel
                </Button>
              </Flex>
            </form>
          </>
        )}
        {active === 2 && !twoFaStatus && (
          <>
            <Space h="md" />
            <Text m={10} align="center">
              Verify the code from the app
            </Text>
            <Group position="center">
              <PinInput
                length={6}
                type="number"
                onChange={(val) => {
                  setAuthPin(val);
                  if (val.length === 6) {
                    handleAuthCodeSubmit(val);
                  }
                }}
              />
            </Group>
            <Space h="md" />
            <Flex m={10} justify="end" gap={10}>
              <Button onClick={() => handleAuthCodeSubmit()}>Verify</Button>
              <Button variant="light" onClick={prevStep}>
                Back
              </Button>
            </Flex>
          </>
        )}
      </Modal>
    </Flex>
  );
};

export default TwoFactorAuthentication;

TwoFactorAuthentication.propTypes = {
  twoFaStatus: PropTypes.bool,
  setProfileData: PropTypes.object,
};
