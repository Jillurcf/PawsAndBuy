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
import { useGetHomeProductDetailsQuery, usePostProductPromotionBackendMutation, usePostProductPromotionIntentMutation } from '@/src/redux/api/apiSlice/apiSlice';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useStripe } from '@stripe/stripe-react-native';
// import DatePicker from 'react-native-date-picker';


interface PaymentData {
  product_id: string | undefined;
  country: string;
  state: string;
  city: string;
  zip: string;
  total_amount: string;
}

const PromotionPayment = ({navigation, route}: any) => {
  const [payment, setPayment] = React.useState<PaymentData>({
    product_id: route?.params?.id || '',
    country: '',
    state: '',
    city: '',
    zip: '',
    total_amount: '',
  });
  // const [country, setCountry] = useState('');
  // const [state, setState] = useState('');
  // const [city, setCity] = useState('');
  // const [zipCode, setZipCode] = useState('');
  const [isCongratsModalVisible, setIsCongratsModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  // console.log('dfdfd', date);
  const [alertVisible, setAlertVisible] = useState(false);

  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  const [postProductPromotionIntent] = usePostProductPromotionIntentMutation();
  const [postProductPromotionBackend] =
    usePostProductPromotionBackendMutation();
  const {id} = route?.params; // Access the 'id' from params
  console.log('35------------', route?.params);
    console.log('35====', id);
  const {data, isLoading, isError} = useGetHomeProductDetailsQuery(id);
    console.log('data+++', data?.data);
  //   const amount = 10 * 100;
  //   console.log('totalPrice', amount);
  const product_id = 71;
  //   console.log('product id', product_id);

  const payment_method = 'pm_card_visa';

  //   console.log('payload', payload);

  // date
  const formattedDate = date.toISOString().slice(0, 10); // Format the date in ISO string
  const formattedEndDate = endDate.toISOString().slice(0, 10); // Format the end date in ISO string
  const totalDays = Math.ceil(
    (endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  const perdayAmount = data?.data?.per_day_promotion_amount;
  console.log('83', formattedDate);
  console.log('total days', totalDays);
  console.log('pamaount', perdayAmount);

  const amount = perdayAmount * totalDays;
  const payload = {amount, product_id, payment_method};
  console.log('amount', amount);

  // const fetchPaymentSheetParams = async () => {
  //   try {
  //     const response = await postBuyProduct(payload); // API call
  //     console.log('Full API response:', response);

  //     // Check if response and response.data are valid
  //     if (!response || !response.data) {
  //       console.error('Error: Response data is undefined or invalid', response);
  //       throw new Error('Invalid response format: No data received from API');
  //     }

  //     const rawData = response.data;
  //     let parsedData;

  //     try {
  //       if (typeof rawData === 'string') {
  //         // Handle rawData as a JSON string
  //         const fixedData = rawData.trim().endsWith('}')
  //           ? rawData
  //           : `${rawData}}`; // Add missing closing brace if needed
  //         parsedData = JSON.parse(fixedData);
  //       } else if (typeof rawData === 'object' && rawData !== null) {
  //         // Handle rawData as a valid object
  //         parsedData = rawData;
  //       } else {
  //         throw new Error('Response data is not a valid JSON string or object');
  //       }
  //     } catch (parseError) {
  //       console.error('Error parsing JSON:', parseError);
  //       throw new Error('Invalid response format');
  //     }

  //     // Extract client_secret from parsed data
  //     const { client_secret } = parsedData || {};
  //     console.log('Parsed payment params:', { client_secret });

  //     // Validate extracted client_secret
  //     if (!client_secret) {
  //       throw new Error('Missing required payment sheet parameters');
  //     }

  //     return { paymentIntentClientSecret: client_secret };
  //   } catch (error) {
  //     console.error('Error fetching payment sheet params:', error);
  //     Alert.alert('Error', 'Failed to initialize payment. Please try again.');
  //     return {};
  //   }
  // };

  const fetchPaymentSheetParams = async () => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value); // Append both the key and its value
      });

      console.log('117', formData);

      const response = await postProductPromotionIntent(formData); // API call
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
    console.log('click')
    const {error} = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      const formData = new FormData();

      // Append fields to FormData
      // formData.append("product_id", product_id );
      // formData.append('country', payment?.country);
      // formData.append('state', payment?.state);
      // formData.append('city', payment?.city);
      formData.append('promotion_start', formattedDate);
      formData.append('promotion_end', formattedEndDate);
      formData.append('promoted_amount', amount);
      const res = await postProductPromotionBackend(formData).unwrap();
      console.log('final response', res);
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [amount]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ....</Text>
      </View>
    );
  }

  return (
    <View style={tw`h-full bg-white px-[4%] pb-4`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2 pb-2`}
        onPress={() => navigation?.goBack()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          Promotion Payment procedure
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
                  {data?.data?.price}
                </Text>
              </View>
              <Text style={tw`text-subT text-[10px] font-RoboNormal mt-1`}>
                {data?.data?.description}
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`bg-primary100 rounded-xl p-3 mt-4`}>
          {/* <Text style={tw`text-primary text-sm font-RoboMedium mb-4`}>
              Order summary:
            </Text> */}

          <View style={tw`gap-y-2`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>Brand: </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                {data?.data?.brand}
              </Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>
                Condition:
              </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                {data?.data?.condition}
              </Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-xs font-RoboNormal`}>
                Location:
              </Text>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                {data?.data?.address}
              </Text>
            </View>
            {/* <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-xs font-RoboNormal`}>
                  Shipping:
                </Text>
                <Text style={tw`text-title text-xs font-RoboNormal`}>
                ${data?.data?.shipping_fee}
                  </Text>
              </View> */}
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-subT text-sm font-RoboBold`}>Prezzo: </Text>
              <Text style={tw`text-title text-base font-RoboMedium`}>
              {data?.data?.final_price}
              </Text>
            </View>
          </View>
        </View>
        {/* Data */}
        <View style={tw`bg-primary100 rounded-xl p-3 mt-4`}>
          <View style={tw`flex-row justify-between py-2`}>
            <Text style={tw`text-black font-RoboBold`}>Promotion duration:</Text>
            <Text style={tw`text-black font-RoboBold`}>{totalDays} days</Text>
          </View>
          {/* Start date */}
          <View>
            <View style={tw`flex-row justify-between items-center h-12`}>
              <Button
                style={tw`px-4`}
                title="Select start date"
                onPress={() => setOpen(true)}
              />
              <Text>{formattedDate}</Text>
            </View>
            <RNDateTimePicker
              modal
              open={open}
              date={date}
              onConfirm={date => {
                setOpen(false);
                setDate(date);
                console.log('start date selected');
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
            <View style={tw`flex-row justify-between items-center h-12`}>
              <Button
                style={tw`px-5`}
                title="Select end date"
                onPress={() => setOpenEnd(true)}
              />
              <Text>{formattedEndDate}</Text>
            </View>
            <RNDateTimePicker
              modal
              open={openEnd}
              date={endDate}
              onConfirm={date => {
                setOpenEnd(false);
                setEndDate(date);
                console.log('End date selected');
              }}
              onCancel={() => {
                setOpenEnd(false);
              }}
            />
          </View>
          <View style={tw`flex-row justify-end py-2`}>
            <Text style={tw`text-lg font-RoboBold flex-row justify-end`}>
              Total: ${amount}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Button
        title={`Pay $ ${amount}`}
        // onPress={() => setIsCongratsModalVisible(true)}
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
        message="Success', 'Your promotion order is confirmed!"
        onClose={closeCustomAlert}
      />
    </View>
  );
};

export default PromotionPayment;
