import {
  getCheckoutUrl,
  getCreatePortalSessionUrl,
  getSubscriptions,
} from '../../api/api.js';

export const useStripe = () => {
  const createPortalSession = async () => {
    const response = await getCreatePortalSessionUrl();
    return response.data.url;
  };

  const checkout = async (priceId) => {
    const response = await getCheckoutUrl(priceId);
    return response.data.url;
  };
  const subscriptions = async () => {
    const response = await getSubscriptions();
    return response.data;
  };
  return {createPortalSession, checkout, subscriptions};
};
