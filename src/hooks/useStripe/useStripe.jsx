import {
  getStripeCheckoutUrl,
  getStripeCreatePortalSessionUrl,
  getStripeSubscriptions,
} from '../../api/api.js';

export const useStripe = () => {
  const createPortalSession = async () => {
    const response = await getStripeCreatePortalSessionUrl();
    return response.data.url;
  };

  const checkout = async (priceId) => {
    const response = await getStripeCheckoutUrl(priceId);
    return response.data.url;
  };
  const subscriptions = async () => {
    const response = await getStripeSubscriptions();
    return response.data;
  };
  return {createPortalSession, checkout, subscriptions};
};
