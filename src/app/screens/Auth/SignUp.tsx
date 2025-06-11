import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { IconCloseEye, IconEnvelope, IconGoogle, IconKey, IconLocaiton, IconOpenEye, IconUser } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import InputText from '@/src/components/InputText';
import tw from '@/src/lib/tailwind';
import { useSignupMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { SvgXml } from 'react-native-svg';


const SignUp = ({navigation}: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [SignUp, {isLoading, isError}] = useSignupMutation();
  console.log('27', email, password, username, location);
  // const data = {email, password, name:username, address:location}

  const handleSignup = async () => {
    try {
      // Validate required fields before sending the request
      if (!email || !password || !username || !location) {
        Alert.alert("Error", "All fields are required.");
        return;
      }
  
      const data = {
        email: email.trim(),
        password: password.trim(),
        name: username.trim(),
        address: location.trim(),
      };
  
      // Send data through the SignUp function and unwrap the response
      const response = await SignUp(data).unwrap();
  
      console.log("Response from SignUp:", response);
  
      if (response && response.status === true) {
        navigation?.navigate('VerifyOtp', { email, from: "signup" });
      } else if (response && response.status === false) {
        // Extract error messages
        const errorMessages = [];
        if (response?.message) {
          Object.values(response.message).forEach((errors) => {
            if (Array.isArray(errors)) {
              errorMessages.push(...errors);
            } else {
              errorMessages.push(errors);
            }
          });
        }
  
        // Show Alert with error messages
        Alert.alert("Signup Failed", errorMessages.join("\n"));
      }
    } catch (err) {
      console.error("Error during SignUp:", err);
  
      // Extract error messages
      const errorMessages = [];
      if (err?.message) {
        Object.values(err.message).forEach((errors) => {
          if (Array.isArray(errors)) {
            errorMessages.push(...errors);
          } else {
            errorMessages.push(errors);
          }
        });
      }
  
      // Show Alert with error messages or a default message
      Alert.alert("Signup Error", errorMessages.length ? errorMessages.join("\n") : "An unexpected error occurred. Please try again.");
    }
  };
  
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
        <View>
          <Text style={tw`text-primary text-2xl font-RoboMedium`}>
            {/* Iscrizione */}
            Register
          </Text>
          <Text style={tw`text-subT text-xs font-RoboNormal mb-8`}>
            {/* Inserisci le informazioni corrette per effettuare l'accesso */}
            Enter the correct information to sign in.
          </Text>

          <View>
            <InputText
              placeholder={
                // 'Inserisci il tuo nome utente'
                'Enter your name'
              }
              placeholderColor={'#949494'}
              label={
                // 'Nome utente'
              'Your name'
              }
              iconLeft={IconUser}
              onChangeText={(text: any) => setUsername(text)}
            />
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
            <InputText
              placeholder={
                // 'Inserisci la tua password'
                'Enter your password'
              }
              placeholderColor={'#949494'}
              label={'Password'}
              iconLeft={IconKey}
              iconRight={isShowPassword ? IconOpenEye : IconCloseEye}
              onChangeText={(text: any) => setPassword(text)}
              isShowPassword={!isShowPassword}
              rightIconPress={() => setIsShowPassword(!isShowPassword)}
            />
            <InputText
              placeholder={
                // 'Inserisci la tua conferma'
                'Enter confirm password'
              }
              placeholderColor={'#949494'}
              label={
                // 'Conferma password'
                'Confirm password'
              }
              iconLeft={IconKey}
              iconRight={isShowConfirmPassword ? IconOpenEye : IconCloseEye}
              onChangeText={(text: any) => setConfirmPassword(text)}
              isShowPassword={!isShowConfirmPassword}
              rightIconPress={() =>
                setIsShowConfirmPassword(!isShowConfirmPassword)
              }
            />
            <InputText
              placeholder={
                // 'Inserisci la tua posizione'
                'Enter your address'
              }
              placeholderColor={'#949494'}
              label={
                // 'Posizione'
                "Address"
              }
              iconLeft={IconLocaiton}
              onChangeText={(text: any) => setLocation(text)}
            />

            <Button
              containerStyle={tw`mt-6`}
              title={
                // 'Iscrizione'
                'Register'
              }
              onPress={handleSignup}
              // onPress={() => {
              //   navigation?.navigate('Login');
              // }}
            />

            <View style={tw`my-6 flex-row items-center gap-2`}>
              <View style={tw`bg-white100 h-[1px] flex-1`} />
              <Text style={tw`text-subT text-xs font-RoboBold`}>O</Text>
              <View style={tw`bg-white100 h-[1px] flex-1`} />
            </View>

            <TouchableOpacity
              style={tw`border border-border rounded-lg p-2 flex-row items-center justify-center gap-2`}>
              <SvgXml xml={IconGoogle} />
              <Text style={tw`text-title text-base font-RoboMedium`}>
                {/* Continua con Google */}
                Continue with google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`flex-row items-center justify-center gap-2 mt-4`}>
          <Text style={tw`text-xs text-title font-RoboMedium`}>
            {/* Hai un account? */}
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={tw`text-xs text-primary border-b border-b-primary font-RoboBold`}>
            Please login

            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
