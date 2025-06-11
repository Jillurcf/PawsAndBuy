import { useForgetpassMutation } from '@/src/redux/api/apiSlice/apiSlice';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';

import { IconEnvelope } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import { CustomAlert } from '@/src/components/CustomAlert';
import InputText from '@/src/components/InputText';
import tw from '@/src/lib/tailwind';

const ForgetPass = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [forgetpass, {isLoading, isError}] = useForgetpassMutation()
  console.log("email", email);
  const data = email

  const [alertVisible, setAlertVisible] = useState(false);

  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  const handleForgetPass = async () => {
    console.log("click");
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Error', 'Please enter a valid email address.');
      return;
    }
  
    try {
      console.log("Sending payload:", { email }); // Log the payload for debugging
      const response = await forgetpass({ email }).unwrap(); // Pass email as an object
      console.log("Response received:", response);
  
      if (response?.status) {
        setAlertVisible(true);
        navigation?.navigate('VerifyOtp', {email, from: 'forgetpass'});
      } else {
        console.log('Error', response?.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.log("Error details:", JSON.stringify(err, null, 2));
     console.log(
        'Error',
        err?.data?.message?.email?.join(', ') || err?.data?.message || 'An unexpected error occurred.'
      );
    }
  };
  
  
  // navigation?.navigate('VerifyOtp');

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={tw`px-[4%] pb-4 bg-white h-full justify-between flex-col`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={tw`flex-row items-center justify-center mb-2 mt-4`}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={tw`w-20 h-22`}
          />
        </View>
        <View style={tw``}>
          <Text style={tw`text-primary text-2xl font-RoboMedium`}>
            {/* Dimentica la password */}
            Forget the password.
          </Text>
          <Text style={tw`text-subT text-xs font-RoboNormal mb-8`}>
          {/* Inserisci la tua email utilizzata per creare questo account */}
          Enter the email you used to create this account.
          </Text>

          <View>
            <InputText
              placeholder={
                // 'Inserisci la tua email'
                'Enter your email'
              }
              placeholderColor={'#949494'}
              label={'E-mail'}
              iconLeft={IconEnvelope}
              onChangeText={(text: any) => setEmail(text)}
            />

            <Button
              containerStyle={tw`mt-6`}
              title={
                // 'Invia'
                'Send'
              }
              onPress={handleForgetPass}
            />
          </View>
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        message="An OTP has been sent to your email."
        onClose={closeCustomAlert}
      />
    </View>
  );
};

export default ForgetPass;
