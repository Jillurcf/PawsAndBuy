import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';



import { SvgXml } from 'react-native-svg';

import { IconCloseEye, IconEnvelope, IconGoogle, IconKey, IconOpenEye } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import InputText from '@/src/components/InputText';
import tw from '@/src/lib/tailwind';
import { useGoogleloginMutation, useLoginMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { getStorageToken, setStorageToken } from '@/src/utils/Utils';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import ImageResizer from 'react-native-image-resizer';


// https://github.com/firebase/firebase-ios-sdk    this is ios sdk
GoogleSignin.configure({
  //  androidClientId: '292720943978-3jvar6l48oabdo7b4gcqdnj23tl7gr3c.apps.googleusercontent.com', // client ID of type ANDROID for your app. Required to get the `idToken` on the user object, and for offline access
  iosClientId:'292720943978-f6evamcqtna5665s7pqobpf2omrfmfr0.apps.googleusercontent.com',
  webClientId:
    '292720943978-eem026vbf56jsrhnfcrrjf6jkkbp2ql7.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

const Login = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [login, {isLoading, isError, error}] = useLoginMutation();
  const [googlelogin] = useGoogleloginMutation();
  const [googleUser, setGoogleUser] = useState();
  const [resizeImg, setResizeImg] = useState([]); // Initialize as an array

  // console.log(email, password);

  const handleLogin = async () => {
    console.log('click');
  
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }
  
    const data = {email, password};
    const formData = new FormData();
    formData?.append("email", email)
    formData?.append("password", password)
    console.log(formData, "data++++++++++++++++")
    try {
      const res = await login(formData).unwrap();
    
      console.log('response', res);
      // if (res.status === "false" || !res.data?.data?.access_token) {
      // Alert.alert(res?.error?.message || 'Invalid email or password')
      // return;
      // }
      if (res.data?.access_token) {
        setStorageToken(res.data?.access_token);
        router?.replace('/screens/SplashScreen/LoadingSplashScreen');
      }
    } catch (error) {
      console.log('login failed', error);
    }
    const token = getStorageToken();
    console.log('token', token);

    if (token) {
      console.log('Token retrieved:', token);
    } else {
      console.log('No token found');
    }
  };

  useEffect(() => {
    if (googleUser?.photo) {
      const processImage = async () => {
        try {
          const resizedImage = await ImageResizer.createResizedImage(
            googleUser.photo,
            96,
            96,
            'JPEG',
            100,
            0,
          );

          console.log('Resized Image Path:', resizedImage.uri);

          setResizeImg(prev => [
            ...prev,
            {
              uri: resizedImage.uri,
              name: `image_${Date.now()}.jpeg`, // Use unique names
              type: 'image/jpeg',
            },
          ]);

          // Alert.alert('Image Processed', `Image saved at: ${resizedImage.uri}`);
        } catch (error) {
          console.error('Image Processing Error:', error);
         console.log('Error', 'Failed to process the image.');
        }
      };

      processImage();
    }
  }, [googleUser?.photo]);

  const handleGoogleLogin = async () => {
    try {
      // Ensure Google Play services are available
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log('125', response?.data?.idToken);
      // if(response?.data?.idToken){
      //   const fcmToken =await AsyncStorage.setItem('token', response?.data?.idToken);
      //   console.log("===", fcmToken)

      // }
      if (response?.data?.user) {
        const {name, email, id: google_id, photo} = response?.data?.user;
        // await navigation?.navigate('Drawer');
        // Set the Google user data for further processing
        setGoogleUser({name, email, google_id, photo});
        console.log('Google Sign-In Successful:', photo);

        // Resize the image if photo exists
        let resizedImage = null;
        if (photo) {
          try {
            resizedImage = await ImageResizer.createResizedImage(
              photo,
              96,
              96,
              'JPEG',
              100,
              0,
            );

            console.log('Resized Image Path:', resizedImage.uri);
          } catch (error) {
            console.error('Image Processing Error:', error);
            console.log('Error', 'Failed to process the image.');
          }
        }
        // Send data to the backend
        try {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('email', email);
          formData.append('google_id', google_id);
          console.log('179', resizedImage);
          // Append photo as filename only
          // if (photo) {
          //   formData.append('photo', {
          //     uri: photo || null,
          //     name: "image",
          //     type: 'image/jpg',
          //   });
          // }

          if (resizedImage) {
            formData.append("photo", {
              uri: resizedImage.uri || null,
              name: `profile_${Date.now()}.jpeg`, // Unique name for the photo
              type: "image/jpeg",
            });
          }

          console.log('FormData ready. Sending request...');
          // formData._parts.forEach(([key, value]) =>
          //   console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`),
          // );
          console.log('formdata', formData);
          const apiResponse = await googlelogin(formData).unwrap();
          console.log('Upload Successful:', apiResponse?.data?.access_token);

          if (apiResponse?.data?.access_token) {
           const res = setStorageToken(apiResponse?.data?.access_token);
           console.log("google token", res)
            router?.replace('/');
          }
        } catch (error) {
          console.error(
            'Error during upload:',
            error?.data?.message || error.message || error,
          );
          Alert.alert(
            'Wrong somewhere',
            'Please try again',
          );
        }
      } else {
        console.log('Google Sign-In Cancelled by User');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);

      // Handle specific Google Sign-In errors
      if (error.code) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log('Google Sign-In already in progress.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Google Play Services not available or outdated.');
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the Google Sign-In process.');
            break;
          case statusCodes.SIGN_IN_REQUIRED:
            console.log('Sign-in is required but has not yet occurred.');
            break;
          default:
            console.log('An unknown error occurred:', error.message);
        }
      } else {
        console.log('An unexpected error occurred:', error);
      }
    }
  };
  

  
  return (
    <View style={tw`px-[4%] pb-4 bg-white flex-1`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={tw`flex-row items-center justify-center mb-2 mt-24`}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={tw`w-20 h-22`}
          />
        </View>
        <Text style={tw`text- text-[36px] font-RobotoBold mt-4 mb-2`}>
          {/* Bentornato! */}
          Welcome back!
        </Text>
        <View style={tw``}>
          <Text style={tw`text-primary text-2xl font-RoboMedium`}>
            {/* Registrazione */}
           Login
          </Text>
          <Text style={tw`text-subT text-xs font-RobotoRegular mb-8`}>
            {/* Inserisci le informazioni corrette per effettuare l'accesso */}
            Enter the correct information to log in.
          </Text>

          <View>
            <InputText
              placeholder={
                // 'Inserisci la tua email'
                "Enter your email"
              }
              placeholderColor={'#949494'}
              label={'E-mail'}
              iconLeft={IconEnvelope}
              onChangeText={(text: any) => setEmail(text)}
            />
            <InputText
              placeholder={
                // 'Inserisci la tua password'
                "Enter your password"
              }
              placeholderColor={'#949494'}
              label={'Password'}
              iconLeft={IconKey}
              iconRight={isShowPassword ? IconOpenEye : IconCloseEye}
              onChangeText={(text: any) => setPassword(text)}
              isShowPassword={!isShowPassword}
              rightIconPress={() => setIsShowPassword(!isShowPassword)}
            />
            <View style={tw`flex-row items-center justify-between`}>
              <TouchableOpacity
                onPress={() => {
                  {
                    setIsCheck(!isCheck);
                  }
                }}
                style={tw`flex-row items-center gap-2`}>
                {/* <Checkbox
                  color={isCheck ? '#064145' : '#A8A8A8'}
                  value={isCheck}
                  size={20}
                /> */}
                {/* <Text style={tw`text-sm text-subT font-RoboNormal`}>
                  Ricordati di me
                </Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation?.navigate('ForgetPass')}>
                <Text
                  style={tw`text-xs text-primary font-RoboMedium border-b border-b-primary`}>
                  {/* Hai dimenticato la password? */}
                  Did you forget the password?
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              containerStyle={tw`mt-6 bg-[#064145]`}
              title={'Login'}
              onPress={handleLogin}
              // onPress={() => {
              //   navigation?.navigate('Drawer');
              // }}
            />

            <View style={tw`my-6 flex-row items-center gap-2`}>
              <View style={tw`bg-white100 h-[1px] flex-1`} />
              <Text style={tw`text-subT text-xs font-RoboBold`}>O</Text>
              <View style={tw`bg-white100 h-[1px] flex-1`} />
            </View>

            <TouchableOpacity
              onPress={handleGoogleLogin}
              style={tw`mb-2 border border-border rounded-lg p-2 flex-row items-center justify-center gap-2`}>
              <SvgXml xml={IconGoogle} />
              <Text style={tw`text-title text-base font-RoboMedium`}>
                {/* Continua con Google */}
                Continue with google
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={tw`border border-border rounded-lg p-2 flex-row items-center justify-center gap-2`}>
              <SvgXml xml={IconFacebook} />
              <Text style={tw`text-title text-base font-RoboMedium`}>
                Continua con Facebook
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={tw`flex-row items-center justify-center gap-2 mt-4`}>
          <Text style={tw`text-xs text-title font-RobotoMedium`}>
            {/* Non hai un account? */}
            Do not have an account? 
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push('/screens/Auth/SignUp');
            }}>
            <Text
              style={tw`text-xs text-[#064145] border-b border-b-[#064145] font-RobotoBlack`}>
              {/* Iscrizione */} Register here
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar translucent={false}/>
    </View>
  );
};

export default Login;
