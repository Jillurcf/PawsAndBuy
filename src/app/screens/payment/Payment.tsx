import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { SvgXml } from 'react-native-svg';

import { IconBack, IconGoldRating, IconSliverRating } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import { CustomAlert } from '@/src/components/CustomAlert';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { useGetHomeProductDetailsQuery, useLazyGetValidationZipCodeQuery, usePostBuyProductBackendMutation, usePostBuyProductMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';



interface PaymentData {
  product_id: string | undefined;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  total_amount: string;

}

const Payment = () => {
  const { id, shipingMethodId, from, shippingMethodName } = useLocalSearchParams();
  const [payment, setPayment] = React.useState<PaymentData>({
    product_id: id || '',
    country: '',
    state: '',
    city: '',
    zip: '',
    address: '',
    total_amount: '',
  });
  // const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isCongratsModalVisible, setIsCongratsModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [generalFieldErrors, setGeneralFieldErrors] = useState<Record<string, string>>({});
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [postBuyProduct] = usePostBuyProductMutation();
  const [postBuyProductBackend] = usePostBuyProductBackendMutation();
  const [triggerValidateZip, { data: zipValidationResult, isFetching, }] =
    useLazyGetValidationZipCodeQuery();
  ;
  const [zip, setZip] = useState('');
  console.log(zipValidationResult, "zipValidationResult+++++");

  // console.log('35====', shippingMethodName);
  const { data, isLoading, isError } = useGetHomeProductDetailsQuery(id);
  // console.log('data+++', data?.data?.final_price);
  const total_price = data?.data?.final_price;
  const total_price_after_offer = data?.data?.final_price;
  // console.log('totalPrice', total_price);
  const product_id = id;
  // console.log('product id', product_id);

  const payment_method = 'pm_card_visa';
  const payload = { total_price, product_id, payment_method };
  // console.log('payload', payload);

  const [alertVisible, setAlertVisible] = useState(false);

  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  // const fetchPaymentSheetParams = async () => {
  //   try {
  //     const formData = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       formData.append(key, value); // Append both the key and its value
  //     });

  //     console.log('117', formData);

  //     const response = await postBuyProduct(formData); // API call
  //     console.log('Full API response:', response);

  //     // Validate response data
  //     const rawData = response?.data?.data;
  //     console.log('119', rawData);
  //     if (!rawData || typeof rawData !== 'object') {
  //       console.warn('Error: Response data is not a valid object:', rawData);
  //       throw new Error('Invalid response format');
  //     }

  //     if (!rawData.status) {
  //       console.warn('API Error:', rawData.message || 'Unknown error');
  //     }

  //     const {client_secret} = rawData;
  //     console.log('Parsed payment params:', {client_secret});

  //     if (!client_secret) {
  //       console.warn('Missing required payment sheet parameters');
  //     }

  //     return {paymentIntentClientSecret: client_secret};
  //   } catch (error) {
  //     console.warn('Error fetching payment sheet params:', error);

  //     return {};
  //   }
  // };

  // const initializePaymentSheet = async () => {
  //   try {
  //     const {paymentIntentClientSecret} = await fetchPaymentSheetParams();

  //     if (!paymentIntentClientSecret) {
  //       console.log('Missing required payment sheet parameters');
  //       return
  //     }

  //     const {error} = await initPaymentSheet({
  //       merchantDisplayName: 'Example, Inc.',
  //       paymentIntentClientSecret, // Correct parameter for Stripe
  //       allowsDelayedPaymentMethods: true,
  //       paymentMethodTypes: ['card'],
  //       defaultBillingDetails: {
  //         name: 'Jane Doe',
  //       },
  //     });

  //     if (error) {
  //       console.log(`Stripe initialization error: ${error.message}`);
  //     }

  //     setLoading(true);
  //     console.log('Payment sheet initialized successfully');
  //   } catch (error) {
  //     console.warn('Error initializing payment sheet:', error);
  //     console.log(
  //       'Error',
  //       'Failed to initialize payment sheet. Please try again.',
  //     );
  //   }
  // };

  // const openPaymentSheet = async () => {
  //   console.log('click');
  //   const {error} = await presentPaymentSheet();

  //   if (error) {
  //     console.log(`Error code: ${error.code}`, error.message);
  //   } else {
  //     const formData = new FormData();

  //     // Append fields to FormData
  //     formData.append('product_id', product_id);
  //     formData.append('country', payment?.country);
  //     formData.append('state', payment?.state);
  //     formData.append('city', payment?.city);
  //     formData.append('zip', payment?.zip);
  //     formData.append('total_amount', total_price);
  //     const res = await postBuyProductBackend(formData).unwrap();
  //     console.log('final response', res);
  //     setAlertVisible(true);
  //   }
  // };

  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);



  const { confirmPayment } = useConfirmPayment();

  const [cardDetails, setCardDetails] = useState();
  const [clientSecret, setClientSecret] = useState(null);
  const [intentId, setIntentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripePaymentId, setStripePaymentId] = useState()
  const [shippingMethodId, setShippingMethodId] = useState();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  console.log(cardDetails, "cardDetails+++++");


  const fetchPaymentIntentManual = async () => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await postBuyProduct(formData); // Your API must create PaymentIntent with capture_method: 'manual'
      console.log('payment response', response?.data?.data);
      console.log('stripe_payment_id:', response?.data?.data?.id);
      setStripePaymentId(response?.data?.data?.id);
      console.log('shipping_method_id:', response?.data?.data?.payment_method);
      // setShippingMethodId(response?.data?.data?.payment_method);
      const rawData = response?.data?.data;
      console.log(rawData?.client_secret, "rawData++++ client_secret");
      console.log(rawData?.id, "rawData++++ client_secret");

      if (!rawData || !rawData.client_secret || !rawData.id) {
        throw new Error('Invalid payment intent data');
      }

      setClientSecret(rawData.client_secret);
      setIntentId(rawData.id);
    } catch (error) {
      console.warn('Error fetching PaymentIntent:', error);
    }
  };

  useEffect(() => {
    fetchPaymentIntentManual();
  }, []);

  // const handleManualPayment = async () => {
  //   if (!clientSecret || !cardDetails?.complete) {
  //     console.log('Missing required fields');
  //     return;
  //   }
  //   console.log(clientSecret, "clientSecret+++++ before confirmPayment");
  //   const { paymentIntent, error } = await confirmPayment(clientSecret, {
  //     paymentMethodType: 'Card', // ✅ This is required
  //   });
  //   console.log(paymentIntent, "paymentIntent+++++");
  //   if (error) {
  //     console.log('Payment confirmation error:', error.message);
  //     return;
  //   }

  //   console.log('Payment confirmed, now capturing...');

  //   try {
  //     // Call your backend to manually capture the payment
  //     const formData = new FormData();
  //     formData.append('payment_intent_id', intentId);
  //     formData.append('product_id', product_id);
  //     formData.append('country', payment?.country);
  //     formData.append('state', payment?.state);
  //     formData.append('city', payment?.city);
  //     formData.append('zip', payment?.zip);
  //     formData.append('total_amount', total_price);
  //     const captureRes = await postBuyProductBackend(formData).unwrap(); // Your capture endpoint
  //     console.log('Capture successful:', captureRes);

  //     setAlertVisible(true);
  //   } catch (err) {
  //     console.error('Capture error:', err);
  //   }
  // };

  const handleManualPayment = async () => {

    // if (isProcessing) return; // 🚫 Prevent multiple taps
    //   setIsProcessing(true);     // ✅ Mark as processing

    if (!clientSecret || !cardDetails?.complete) {
      console.log('Missing required fields');
      // setIsProcessing(false); // reset if missing input
       setGeneralFieldErrors('Missing required fields');
      return;
    }

    try {
      // Confirm payment only if it's not already in requires_capture state
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: 'Test User',
            email: 'jrtushar@gmail.com',
          },
        },
      });

      console.log(paymentIntent, 'paymentIntent+++++');

      if (error) {
        console.log('Payment confirmation error:', error.message);
        return;
      }

      if (paymentIntent?.status === 'RequiresCapture') {
        console.log('✅ Payment confirmed, now sending for capture...');

        const formData = new FormData();
        // formData.append('stripe_payment_id', paymentIntent.id);
        // formData.append('shipping_method_id', payment?.shipii)
        formData.append('product_id', product_id);
        formData.append('stripe_payment_id', stripePaymentId)
        formData.append('shipping_method_id', shipingMethodId)
        formData.append('country', payment?.country);
        formData.append('state', payment?.state);
        formData.append('city', payment?.city);
        formData.append('zip', payment?.zip);
        formData.append('address', payment?.address);
        formData.append('total_amount', total_price);

        const captureRes = await postBuyProductBackend(formData)
        console.log('✅ Capture successful:', captureRes);
        if (captureRes?.status === false && captureRes?.message) {
          // Validation error captureResponse
          const errors: Record<string, string> = {};
          for (const key in captureRes.message) {
            errors[key] = captureRes.message[key][0]; // Get first message
          }
          setFieldErrors(errors);
        } else {
          setFieldErrors({});
          setAlertVisible(true);
        }
      } else {
        console.warn('⚠️ Unexpected payment intent status:', paymentIntent?.status);
      }
    } catch (err: any) {
      if (err?.message?.includes('requires_capture')) {
        console.log('❗ PaymentIntent already confirmed, skipping confirmPayment');
        // Capture the existing intent instead
        const formData = new FormData();
        formData.append('payment_intent_id', intentId); // <- use the state variable
        formData.append('product_id', product_id);
        formData.append('stripe_payment_id', stripePaymentId)
        formData.append('shipping_method_id', shipingMethodId)
        formData.append('country', payment?.country);
        formData.append('state', payment?.state);
        formData.append('city', payment?.city);
        formData.append('zip', payment?.zip);
        formData.append('total_amount', total_price);
        console.log(formData, "formdata before sending++++++++++++++++++")
        const captureRes = await postBuyProductBackend(formData).unwrap();
        console.log('✅ Capture successful after skipping confirm:', captureRes);
        setAlertVisible(true);
      } else {
        console.error('❌ Unexpected error:', err);
      }
    }
  };



  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ....</Text>
      </View>
    );
  }

  // if (isError) {
  //   return (
  //     <View style={tw`flex-1 justify-center items-center`}>
  //       <Text style={tw`text-red-500 text-lg`}>Failed to load products.</Text>
  //       <TouchableOpacity
  //         style={tw`mt-4 p-2 bg-[#064145] rounded-lg`}
  //         onPress={() => navigation?.goBack()}>
  //         <Text style={tw`text-white`}>Go Back</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  const countries = [
    // { label: 'United States', value: 'us' },
    // { label: 'Bangladesh', value: 'bd' },
    // { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'GB' }, // ✅ Added
    // Add more countries
  ];

  const handleZipChange = (text: string) => {
    setPayment(prev => ({
      ...prev,
      zip: text,
    }));

    // Validate zip when length >= 5 (optional rule)
    if (text.length >= 5) {
      triggerValidateZip(text);
    }
  };


  return (
    <View style={tw`h-full bg-white px-[4%] pb-4`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2 pb-2`}
        onPress={() => router.back()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          Payment procedure
        </Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={tw`pb-4`}>
        <View style={tw`bg-primary100 rounded-xl p-3 mt-2`}>
          <Text style={tw`text-primary text-sm font-RoboMedium mb-4`}>
            Product Details:
          </Text>

          <View style={tw`flex-row items-center gap-2`}>
            <View style={tw`w-[30%]`}>
              <Image
                source={{ uri: data?.data?.images[0] }}
                style={tw`w-full h-20 rounded-xl`}
              />
            </View>
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-title text-xs font-RoboMedium`}>
                  {data?.data?.title}
                </Text>
                <Text style={tw`text-title text-xs font-RoboMedium`}>
                  €{data?.data?.price}
                </Text>
              </View>
              <Text style={tw`text-subT text-[10px] font-RoboNormal mt-1`}>
                {data?.data?.description}
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`bg-primary100 rounded-xl p-3 mt-2`}>
          <Text style={tw`text-primary text-sm font-RoboMedium mb-2`}>
            Order summary:
          </Text>

          <View style={tw`gap-y-2`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>
                Shipping Method:
              </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                {shippingMethodName}
              </Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>Order: </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                €{data?.data?.price}
              </Text>
            </View>
            {/* <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>
               Shipping Method:
              </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                €{data?.data?.buyer_protection_fee}
              </Text>
            </View> */}
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>
                Buying protection fee:
              </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                €{data?.data?.buyer_protection_fee}
              </Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>
                Platform fee:
              </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                €{data?.data?.platform_fee}
              </Text>
            </View>

            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>
                Shipping:
              </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                ${data?.data?.shipping_fee}
              </Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-sm font-RoboBold`}>Price: </Text>
              <Text style={tw`text-title text-base font-RoboMedium`}>
                €{from === 'buyer' ? final_price : `${data?.data?.final_price}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`mt-2 bg-primary100 rounded-xl p-3`}>
          <Text style={tw`text-primary text-sm font-RoboMedium`}>
            Shipping address:
          </Text>
          <View style={tw`mt-3`}>
            {/* <InputText
              placeholder={'Country'}
              containerStyle={tw`py-0 bg-white`}
              onChangeText={text =>
                setPayment(prev => ({ ...prev, country: text }))
              }
            /> */}

            <Dropdown
              style={tw`bg-white rounded-2xl h-8 mb-2 px-4`}
              data={countries}
              labelField="label"
              valueField="value"
              placeholderStyle={tw`text-primary text-xs`}
              placeholder="Country"
              value={payment.country}
              onChange={item =>
                setPayment(prev => ({ ...prev, country: item.value }))
              }
            />
   {fieldErrors?.country &&
              <Text style={tw`text-red-500 text-xs mt-1`}>
                {fieldErrors.country}
              </Text>
            }
            <InputText
              style={tw`h-8`}
              placeholder={'State'}
              containerStyle={tw`py-0 bg-white`}
              onChangeText={text =>
                setPayment(prev => ({
                  ...prev,
                  state: text,
                }))
              }
            />
   {fieldErrors && (
              <Text style={tw`text-red-500 text-xs mt-1`}>{fieldErrors.state}</Text>
            )}
            <InputText
              style={tw`h-8`}
              placeholder={'City'}
              containerStyle={tw`py-0 bg-white`}
              onChangeText={text =>
                setPayment(prev => ({
                  ...prev,
                  city: text,
                }))
              }
            />

            {fieldErrors && (
              <Text style={tw`text-red-500 text-xs mt-1`}>{fieldErrors.city}</Text>
            )}
            <InputText
              style={tw`h-8`}
              placeholder={'Zip Code'}
              containerStyle={tw`py-0 bg-white`}
              // keyboardType="number-pad"
              // onChangeText={text =>
              //   setPayment(prev => ({
              //     ...prev,
              //     zip: text,
              //   }))
              // }
              onChangeText={handleZipChange}
            />
            {typeof zipValidationResult?.result === 'boolean' && (
              <Text style={{ color: zipValidationResult.result ? 'green' : 'red' }}>
                {zipValidationResult.result ? 'Valid ZIP' : 'Invalid ZIP'}
              </Text>
            )}


            {fieldErrors && (
              <Text style={tw`text-red-500 text-xs mt-1`}>{fieldErrors.city}</Text>
            )}
            <InputText
              style={tw`h-8`}
              placeholder={'Address'}
              containerStyle={tw`py-0 bg-white`}
              keyboardType="number-pad"
              onChangeText={text =>
                setPayment(prev => ({
                  ...prev,
                  address: text,
                }))
              }
            />

              {fieldErrors && (
              <Text style={tw`text-red-500 text-xs mt-1`}>{fieldErrors.address}</Text>
            )}

            <View style={tw`mt-2`}>
              <Text style={tw`text-primary text-sm font-RoboMedium`}>
                Enter card details:
              </Text>
              <CardField
                postalCodeEnabled={true}
                // placeholder={{
                //   number: '4242 4242 4242 4242',
                // }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                  borderRadius: 20,
                  fontSize: 12
                }}
                style={{ height: 50, marginVertical: 20 }}
                onCardChange={(cardDetails) => {
                  setCardDetails(cardDetails); // You already have this setState
                }}
              />

            </View>
          </View>

        </View>


        {/* <View style={tw`mt-5 bg-primary100 rounded-xl p-3`}>
          <Text style={tw`text-title text-sm font-RoboBold`}>
            Card information:
          </Text>
          <View style={tw`mt-3`}>
            <InputText
              placeholder={'123 458 6548'}
              containerStyle={tw`py-0 bg-white`}
              onChangeText={(text: string) => setCountry(text)}
              label={'Card Number'}
              keyboardType="number-pad"
              rightItem={
                <Image source={require('../../assets/images/card-image.png')} />
              }
            />

            <View style={tw`flex-row items-center gap-2`}>
              <View style={tw`flex-1`}>
                <InputText
                  placeholder={'MM/YY'}
                  label={'Expiry Date'}
                  containerStyle={tw`py-0 bg-white`}
                  onChangeText={(text: string) => setState(text)}
                />
              </View>
              <View style={tw`flex-1`}>
                <InputText
                  placeholder={'CVV'}
                  label={'Security Code'}
                  containerStyle={tw`py-0 bg-white`}
                  onChangeText={(text: string) => setState(text)}
                />
              </View>
            </View>
          </View>
        </View> */}
      </ScrollView>
      <Button
        title={`Pay €${from === 'buyer' ? final_price : `${data?.data?.final_price}`}`}
        // onPress={openPaymentSheet}
        onPress={handleManualPayment}
      />
       {generalFieldErrors && typeof generalFieldErrors === 'string' &&
        <Text style={tw`text-red-500 text-xs mt-1`}>
          {generalFieldErrors}*
        </Text>}
      <NormalModal
        layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
        containerStyle={tw`rounded-3xl bg-white p-5`}
        visible={isCongratsModalVisible}
        setVisible={setIsCongratsModalVisible}>
        <View style={tw``}>
          <View style={tw`items-center`}>
            <Image source={require('../../../assets/images/congrats.png')} />
          </View>
          <Text style={tw`text-primary text-xl font-RoboBold text-center mt-4`}>
            Congratulations!{'\n'}Your purchase is done
          </Text>
          <Text
            style={tw`text-subT text-base font-RoboMedium mt-2 text-center`}>
            Thank you for make purchase with us
          </Text>
          <Button
            containerStyle={tw`mt-4`}
            title={'Done'}
            onPress={() => {
              setIsCongratsModalVisible(false);
              setIsRatingModalVisible(true);
            }}
          />
        </View>
      </NormalModal>

      <NormalModal
        layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
        containerStyle={tw`rounded-3xl bg-white p-5`}
        visible={isRatingModalVisible}
        setVisible={setIsRatingModalVisible}>
        <View style={tw``}>
          <Text style={tw`text-title text-xl font-RoboBold text-center mt-4`}>
            Give ratings
          </Text>
          <View style={tw`flex-row justify-center mb-2 mt-4`}>
            <View style={tw`flex-row items-center gap-2`}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setRating(index + 1)}>
                  <SvgXml
                    xml={index < rating ? IconGoldRating : IconSliverRating}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={tw`text-title text-sm font-RoboMedium mt-2`}>
            Review comments
          </Text>
          <InputText
            placeholder="Enter your review"
            containerStyle={tw`mt-3`}
            style={tw`h-40`}
            placeholderAlignment="top"
          />
          <Button
            containerStyle={tw`mt-4`}
            title={'Done'}
            // onPress={() => {
            //   setIsRatingModalVisible(false);
            // }}
            // onPress={openPaymentSheet}
            onPress={handleManualPayment}
          />
        </View>
      </NormalModal>
      <CustomAlert
        visible={alertVisible}
        message="Payment success"
        onClose={closeCustomAlert}
      />
    </View>
  );
};

export default Payment;
