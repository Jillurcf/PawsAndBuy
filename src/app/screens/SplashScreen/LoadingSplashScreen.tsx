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
        (navigation as any)?.replace('Login');
      }
    } catch (error) {
      console.log("28", error);
      (navigation as any)?.replace('Login');
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
        style={tw`w-28 h-30 bg-cover `}
        contentFit="contain"
        // resizeMode={FastImage.resizeMode.contain}
        source={require('../../../assets/images/logo.png')}
      />
      <StatusBar barStyle="light-content" backgroundColor={'#4964C6'} />
    </View>
  );
};

export default LoadingSplash;

const styles = StyleSheet.create({});
