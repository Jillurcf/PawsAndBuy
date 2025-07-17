import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { IconVerified, kibupicon } from '@/src/assets/icons/Icons';
import InputText from '@/src/components/InputText';
import tw from '@/src/lib/tailwind';
import { useGetwardrobeProductListQuery, usePostDeleteProductMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { router } from 'expo-router';
import { SvgXml } from 'react-native-svg';



const Wardrobe = ({navigation}: any) => {
  const [normalModal, setNormalModal] = React.useState(false);
  const [id, setId] = React.useState();
  const [promotionModal, setPromotionModal] = React.useState(false);
  const {data, isLoading, isError} = useGetwardrobeProductListQuery(
    {}
  );
  const [postDeleteProduct] = usePostDeleteProductMutation();
  console.log('10', data?.data?.data.length);

  const handleModalOption = (option: string) => {
    console.log(`Selected option: ${option}`);
    setNormalModal(false); // Close the modal after selecting an option
  };
  console.log('productId------', id);
  const handleModalOne = id => {
    console.log('++++', id);
    setId(id);
    setNormalModal(true);
  };
  const handlePromoteProduct = () => {
    setPromotionModal(true);
    setNormalModal(false);
  };

  const handleDelete = async () => {
    console.log('click');
    try {
      const res = await postDeleteProduct(id);
      console.log(res);
      setNormalModal(false);
    } catch (error) {
      console.log(error);
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

  if (!data?.data?.data?.length) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-gray-500 text-lg`}>No products available.</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-row items-center flex-wrap justify-between`}>
      {data?.data?.data.map((d, index) => (
        <TouchableOpacity
          style={tw`w-[49%] rounded-xl mb-2 bg-primary100 p-2`}
          key={index}
          onPress={() => router.push({pathname: '/screens/productDetails/ProductDetails', params: {id: d?.id, from: 'Own Product'}})}>
          <Image
            source={{uri: d?.images[0]}}
            style={tw`h-38 w-full rounded-xl`}
          />
          <TouchableOpacity
            onPress={() => handleModalOne(d?.id)}
            style={tw`absolute top-5 right-5`}>
            <View
              style={tw`bg-[#064145] w-5 h-5 items-center justify-center rounded-full p-4  `}>
              <SvgXml xml={kibupicon} />
            </View>
          </TouchableOpacity>
          <View>
            <View style={tw`flex-row justify-between mt-1`}>
              <Text
                numberOfLines={1}
                style={tw`flex-1 text-title text-sm font-RoboBold`}>
                {d?.title}
              </Text>
              {/* <SvgXml xml={IconStrokeHeart} /> */}
            </View>
            <View style={tw`flex-row justify-between mt-1`}>
              <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
                {/* Condizione */}
                Condition: 
              </Text>
              <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
                {d?.condition}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mt-1`}>
              <Text style={tw`text-title text-xs font-RoboNormal`}>
                €{d?.price}
              </Text>
              <View style={tw`flex-row items-center gap-1`}>
                <Text style={tw`text-title text-xs font-RoboBold`}>
                  €{d?.price_with_buyer_protection_fee}
                </Text>
                <SvgXml xml={IconVerified} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <Modal
        transparent={true}
        visible={normalModal}
        animationType="slide"
        onRequestClose={() => setNormalModal(false)}>
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-5 rounded-lg w-80`}>
            <Text
              style={tw`text-lg text-[#064145] font-bold font-RoboBold mb-4`}>
              Select one
            </Text>
            <TouchableOpacity
              // onPress={handlePromoteProduct}
              onPress={() => {
                setPromotionModal(false);
                router.push({pathname: '/screens/promotion/PromotionPayment', params: {id: id}});
              }}
              style={tw`border p-3 rounded-lg mb-2`}>
              <Text style={tw`text-[#064145] text-center font-RoboBold`}>
                Promote Product
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              // onPress={() => handleModalOption('Option 2')}
              style={tw`border border-red-500 p-3 rounded-lg`}>
              <Text style={tw`text-[red] text-center font-RoboBold`}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNormalModal(false)}
              style={tw`mt-4`}>
              <Text style={tw`text-center text-red-500 font-RoboBold`}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Promotion modal */}
      <Modal
        transparent={true}
        visible={promotionModal}
        animationType="slide"
        onRequestClose={() => setPromotionModal(false)}>
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-5 rounded-lg w-80`}>
            <Text
              style={tw`text-lg text-[#064145] font-bold font-RoboBold mb-4`}>
              Promote your product
            </Text>
            <InputText
              placeholder={'Number of days you want to promote'}
              containerStyle={tw`py-0`}
              // onChangeText={(text) => setPayment((prev) => ({
              //   ...prev, state:text,
              // }))}
            />
            <View style={tw`py-4`}>
              <Text style={tw`text-black font-RoboBold`}>
                Total cost for promote:
              </Text>
              <Text style={tw`text-black font-RoboBold text-lg`}>$5895.00</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPromotionModal(false);
                navigation?.navigate('PromotionPayment', {id});
              }}
              style={tw`mt-4 bg-[#064145] rounded-md py-2`}>
              <Text style={tw`text-center text-white font-RoboBold`}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Wardrobe;
