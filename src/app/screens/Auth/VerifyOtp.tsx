// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   Image,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import tw from '../../lib/tailwind';
// import Button from '../../components/Button';
// import { asyncStorage } from 'reactotron-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useOtpVerifyMutation } from '../../redux/api/apiSlice/apiSlice';

// interface ErrorResponse {
//   data?: {
//     message?: string;
//   };
// }

// const VerifyOtp = ({navigation, route}: any) => {
//   const [otp, setOtp] = useState<any>(['', '', '', '', '', '']);
//   const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
//   const inputs = useRef<Array<TextInput | null>>([]);
//   const [email, setEmail] = useState("")
//   const [otpVerify, {isLoading, isError}] = useOtpVerifyMutation()
//   console.log("27", email, otp); 

//   const [seconds, setSeconds] = useState(119);
//   const [isActive, setIsActive] = useState(true);
// const el = async () => {
//   const user = await AsyncStorage.getItem('user');
//   setEmail(user)
//   console.log("email", user);
// } 
// useEffect(() => {
//   el()
// },[])

//   const handleChangeText = (text: string, index: number) => {
//     if (text.length > 1) {
//       text = text.slice(-1);
//     }

//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text !== '' && index < 5) {
//       inputs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyPress = ({nativeEvent}: any, index: number) => {
//     if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
//       inputs.current[index - 1]?.focus();
//     }
//   };

//   // const email = route?.params?.email;
 
//   const handleSendAgainOtp = async () => {
//     setSeconds(119);
//     setIsActive(true);
//   };

//   // Resend OTP timer
//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;
//     if (isActive && seconds > 0) {
//       interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
//     } else if (seconds === 0) {
//       clearInterval(interval!);
//       setIsActive(false);
//     }
//     return () => clearInterval(interval!);
//   }, [isActive, seconds]);

//   const formatSecondsToMinutes = (totalSeconds: number): string => {
//     const minutes = Math.floor(totalSeconds / 60); // Calculate the minutes
//     const seconds = totalSeconds % 60; // Calculate the remaining seconds
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const allFilled = otp.every(item => item !== '');
//   const data = {email, otp}
//   console.log("89", data);
// const handleSendOtop = async () => {
//   try{
//     const response = await otpVerify(data).unwrap()
//     console.log(response);
//   }catch(err) {
//     console.log(err);
//   }
// }
//   return (
//     <View style={tw`bg-white h-full p-[4%]`}>
//       <ScrollView
//         keyboardShouldPersistTaps="always"
//         showsVerticalScrollIndicator={false}>
//         <View style={tw`flex-row items-center justify-center mb-2`}>
//           <Image
//             source={require('../../assets/images/logo.png')}
//             style={tw`w-20 h-20`}
//           />
//         </View>

//         {/* form */}
//         <View style={tw`mt-4`}>
//           <Text style={tw`text-primary text-2xl font-RoboMedium`}>
//             Verifica codice
//           </Text>
//           <Text style={tw`text-subT text-xs font-RoboNormal mb-8`}>
//             Abbiamo inviato un codice di 4 cifre al tuo account Google
//           </Text>
//           {/* <Text style={tw`text-sm font-RoboNormal text-primary mt-1`}>
//             {route?.params?.email}
//           </Text> */}

//           <View style={tw` gap-y-4`}>
//             <View style={tw`flex-row justify-between items-center gap-2`}>
//               {otp.map((digit, index) => (
//                 <TextInput
//                   key={index}
//                   ref={ref => (inputs.current[index] = ref)}
//                   value={digit}
//                   onChangeText={text => handleChangeText(text, index)}
//                   onKeyPress={e => handleKeyPress(e, index)}
//                   onFocus={() => setFocusedIndex(index)}
//                   onBlur={() => setFocusedIndex(null)}
//                   style={tw`${
//                     focusedIndex === index ? 'border-primary' : 'border-title'
//                   } border-[1px] rounded-2xl flex-1 h-16 font-extrabold text-center text-4xl font-RoboBold text-primary`}
//                   keyboardType="numeric"
//                   selectionColor={'#064145'}
//                   placeholderTextColor={'#949494'}
//                   placeholder="0"
//                   maxLength={1}
//                   autoFocus={index === 0}
//                 />
//               ))}
//             </View>

//             <Button
//               disabled={!allFilled}
//               title={'Invia'}
//               containerStyle={tw`${!allFilled ? 'opacity-70' : ''} mt-4`}
//              onPress={handleSendOtop}
//               // onPress={() => {
//               //   navigation?.navigate('Drawer');
//               // }}
//             />
//           </View>
//           <View style={tw`flex-row justify-center items-center mt-6`}>
//             <Text style={tw`font-RoboNormal text-sm text-title text-center`}>
//               {seconds === 0
//                 ? 'Non hai ricevuto il codice?'
//                 : 'Invia nuovamente il codice '}{' '}
//             </Text>
//             <TouchableOpacity
//               onPress={handleSendAgainOtp}
//               disabled={seconds === 0 ? false : true}>
//               <Text style={tw`font-RoboBold text-sm text-primary`}>
//                 {seconds === 0
//                   ? ` Invia di nuovo `
//                   : formatSecondsToMinutes(seconds)}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default VerifyOtp;


import Button from '@/src/components/Button';
import { CustomAlert } from '@/src/components/CustomAlert';
import tw from '@/src/lib/tailwind';
import { useForgetpassMutation, useOtpVerifyMutation } from '@/src/redux/api/apiSlice/apiSlice';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

