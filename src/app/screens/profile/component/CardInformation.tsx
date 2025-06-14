import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

const CardInformation = () => {
  const [publishableKey, setPublishableKey] = useState('');

  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <Text>xyz</Text>
    </StripeProvider>
  );
};

export default CardInformation;
