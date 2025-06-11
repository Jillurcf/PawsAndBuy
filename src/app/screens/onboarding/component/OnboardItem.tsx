import tw from '@/src/lib/tailwind';
import React from 'react';
import { Image, Text, View } from 'react-native';


const OnboardItem = ({item, title, subTitle}: any) => {
  return (
    <View>
      {item === 1 ? (
        <Image
          style={tw`w-full`}
          source={require(`../../../../assets/images/onboard1.png`)}
        />
      ) : item === 2 ? (
        <Image
          style={tw`w-full`}
          source={require(`../../../../assets/images/onboard2.png`)}
        />
      ) : (
        <Image
          style={tw`w-full`}
          source={require(`../../../../assets/images/onboard3.png`)}
        />
      )}
      <View style={tw`mt-4 flex-row gap-2 items-center justify-center`}>
        <View
          style={tw`h-1.5 ${
            item === 1 ? 'w-6' : 'w-1.5'
          } bg-primary rounded-full`}
        />
        <View
          style={tw`h-1.5 ${
            item === 2 ? 'w-6' : 'w-1.5'
          } bg-primary rounded-full`}
        />
        <View
          style={tw`h-1.5 ${
            item === 3 ? 'w-6' : 'w-1.5'
          } bg-primary rounded-full`}
        />
      </View>

      <View style={tw`mt-3 `}>
        <Text style={tw`text-title text-[22px] text-center font-RoboBold`}>
          {title}
        </Text>
        <Text style={tw`text-subT text-base font-RoboNormal text-center`}>
          {subTitle}
        </Text>
      </View>
    </View>
  );
};

export default OnboardItem;
