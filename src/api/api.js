const BASE_URL = process.env.REACT_APP_EASYAUTH_APP_URL + '/tenantbackend';

let token;
const tokenLocalStorage = () => {
  let result;
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('oidc.user')) {
      result = key;
    }
  });
  const value = localStorage.getItem(result);
  token = JSON.parse(value)?.id_token;
};
if (!token) {
  tokenLocalStorage();
}

const commonAPICall = async (
    PATH,
    METHOD = 'GET',
    BODY = null,
    headers = {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
) => {
  tokenLocalStorage();
  const FULLPATH = BASE_URL + PATH;
  const response = await fetch(FULLPATH, {
    method: METHOD,
    body: BODY,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
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
const getCreatePortalSessionUrl = async () => {
  const response = await getAPI('/api/stripe/create-portal-session');
  return response;
};
const getCheckoutUrl = async (priceId) => {
  const response = await getAPI(`/api/stripe/checkout/${priceId}`);
  return response;
};
const getSubscriptions = async () => {
  const response = await getAPI('/api/stripe/subscriptions');
  return response;
};

export {
  commonAPICall,
  getAPI,
  postAPI,
  getProfile,
  getCreatePortalSessionUrl,
  getCheckoutUrl,
  getSubscriptions,
};
