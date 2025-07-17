import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import SecondaryHeader from '../../../components/SecondaryHeader';
import tw from '../../../lib/tailwind';

// import Reviews from '.../../../src/app/screens/profile/component/Reviews';

// import CardInformation from './component/CardInformation';

import { IconEdit, IconMail, IconMap } from '@/src/assets/icons/Icons';
import { router } from 'expo-router';
import { useGetProfileQuery } from '../../../redux/api/apiSlice/apiSlice';
import Reviews from '../../screens/profile/component/Reviews';
import Wardrobe from '../../screens/profile/component/Wardrobe';

const Profile = ({navigation}: any) => {
  const [selected, setSelected] = useState(1);
  const {data, isLoading, isError} = useGetProfileQuery({});
  console.log("15",data?.data

  )
  // const {data:wardrobe} = useGetwardrobeProductListQuery();
  // console.log("wardrobe",wardrobe)
  // console.log("Profile data",data?.data)
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ...</Text>
      </View>
    );
  }

  // if (isError) {
  //   return (
  //     <View style={tw`flex-1 justify-center items-center`}>
  //       <Text style={tw`text-red-500 text-lg`}>Failed to load products.</Text>
  //       <TouchableOpacity
  //         style={tw`mt-4 p-2 bg-[#064145] rounded-lg`}
  //         onPress={() => navigation?.goBack()}>
  //         <Text style={tw`text-white`}>Go Back</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }
  return (
    <View style={tw`flex-1 bg-white py-8 px-[4%] h-full`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <SecondaryHeader navigation={navigation} />

        <View style={tw`mt-4`}>
          <View style={tw`items-end`}>
            <TouchableOpacity
              style={tw`bg-primary px-2 py-1 rounded-lg flex-row items-center gap-1`}
              onPress={() => {
               router.push('/screens/profile/EditProfile');
              }}>
              <SvgXml xml={IconEdit} />
              <Text style={tw`text-white text-[10px] font-RoboNormal`}>
                {/* Modifica */}
                Edit profile
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`items-center`}>
           { data?.data?.avatar && <Image
              source={{uri:data?.data?.avatar}}
              style={tw`h-18 w-18 rounded-full`}
            />}
            <Text style={tw`text-title text-lg font-RoboBold mt-2`}>
             {data?.data?.name}
            </Text>
            <Text style={tw`text-subT text-xs font-RoboNormal`}>
              {/* Nessuna recensione ancora */}
              No reviews yet
            </Text>
            <View style={tw`flex-row items-center gap-2 mt-2`}>
              <SvgXml xml={IconMap} />
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                {data?.data?.address}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2 mt-2`}>
              <SvgXml xml={IconMail} />
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                {data?.data?.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`mt-4`}>
          <View style={tw`flex-row items-center gap-4`}>
            <TouchableOpacity
              style={tw`${selected === 1 ? 'border-b border-b-primary' : ''}`}
              onPress={() => setSelected(1)}
              >
              <Text
                style={tw`${
                  selected === 1 ? 'text-title' : 'text-subT'
                } text-sm font-RoboMedium`}>
                {/* Negozio */}
                Store
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`${selected === 2 ? 'border-b border-b-primary' : ''}`}
              onPress={() => setSelected(2)}>
              <Text
                style={tw`${
                  selected === 2 ? 'text-title' : 'text-subT'
                } text-sm font-RoboMedium`}>
                {/* Recensioni */}
                Reviews
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={tw`${selected === 3 ? 'border-b border-b-primary' : ''}`}
              onPress={() => setSelected(3)}>
              <Text
                style={tw`${
                  selected === 3 ? 'text-title' : 'text-subT'
                } text-sm font-RoboMedium`}>
                Informazioni sulla carta
              </Text>
            </TouchableOpacity> */}
          </View>

          <View style={tw`mt-3`}>
            {selected === 1 && <Wardrobe navigation={navigation} />}
            {selected === 2 && <Reviews />}
            {/* {selected === 3 && <CardInformation />} */}
          </View>
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" backgroundColor={'#4964C6'} translucent={false} />
    </View>
  );
};

export default Profile;
