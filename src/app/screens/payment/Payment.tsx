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
import { useGetHomeProductDetailsQuery, usePostBuyProductBackendMutation, usePostBuyProductMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { useStripe } from '@stripe/stripe-react-native';



interface PaymentData {
  product_id: string | undefined;
  country: string;
  state: string;
  city: string;
  zip: string;
  total_amount: string;
}

const Payment = ({navigation, route}: any) => {
  const [payment, setPayment] = React.useState<PaymentData>({
    product_id: route?.params?.id || '',
    country: '',
    state: '',
    city: '',
    zip: '',
    total_amount: '',
  });
  // const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isCongratsModalVisible, setIsCongratsModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const [postBuyProduct] = usePostBuyProductMutation();
  const [postBuyProductBackend] = usePostBuyProductBackendMutation();
  const {id, from, final_price} = route?.params; // Access the 'id' from params
  console.log('35------------', route?.params);
  console.log('35====', id);
  const {data, isLoading, isError} = useGetHomeProductDetailsQuery(id);
  console.log('data+++', data?.data?.final_price);
  const total_price = data?.data?.final_price;
  const total_price_after_offer = data?.data?.final_price;
  console.log('totalPrice', total_price);
  const product_id = id;
  console.log('product id', product_id);

  const payment_method = 'pm_card_visa';
  const payload = {total_price, product_id, payment_method};
  console.log('payload', payload);

  const [alertVisible, setAlertVisible] = useState(false);

  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  const fetchPaymentSheetParams = async () => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value); // Append both the key and its value
      });

      console.log('117', formData);

      const response = await postBuyProduct(formData); // API call
      console.log('Full API response:', response);

      // Validate response data
      const rawData = response?.data?.data;
      console.log('119', rawData);
      if (!rawData || typeof rawData !== 'object') {
        console.warn('Error: Response data is not a valid object:', rawData);
        throw new Error('Invalid response format');
      }

      if (!rawData.status) {
        console.warn('API Error:', rawData.message || 'Unknown error');
      }

      const {client_secret} = rawData;
      console.log('Parsed payment params:', {client_secret});

      if (!client_secret) {
        console.warn('Missing required payment sheet parameters');
      }

      return {paymentIntentClientSecret: client_secret};
    } catch (error) {
      console.warn('Error fetching payment sheet params:', error);

      return {};
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const {paymentIntentClientSecret} = await fetchPaymentSheetParams();

      if (!paymentIntentClientSecret) {
        console.log('Missing required payment sheet parameters');
      }

      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Example, Inc.',
        paymentIntentClientSecret, // Correct parameter for Stripe
        allowsDelayedPaymentMethods: true,
        paymentMethodTypes: ['card'],
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });

      if (error) {
        console.log(`Stripe initialization error: ${error.message}`);
      }

      setLoading(true);
      console.log('Payment sheet initialized successfully');
    } catch (error) {
      console.warn('Error initializing payment sheet:', error);
      console.log(
        'Error',
        'Failed to initialize payment sheet. Please try again.',
      );
    }
  };

  const openPaymentSheet = async () => {
    console.log('click');
    const {error} = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      const formData = new FormData();

      // Append fields to FormData
      formData.append('product_id', product_id);
      formData.append('country', payment?.country);
      formData.append('state', payment?.state);
      formData.append('city', payment?.city);
      formData.append('zip', payment?.zip);
      formData.append('total_amount', total_price);
      const res = await postBuyProductBackend(formData).unwrap();
      console.log('final response', res);
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

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

  return (
    <View style={tw`h-full bg-white px-[4%] pb-4`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2 pb-2`}
        onPress={() => navigation?.goBack()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          Payment procedure
        </Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={tw`pb-4`}>
        <View style={tw`bg-primary100 rounded-xl p-3 mt-4`}>
          <Text style={tw`text-primary text-sm font-RoboMedium mb-4`}>
            Product Details:
          </Text>

          <View style={tw`flex-row items-center gap-2`}>
            <View style={tw`w-[30%]`}>
              <Image
                source={{uri: data?.data?.images[0]}}
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
        <View style={tw`bg-primary100 rounded-xl p-3 mt-4`}>
          <Text style={tw`text-primary text-sm font-RoboMedium mb-4`}>
            Order summary:
          </Text>

          <View style={tw`gap-y-2`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>Order: </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                €{data?.data?.price}
              </Text>
            </View>
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
              <Text style={tw`text-subT text-sm font-RoboBold`}>Prezzo: </Text>
              <Text style={tw`text-title text-base font-RoboMedium`}>
              €{from === 'buyer' ? final_price : `${data?.data?.final_price}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`mt-5 bg-primary100 rounded-xl p-3`}>
          <Text style={tw`text-title text-sm font-RoboBold`}>
            Shipping address:{' '}
          </Text>
          <View style={tw`mt-3`}>
            <InputText
              placeholder={'Country'}
              containerStyle={tw`py-0 bg-white`}
              onChangeText={text =>
                setPayment(prev => ({...prev, country: text}))
              }
            />

            <InputText
              placeholder={'State'}
              containerStyle={tw`py-0 bg-white`}
              onChangeText={text =>
                setPayment(prev => ({
                  ...prev,
                  state: text,
                }))
              }
            />

            <InputText
              placeholder={'City'}
              containerStyle={tw`py-0 bg-white`}
              onChangeText={text =>
                setPayment(prev => ({
                  ...prev,
                  city: text,
                }))
              }
            />
            <InputText
              placeholder={'Zip Code'}
              containerStyle={tw`py-0 bg-white`}
              keyboardType="number-pad"
              onChangeText={text =>
                setPayment(prev => ({
                  ...prev,
                  zip: text,
                }))
              }
            />
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
  onPress={openPaymentSheet}
/>
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
            onPress={openPaymentSheet}
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
