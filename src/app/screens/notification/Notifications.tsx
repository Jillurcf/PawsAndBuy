import { IconBack } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { useGetMarkSingleNotificationsQuery, useGetNotificationsQuery, useLazyGetMarkAllleNotificationsQuery } from '@/src/redux/api/apiSlice/apiSlice';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';






const Notifications = ({navigation}: any) => {
  const [singleMarkId  ,setSingleMarkId] = useState();
const {data, isLoading, isError, refetch} = useGetNotificationsQuery([]);
const {data:singleMarkedNotification, } = useGetMarkSingleNotificationsQuery(singleMarkId)
const [MarkedAll] = useLazyGetMarkAllleNotificationsQuery()
// console.log("notificaiton", data?.data)
 
  // console.log("19", singleMarkId)
const handleReadAndApproved = (item) => {
 try{
  setSingleMarkId(item?.id)
  console.log("click++++++++++++++++++++++++++++++")
  console.log("item", item?.data?.offer_id)
    console.log("product id", item?.data?.product_id)
 if(item?.data?.type === "pending"){
  navigation?.navigate('ApprovedProduct', {id:item?.data?.product_id, offer_id:item?.data?.offer_id});
 }else if(item?.data?.type === "buy"){
  navigation?.navigate('SellOrder');
 
 }else if(item?.data?.type !== "pending"){
  navigation?.navigate('AcceptedOfferPage', {id:item?.data?.product_id, offer_id:item?.data?.offer_id});
 }
 }catch(error){
console.log(error)
 }
  refetch( )
}

const handleAllMarkedNotification = () => {
  
  MarkedAll({}).then(res => {
    console.log(res)
  })
}

return (
    <View style={tw`h-full bg-white px-[4%]`}>
      <View
        style={tw`flex-row mt-6 items-center justify-between py-3
      `}>
        <TouchableOpacity
          style={tw`flex-row items-center gap-2`}
          onPress={() => router?.back()}>
          <SvgXml xml={IconBack} />
          <Text style={tw`text-title text-base font-RoboMedium`}>
            {/* Notifiche */}
            Notification
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAllMarkedNotification}>
          
          <Text style={tw`text-primary font-RoboMedium`}>
            {/* Segna come letto */}
            Mark as read
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={tw`pb-4 mt-6 gap-y-3`}>
        {data?.data?.map((item: any, index: number) => (
          <TouchableOpacity
          
            style={tw`flex-row items-center gap-2 ${
              item?.read_at === null ? 'bg-primary200' : 'bg-primary100'
            }  p-2 rounded-xl`}
            key={index}
            onPress={() => handleReadAndApproved(item)}>
            {/* onPress={() => {
              // navigation?.navigate('ProductDetails', {from: 'admin'});
              navigation?.navigate('ApprovedProduct');
            }}> */}
            <View style={tw`h-12 w-12 rounded-full`}>
              <Image
                source={{uri : item?.data?.image}}
                style={tw`w-12 h-12 rounded-full`}
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-title text-base font-RoboMedium`}>
                {item?.data?.title}
              </Text>
              <Text style={tw`text-subT text-xs font-RoboMedium`}>
                {item?.created_at.slice(0,10)}
              </Text>
            </View>
            <View
              style={tw`h-1.5 w-1.5 ${
                item?.isRead ? 'bg-danger' : ''
              } rounded-full`}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notifications;
