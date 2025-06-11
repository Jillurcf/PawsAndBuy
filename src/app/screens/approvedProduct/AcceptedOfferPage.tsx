import { IconBack, IconVerified } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { useGetAcceptOrRejectQuery, useGetOfferPirzeQuery, usePsotAcceptRejectOfferMutation } from '@/src/redux/api/apiSlice/apiSlice';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SvgXml } from 'react-native-svg';


const AcceptedOfferPage = ({navigation, route}: any) => {
  const {from, id, offer_id} = route?.params || {};
  const images = [
    require('../../../assets/images/food-1.png'),
    require('../../../assets/images/food-2.png'),
    require('../../../assets/images/food-3.png'),
    require('../../../assets/images/food-4.png'),
    require('../../../assets/images/food-1.png'),
    require('../../../assets/images/food-2.png'),
    require('../../../assets/images/food-3.png'),
    require('../../../assets/images/food-4.png'),
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [acceptOfferModalVisible, setAcceptOfferModalVisible] = useState(false);
  const {data, isLoading, isError, refetch} =
    useGetAcceptOrRejectQuery(offer_id);
  const {data: offoerPrize} = useGetOfferPirzeQuery(offer_id);
  
  const [psotAcceptRejectOffer] = usePsotAcceptRejectOfferMutation();
  console.log('43', data?.data?.final_price);
  // console.log('approve offer', data?.data?.images[0]);
  // console.log('29', id);
  console.log('32', offoerPrize?.data);
const final_price = data?.data?.final_price
console.log("final Price", final_price)
  // Function to handle image click
  // const handleImageClick = (index: number) => {
  //   setSelectedImageIndex(index);
  // };

  console.log('checking the data: ', from);
  
  return (
    <View style={tw`h-full bg-white px-[4%]`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2 pb-2`}
        onPress={() => navigation?.goBack()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          {/* Cibo per cani */}
          dog food
        </Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={tw`pb-4`}>
        <View>
          <View style={tw`bg-primary100 p-3 rounded-xl mt-4`}>
            {data?.data?.images && (
              <Image
                source={{uri: data?.data?.images[0]}}
                style={tw`w-full rounded-xl h-56`}
              />
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`mt-4`}>
              {data?.data?.images.map((d, index) => (
                <TouchableOpacity
                  key={index}
                  // onPress={() => handleImageClick(index)}
                >
                  {data?.data?.images && (
                    <Image
                      source={{uri: d}}
                      style={tw`w-20 h-20 rounded-xl mr-2`}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={tw`mt-3`}>
            <Text style={tw`text-title text-base font-RoboBold`}>
              {data?.data?.title}
            </Text>
            <Text style={tw`text-subT text-sm font-RoboNormal`}>
              {data?.data?.description}
            </Text>
            <View style={tw`mt-4 gap-y-2`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Marca:{' '} */}
                  Brand: 
                </Text>
                <Text style={tw`text-title text-sm font-RoboBold`}>
                  {data?.data?.brand}
                </Text>
              </View>

              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Condizione:{' '} */}
                  Condition: 
                </Text>
                <Text style={tw`text-title text-sm font-RoboBold`}>
                  {data?.data?.condition}
                </Text>
              </View>

              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Posizione:{' '} */}
                  Position:
                </Text>
                <Text style={tw`text-title text-sm font-RoboBold`}>
                  {data?.data?.user?.address}
                </Text>
              </View>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Prezzo:{' '} */}
                  Price: 
                </Text>
                <View style={tw`flex-row items-center gap-2`}>
                  <Text style={tw`text-subT text-xs font-RoboBold`}>
                    €{data?.data?.price}
                  </Text>
                  <View style={tw`flex-row items-center gap-1`}>
                    <Text style={tw`text-title text-sm font-RoboBold`}>
                      €{data?.data?.price_with_buyer_protection_fee}
                    </Text>
                    <SvgXml xml={IconVerified} />
                  </View>
                </View>
              </View>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Prezzo accettato */}
                  Asking price:
                </Text>
                <View style={tw`flex-row items-center gap-2`}>
                  <Text
                    style={tw`text-subT text-xl text-yellow-500 font-RoboBold`}>
                    €{data?.data?.final_price}
                  </Text>
                </View>
              </View>
            </View>
            {/* {offoerPrize?.data?.status &&
              offoerPrize?.data?.status === 'pending' ? (
                <View style={tw`mt-2 gap-y-2`}>
                  <Button
                    title="Approve"
                    onPress={handleApporve}
                    // onPress={() => setIsPriceModalVisible(false)}
                  />
                  <Button
                    title="Cancel"
                    containerStyle={tw`bg-transparent border border-primary`}
                    style={tw`text-primary`}
                    // onPress={() => setIsPriceModalVisible(false)}
                    onPress={handleCancel}
                  />
                </View>
              ) : offoerPrize?.data?.status === 'accept' ? ( */}

            {data?.data?.offer_buying_status === 0 &&
            data?.data?.offer_status === 'accept' ? (
              <Button
                title="Buy now"
                onPress={() => navigation?.navigate('Payment', {id, from: "buyer", final_price})}
              />
            ) : (
              ''
            )}

            {/* ) : null} */}
          </View>
          <NormalModal
            layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
            containerStyle={tw`rounded-xl bg-white p-5`}
            visible={isPriceModalVisible}
            setVisible={setIsPriceModalVisible}>
            <View>
              <Text style={tw`text-title text-sm font-RoboBold mb-2`}>
                {/* Offer Prezzo */}
                Offer price:
              </Text>
              <InputText
                placeholder={'Enter your offer price'}
                keyboardType={'number-pad'}
              />

              <View style={tw`mt-2 gap-y-2`}>
                <Button
                  title="Send"
                  onPress={() => setIsPriceModalVisible(false)}
                />
                <Button
                  title="Cancel"
                  containerStyle={tw`bg-transparent border border-primary`}
                  style={tw`text-primary`}
                  onPress={() => setIsPriceModalVisible(false)}
                />
              </View>
            </View>
          </NormalModal>

          <NormalModal
            layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
            containerStyle={tw`rounded-xl bg-white p-5`}
            visible={acceptOfferModalVisible}
            setVisible={setAcceptOfferModalVisible}>
            <View>
              <Text
                style={tw`text-title text-2xl text-center font-RoboBold mb-2`}>
                Are you sure you want to accept this offer
              </Text>

              <View style={tw`mt-2 gap-y-2`}>
                <Button
                  title="Accept"
                  onPress={() => {
                    setIsPriceModalVisible(false);
                  }}
                />
                <Button
                  title="Cancel"
                  containerStyle={tw`bg-transparent border border-primary`}
                  style={tw`text-primary`}
                  onPress={() => {
                    setIsPriceModalVisible(false);
                  }}
                />
              </View>
            </View>
          </NormalModal>
        </View>
      </ScrollView>
    </View>
  );
};

export default AcceptedOfferPage;
