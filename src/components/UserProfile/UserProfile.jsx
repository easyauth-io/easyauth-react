import React, {useState, useCallback, useEffect} from 'react';
import {
  getProfileImage,
  profileImageDelete,
  profileImageUpload,
} from '../../api/api.js';
import Cropper from 'react-easy-crop';
import {compressAccurately} from 'image-conversion';
import {
  Badge,
  Button,
  Center,
  FileInput,
  Flex,
  Loader,
  Modal,
  Paper,
  Slider,
  TextInput,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Toaster, toast} from 'react-hot-toast';
import {iconUser} from '../uiComponents/iconUser.js';
import {useUser} from '../../hooks/useUser/useUser.jsx';

export const UserProfile = () => {
  const {user} = useUser();
  const [opened, {open, close}] = useDisclosure(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // For delete conformation modal
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [compressing, setCompressing] = useState(false); // New state for compression loading
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const fetchProfileImage = async () => {
      const response = await getProfileImage();
      if (response.ok) {
        setProfileImage(URL.createObjectURL(response.data));
      } else {
        setProfileImage(iconUser());
      }
    };

    fetchProfileImage();
  }, [refreshKey]);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageCompress = async (image) => {
    const compressedImage = await compressAccurately(image, {
      size: 900, // Maximum file size in KB
      width: 500,
      height: 500,
    });
    setCompressing(false); // Compression complete, set loading state
    return compressedImage;
  };

  const handleCropComplete = useCallback(
      async (croppedArea, croppedAreaPixels) => {
        try {
          setCompressing(true); // Start compressing, set loading state
          const croppedImage = await getCroppedImg(previewUrl, croppedAreaPixels);
          const compressedImage = await handleImageCompress(croppedImage);
          setCroppedImage(compressedImage);
        } catch (error) {
          toast.error(error);
        }
      },
      [previewUrl],
  );

  const handleUpload = async () => {
    if (croppedImage) {
      try {
        const response = await profileImageUpload(croppedImage);
        if (response.ok) {
          toast.success('Profile Picture Set');
          setCroppedImage(null); // Clear the cropped image
          close(); // Close the modal
          setRefreshKey(Date.now());
        }
      } catch (error) {
        toast.error(error);
      }
    } else {
      toast.error('Please select an image');
    }
  };

  const handelDelete = async () => {
    const response = await profileImageDelete();
    if (response.ok) {
      toast.success('Profile Picture Deleted');
      setCroppedImage(null); // Clear the cropped image
      setDeleteModalVisible(false); // Close the modal
      setRefreshKey(Date.now());
    }
  };
  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );
        canvas.toBlob(
            (blob) => {
              const file = new File([blob], 'cropped-image.jpg', {
                type: 'image/jpeg',
              });
              resolve(file);
            },
            'image/jpeg',
            1,
        );
      };
    });
  };

  return (
    <>
      <Toaster />
      {user.roles ? (
        <>
          <Center>
            <Paper radius="md" withBorder shadow="sm" m={'xl'} p="lg">
              <h3 style={{margin: 0}}>Profile </h3>

              <Flex direction="column" gap={20}>
                <div>
                  <Flex justify={'center'}>
                    {profileImage ? (
                      <img
                        style={{
                          borderRadius: '50%',
                          border: '2px solid #000',
                        }}
                        height={150}
                        width={150}
                        src={profileImage}
                        alt="Profile Picture"
                      />
                    ) : (
                      <div
                        style={{
                          borderRadius: '50%',
                          border: '2px solid #000',
                          height: 150,
                          width: 150,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Loader />
                      </div>
                    )}
                    {/* )<div style={{ height: 150 }}>{profileImage}</div> */}
                    <Flex direction={'column'} justify={'center'}>
                      <Button ml={30} mt={10} onClick={open}>
                        Change Photo
                      </Button>
                      <Button
                        ml={30}
                        color={'red'}
                        mt={10}
                        onClick={() => setDeleteModalVisible(true)}
                      >
                        Delete Photo
                      </Button>
                    </Flex>
                  </Flex>
                  <Modal
                    opened={deleteModalVisible}
                    onClose={() => setDeleteModalVisible(false)}
                    title="Delete Profile Picture"
                  >
                    <div>
                      <p>
                        Are you sure you want to delete your profile picture?
                      </p>
                      <Flex justify="end" gap={10}>
                        <Button onClick={handelDelete} color="red">
                          Yes
                        </Button>
                        <Button onClick={() => setDeleteModalVisible(false)}>
                          Cancel
                        </Button>
                      </Flex>
                    </div>
                  </Modal>
                </div>
                <div>
                  <TextInput
                    label="Name"
                    defaultValue={user?.fullname}
                    disabled
                  />
                  <TextInput
                    label="Eamil"
                    defaultValue={user?.email}
                    disabled
                  />
                  <div>
                    Email Verified:{' '}
                    {
                      <Badge color={user?.emailVerified ? 'green' : 'red'}>
                        {user?.emailVerified ? 'verified' : 'not verified'}
                      </Badge>
                    }
                  </div>
                  <TextInput
                    label="Phone"
                    defaultValue={user?.phone}
                    disabled
                  />
                  <div>
                    Phone Verified:{' '}
                    {
                      <Badge color={user?.phoneVerified ? 'green' : 'red'}>
                        {user?.phoneVerified ? 'verified' : 'not verified'}
                      </Badge>
                    }
                  </div>
                </div>
              </Flex>
              <style>{`
        .mantine-TextInput-input {
          opacity: 1 !important;  
          color: black !important;
        }
      `}</style>
            </Paper>
          </Center>
        </>
      ) : (
        <Loader />
      )}
      <Modal opened={opened} onClose={close} title="Upload Profile Picture">
        <div>
          <FileInput
            label="Your Profile Picture"
            onChange={handleFileChange}
            placeholder="Your Profile Picture"
          />
          {selectedFile && (
            <div>
              <h4>Selected Image Preview:</h4>
              <div
                className="crop-container"
                style={{
                  position: 'relative',
                  height: '300px',
                  width: '300px',
                  margin: '20px',
                }}
              >
                <Cropper
                  style={{position: 'relative'}}
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={handleCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div>
                <Slider
                  label={'Zoom'}
                  defaultValue={zoom}
                  labelAlwaysOn
                  step={0.1}
                  min={1}
                  max={5}
                  onChange={setZoom}
                />
              </div>
            </div>
          )}
          <Button mt={10} onClick={handleUpload} loading={compressing}>
            {compressing ? 'Cropping...' : 'Upload'}
          </Button>
        </div>
      </Modal>
    </>
  );
};


