const BASE_URL = process.env.REACT_APP_EASYAUTH_APP_URL + '/tenantbackend';


const tokenLocalStorage = () => {
  let result;
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('oidc.user')) {
      result = key;
    }
  });
  const value = localStorage.getItem(result);
  return JSON.parse(value)?.id_token;
};

const commonAPICall = async (
    PATH,
    METHOD = 'GET',
    BODY = null,
    headers = {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
) => {
  const token = tokenLocalStorage();
  const FULLPATH = BASE_URL + PATH;
  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await fetch(FULLPATH, {
    method: METHOD,
    body: BODY,
    headers: headers,
  });

  return response;
};

const getAPI = async (PATH, headers) => {
  const response = await commonAPICall(PATH, 'GET', null, headers);
  response.data = await response.json();
  return response;
};

const postAPI = async (PATH, DATA) => {
  const serializedData = JSON.stringify(DATA);
  const response = await commonAPICall(PATH, 'POST', serializedData);
  try {
    response.data = await response.json();
  } catch (err) {
    console.log(err);
  }
  return response;
};

const getProfile = async () => {
  const response = await getAPI('/api/profile');
  return response;
};
const getStripeCreatePortalSessionUrl = async () => {
  const response = await getAPI('/api/stripe/create-portal-session');
  return response;
};
const getStripeCheckoutUrl = async (priceId) => {
  const response = await getAPI(`/api/stripe/checkout/${priceId}`);
  return response;
};
const getStripeSubscriptions = async () => {
  const response = await getAPI('/api/stripe/subscriptions');
  return response;
};

const profileImageAPI = async (method, formData = null) => {
  const headers = {
    accept: '*/*',
  };
  const response = await commonAPICall(
      '/api/profile/profile-image',
      method,
      formData,
      headers,
  );
  try {
    response.data = await response.blob();
  } catch (error) {
    response.dataerror = error;
  }
  return response;
};

const profileImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('profileImageFile', file);
  const response = await profileImageAPI('POST', formData);
  return response;
};
const profileImageDelete = async () => {
  const response = await profileImageAPI('DELETE');
  return response;
};

const getProfileImage = async () => {
  const response = await profileImageAPI('GET');
  return response;
};

const enableTwoFactor = async (password) => {
  const data = {
    password: password,
  };
  const response = await postAPI('/api/twofactor/enable', data);
  return response;
};
const disableTwoFactor = async (password) => {
  const data = {
    password: password,
  };
  const response = await postAPI('/api/twofactor/disable', data);
  return response;
};

const enableConfirmTwoFactor = async (authPin) => {
  const response = await postAPI(
      `/api/twofactor/enable-confirm?code=${authPin}`,
  );
  return response;
};

export {
  commonAPICall,
  getAPI,
  postAPI,
  getProfile,
  getStripeCreatePortalSessionUrl,
  getStripeCheckoutUrl,
  getStripeSubscriptions,
  getProfileImage,
  profileImageDelete,
  profileImageUpload,
  disableTwoFactor,
  enableConfirmTwoFactor,
  enableTwoFactor,
};
