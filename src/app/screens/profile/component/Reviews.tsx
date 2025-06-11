import { IconGoldRating, IconSliverRating } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { useGetReviewsQuery } from '@/src/redux/api/apiSlice/apiSlice';
import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';




const Reviews = ({navigation}) => {
  const {data, isLoading, isError} = useGetReviewsQuery({});
  console.log("reviews", data?.data?.data)
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>Failed to load products.</Text>
        <TouchableOpacity
          style={tw`mt-4 p-2 bg-[#064145] rounded-lg`}
          onPress={() => navigation?.goBack()}>
          <Text style={tw`text-white`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={tw`gap-y-4`}>
      {data?.data?.data?.map((item, index) => (
        <View
          style={tw`flex-row items-center justify-between border-b border-b-primary100 py-2`} key={index}>
          <View style={tw`flex-row items-center gap-3 w-[80%] flex-shrink`}>
            <Image
              source={{uri: item?.buyer?.avatar}}
              style={tw`w-10 h-10 rounded-full`}
            />
            <View style={tw`flex-shrink`}>
              <Text style={tw`text-title text-sm font-RoboMedium`}>
                {item?.buyer?.name}
              </Text>
              <View style={tw`flex-row items-center gap-2 mt-1`}>
                {[...Array(item?.rating)].map((_, index) => (
                  <TouchableOpacity key={index}>
                    <SvgXml
                      xml={
                        index < item?.rating
                          ? IconGoldRating
                          : IconSliverRating
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={tw`text-title text-xs font-RoboNormal mt-3`}>
                {item?.review}
              </Text>
            </View>
          </View>
          <View style={tw`w-[20%]`}>
            <Text style={tw`text-subT text-xs font-RoboNormal`}>
              {item?.time}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Reviews;
