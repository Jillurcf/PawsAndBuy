// import { StatusBar, StyleSheet, View } from 'react-native';
// // import {getSocket, initiateSocket} from '../../redux/services/socket';

// import React, { useEffect } from 'react';

// // import {NavigProps} from '../../interfaces/NaviProps';
// // import { getStorageToken, lStorage } from '../utils/utils';
// import tw from '../lib/tailwind';
// // import { useLazyGetCheckTokenQuery } from '../redux/apiSlices/authSlice';
// import { Image } from 'expo-image';
// import { router } from 'expo-router';
// // import {getStorageToken} from '../../utils/utils';

// const LoadingSplash = () => {
 
// //   const [triggerCheckToken, { data, error, isLoading }] = useLazyGetCheckTokenQuery()
// //  const token = lStorage.getString("token")

 
// //   const handleCheckValidToken = async () => {
// //     try {
// //       const res = await triggerCheckToken(token).unwrap();
// //       // const res = await checkToken(token).unwrap();
// //       console.log("loading token++++++++++++++++++++++", res)
// //       if (res?.token_status === true) {
// //         router.push('BottomHome');
// //       } else {
// //         router.push('auth/login');
// //       }
// //     } catch (error) {
// //       console.log("28", error);
// //       router.push('auth/login');
// //     }
// //   };
// //   React.useEffect(() => {
// //     if (token) {
// //       handleCheckValidToken();
// //     } else {
// //       router.push('auth/login');
// //     }
// //   }, []);

//     useEffect(()=> {
//        const timer = setTimeout(()=> {
//         router.push("/screens/Auth/Login")
//        }, 1000)

//        return ()=> clearTimeout(timer)
//     }, [])

//   return (
//     <View style={tw`flex-1 w-full bg-black justify-center items-center`}>
//       <Image
//         style={tw`w-28 h-28 flex-1 `}
//         // resizeMode={FastImage.resizeMode.contain}
//         source={require('../assets/images/logo.png')}
//       />
//       <StatusBar barStyle="light-content" backgroundColor={'black'} />
//     </View>
//   );
// };

// export default LoadingSplash;

// const styles = StyleSheet.create({});


import { StatusBar, StyleSheet, View } from 'react-native';
// import {getSocket, initiateSocket} from '../../redux/services/socket';

import tw from '@/src/lib/tailwind';
import { useCheckTokenMutation, useLazyGetCheckTokenQuery } from '@/src/redux/api/apiSlice/apiSlice';
import { getStorageToken } from '@/src/utils/Utils';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';

// import {NavigProps} from '../../interfaces/NaviProps';


// import {getStorageToken} from '../../utils/utils';

const LoadingSplash = ({navigation} : {navigation:any}) => {
  // const token = AsyncStorage.getItem('token');
  const [triggerCheckToken, { data, error, isLoading }] = useLazyGetCheckTokenQuery()
 const token = getStorageToken()
 console.log("17", token)
  // const token = AsyncStorage.getItem('token');
//   const socket = getSocket();
  const [checkToken] = useCheckTokenMutation({});
  // console.log(token);
  const handleCheckValidToken = async () => {
    try {
      const res = await triggerCheckToken(token).unwrap();
      // const res = await checkToken(token).unwrap();
      console.log("loading token++++++++++++++++++++++", res)
      if (res.token_status === true) {
        router.replace('/(drawer)/(tab)');
      } else {
        router?.replace('/screens/Auth/Login');
      }
    } catch (error) {
      console.log("28", error);
      router?.replace('/screens/Auth/Login');
    }
  };
  React.useEffect(() => {
    if (token) {
    //   if (!socket) {
    //     initiateSocket();
    //   }
      handleCheckValidToken();
    } else {
      (navigation as any)?.replace('Login');
    }
  }, []);

  return (
    <View style={tw`flex-1 w-full bg-primary justify-center items-center`}>
      <Image
      contentFit='contain'
        style={tw`w-28 h-30 flex-1 `}
        // resizeMode={FastImage.resizeMode.contain}
        source={require('../assets/images/logo.png')}
      />
      <StatusBar barStyle="light-content" backgroundColor={'#4964C6'} />
    </View>
  );
};

export default LoadingSplash;

const styles = StyleSheet.create({});