interface ErrorResponse {
  data?: {
    message?: string;
  };
}

const VerifyOtp = ({navigation, route}: any) => {
  const [otp, setOtp] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);
  // const [email, setEmail] = useState("");
  const [otpVerify, {isLoading, isError}] = useOtpVerifyMutation();
  const [forgetpass,] = useForgetpassMutation()
  // console.log("211", email, otp); 
const {from} = route?.params || {}
  const [seconds, setSeconds] = useState(119);
  const [isActive, setIsActive] = useState(true);
const email = route?.params?.email
console.log("216", email);
const [alertVisible, setAlertVisible] = useState(false);

const showCustomAlert = () => {
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);
};
  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newOtp = otp.split('');
    newOtp[index] = text;
    setOtp(newOtp.join(''));

    if (text !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({nativeEvent}: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSendAgainOtp = async () => {
    setSeconds(119);
    setIsActive(true);
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
           navigation?.navigate('VerifyOtp');
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

  // Resend OTP timer
  // useEffect(() => {
  //   let interval: NodeJS.Timeout | null = null;
  //   if (isActive && seconds > 0) {
  //     interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
  //   } else if (seconds === 0) {
  //     clearInterval(interval!);
  //     setIsActive(false);
  //   }
  //   return () => clearInterval(interval!);
  // }, [isActive, seconds]);

  // const formatSecondsToMinutes = (totalSeconds: number): string => {
  //   const minutes = Math.floor(totalSeconds / 60); // Calculate the minutes
  //   const seconds = totalSeconds % 60; // Calculate the remaining seconds
  //   return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  // };

  const allFilled = otp.length === 6 && otp.split('').every(item => item !== '');
  const data = { email, otp};
  console.log("89", data);

  // const handleSendOtp = async () => {
  //   console.log("click");
  //   try {
  //     // Unwrap response from RTK Query mutation
  //     const response = await otpVerify(data).unwrap();
  
  //     // Process the successful response
  //     console.log("response", response);
  
  //     // Example: If the response contains user information or a token
  //     if (response) {
  //       console.log("OTP Verified Successfully!");
  //       // Navigate to login screen
  //       if(from === 'signup'){
  //         navigation.navigate("CreateNewPass", {email});
  //       } else {
  //         navigation.navigate("Login");
  //       }
       
  //     } else {
  //       console.error("OTP verification failed:", response.message);
  //     }
  //   } catch (err) {
  //     // Log error details for debugging
  //     console.error("Error verifying OTP:", err);
  //   }
  // };

  const handleSendOtp = async () => {
  console.log("click");
  try {
    // Unwrap response from RTK Query mutation
    const response = await otpVerify(data).unwrap();

    // Process the successful response
    console.log("response", response);

    // Navigate based on 'from' condition
    if (response) {
      console.log("OTP Verified Successfully!");
      if (from === 'signup') {
        navigation.navigate("Login"); // Navigate to Login if from signup
      } else {
        navigation.navigate("CreateNewPass", { email }); // Otherwise, go to CreateNewPass
      }
    } else {
      console.error("OTP verification failed:", response?.message);
    }
  } catch (err) {
    // Log error details for debugging
    console.error("Error verifying OTP:", err);
  }
};

  
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={tw`bg-white h-full p-[4%]`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={tw`flex-row items-center justify-center mb-2`}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={tw`w-20 h-22`}
          />
        </View>

        {/* form */}
        <View style={tw`mt-4`}>
          <Text style={tw`text-primary text-2xl font-RoboMedium`}>
            {/* Verifica codice */}
            Verification Code
          </Text>
          <Text style={tw`text-subT text-xs font-RoboNormal mb-8`}>
            {/* Abbiamo inviato un codice di 4 cifre al tuo account Google */}
            We have sent a 4-digit code to your Google account.
          </Text>

          <View style={tw` gap-y-4`}>
            <View style={tw`flex-row justify-between items-center gap-2`}>
              {Array.from({ length: 6 }).map((_, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputs.current[index] = ref)}
                  value={otp[index] || ''}
                  onChangeText={text => handleChangeText(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  style={tw`${
                    focusedIndex === index ? 'border-primary' : 'border-title'
                  } border-[1px] rounded-2xl flex-1 h-16 font-extrabold text-center text-4xl font-RoboBold text-primary`}
                  keyboardType="numeric"
                  selectionColor={'#064145'}
                  placeholderTextColor={'#949494'}
                  placeholder="0"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <Button
              disabled={!allFilled}
              title={
                // 'Invia'
                'Send'
              }
              containerStyle={tw`${!allFilled ? 'opacity-70' : ''} mt-4`}
              onPress={handleSendOtp}
            />
          </View>
          {/* <View style={tw`flex-row justify-center items-center mt-6`}>
            <Text style={tw`font-RoboNormal text-sm text-title text-center`}>
              {seconds === 0
                ? 'Non hai ricevuto il codice?'
                : 'Invia nuovamente il codice '}{' '}
            </Text>
            <TouchableOpacity
              onPress={handleSendAgainOtp}
              disabled={seconds === 0 ? false : true}>
              <Text style={tw`font-RoboBold text-sm text-primary`}>
                {seconds === 0
                  ? ` Invia di nuovo `
                  : formatSecondsToMinutes(seconds)}
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        message="Success', 'An OTP has been sent to your email."
        onClose={closeCustomAlert}
      />
    </View>
  );
};

export default VerifyOtp;
