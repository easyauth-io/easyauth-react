const BASE_URL = process.env.REACT_APP_EASYAUTH_APP_URL + '/tenantbackend';

const commonAPICall = async (
    PATH,
    METHOD = 'GET',
    BODY = null,
    headers = {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
) => {
  const FULLPATH = BASE_URL + PATH;
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

const getProfile = async (token) => {
  const headers = {Authorization: `Bearer ${token}`};
  const response = await getAPI('/api/profile', headers);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
};

export {commonAPICall, getAPI, postAPI, getProfile};
