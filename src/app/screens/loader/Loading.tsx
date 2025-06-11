import tw from '@/src/lib/tailwind';
import React from 'react';
import { Image, View } from 'react-native';


const Loading = () => {
  return (
    <View style={tw`h-full justify-center items-center bg-white`}>
      <Image source={require('../../../assets/images/logo.png')}/>
    </View>
  );
};

export default Loading;
