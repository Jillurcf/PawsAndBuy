import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import Swiper from 'react-native-swiper';


import { IconSearch, IconVerified } from '@/src/assets/icons/Icons';
import Header from '../../../components/Header';
import InputText from '../../../components/InputText';
import { NavigProps } from '../../../interface/NaviProps';
import tw from '../../../lib/tailwind';
import {
  useGetHomeRecommendedQuery,
  useGetHomeSearchQuery,
  useGetHomeSellerCollectionQuery,
  useGetHomeSliderQuery,
} from '../../../redux/api/apiSlice/apiSlice';

// const Home = ({navigation}: NavigProps<null>) => {
//   const [searchItem, setSearchItem] = useState();
//   const {data, isLoading, isError} = useGetHomeSliderQuery();
//   const {data: recommended} = useGetHomeRecommendedQuery();
//   const {data: sellerCollection} = useGetHomeSellerCollectionQuery();
//   const {data: search} = useGetHomeSearchQuery(searchItem);
//   console.log('s', search);
//   console.log('27 sc', sellerCollection?.data?.data?.[0]?.title);
//   console.log('searchItem', searchItem);
//   const productList = recommended?.data?.data || [];
//   // console.log('ProductList', productList);

//   const sellerProducts = sellerCollection?.data?.data || [];
//   const filteredRecommended = productList.filter((item) =>
//     item?.title?.toLowerCase().includes(searchItem.toLowerCase())
//   );

//   const filteredSellerProducts = sellerProducts.filter((item) =>
//     item?.title?.toLowerCase().includes(searchItem.toLowerCase())
//   );

//   const handleProductDetails = async id => {
//     console.log(id);

//     navigation?.navigate('ProductDetails', {id});
//   };
//   const handleSellerProductDetails = async id => {
//     console.log(id);

//     navigation?.navigate('ProductDetails', {id});
//   };

//   return (
//     <View style={tw`h-full bg-white px-[4%] pb-4`}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="always">
//         <Header navigation={navigation} />

//         {/* search bar */}
//         <View style={tw`mt-3`}>
//           <InputText
//             value={searchItem}
//             onChangeText={value => setSearchItem(value)}
//             placeholder="Ricerca"
//             iconLeft={IconSearch}
//           />
//         </View>
//         {/* banner start from here */}
//         <View style={tw`h-40 rounded-xl overflow-hidden`}>
//           <Swiper
//             dot={<View style={tw`bg-white w-1.5 h-1.5 rounded-full mx-1`} />}
//             activeDot={
//               <View style={tw`bg-white w-4 h-1.5 rounded-full mx-1`} />
//             }
//             paginationStyle={tw`bottom-2`}
//             autoplay={true}
//             loop={true}>
//             {/* <View
//               style={tw`justify-center items-center rounded-lg bg-primary`}
//               testID="Hello">
//               <Image
//                 source={require('../../assets/images/slide-1.png')}
//                 style={tw`w-full`}
//               />
//             </View> */}

//             {/* <View
//               style={tw`justify-center items-center bg-red-200`}
//               testID="Hello">
//               <Image
//                 source={require('../../assets/images/slide-1.png')}
//                 style={tw`w-full`}
//               />
//             </View> */}
//             {Array.isArray(data?.data?.data) &&
//               data?.data?.data.map((d, idx) => {
//                 return (
//                   <View
//                     key={idx}
//                     style={tw`justify-center items-center bg-red-200`}>
//                     {/* Image rendering with height defined */}
//                     <Image
//                       source={{uri: d?.image}}
//                       style={tw`w-full h-40`} // Ensure you have a height (adjust 'h-40' as needed)
//                       resizeMode="cover"
//                       onError={e => console.log('Image failed to load', e)} // Add error handling for debugging
//                     />
//                   </View>
//                 );
//               })}
//           </Swiper>
//         </View>

//         {/* Body start from here */}

//         <View>
//           <View style={tw`flex-row items-center justify-between my-2`}>
//             <Text style={tw`text-title text-base font-RoboMedium`}>
//               Consigliato per te
//             </Text>
//             <TouchableOpacity
//               // onPress={() =>
//               //   navigation?.navigate('ProductList', {
//               //     products: [...Array(10)],
//               //     title: 'Consigliato per te',
//               //   })
//               // }
//               onPress={() => navigation?.navigate('SellerProductList')}>
//               <Text style={tw`text-primary text-xs font-RoboMedium`}>
//                 Vedi tutto
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={tw`flex-row items-center flex-wrap justify-between`}>
//             {filteredRecommended?.data?.data.slice(0, 4).map((recomend, index) => {
//               console.log('id+++', recomend?.id);
//               return (
//                 <TouchableOpacity
//                   style={tw`w-[49%] rounded-xl mb-2 bg-primary100 p-2`}
//                   key={index}
//                   onPress={() => handleProductDetails(recomend?.id)}
//                   // onPress={() =>
//                   //   navigation?.navigate('ProductDetails', {recomend})
//                   // }
//                 >
//                   <Image
//                     source={{uri: recomend?.images[0]}}
//                     style={tw`h-38 w-full rounded-xl`}
//                   />
//                   <TouchableOpacity style={tw`absolute top-5 right-5`}>
//                     <Image
//                       // source={{uri:recomend?.images[0]}}
//                       source={{uri: recomend?.user?.avatar}}
//                       style={tw`h-6 w-6 rounded-full`}
//                     />
//                   </TouchableOpacity>
//                   <View>
//                     <View style={tw`flex-row justify-between mt-1`}>
//                       <Text
//                         numberOfLines={1}
//                         style={tw`text-title text-sm font-RoboBold flex-1`}>
//                         {recomend?.title}
//                       </Text>
//                       <SvgXml xml={IconStrokeHeart} />
//                     </View>
//                     <View style={tw`flex-row justify-between mt-1`}>
//                       <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
//                         Condizione
//                       </Text>
//                       <Text
//                         style={tw`text-primary text-[10px] font-RoboNormal`}>
//                         {recomend?.condition}
//                       </Text>
//                     </View>
//                     <View style={tw`flex-row justify-between mt-1`}>
//                       <Text style={tw`text-title text-xs font-RoboNormal`}>
//                         €{recomend?.price}
//                       </Text>
//                       <View style={tw`flex-row items-center gap-1`}>
//                         <Text style={tw`text-title text-xs font-RoboBold`}>
//                           <Text style={tw`text-title text-xs font-RoboNormal`}>
//                             €{recomend?.price_with_buyer_protection_fee || 0}
//                           </Text>
//                         </Text>
//                         <SvgXml xml={IconVerified} />
//                       </View>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         <View>
//           <View style={tw`flex-row items-center justify-between my-2`}>
//             <Text style={tw`text-title text-base font-RoboMedium`}>
//               Ritiro dal venditore
//             </Text>
//             <TouchableOpacity
//               onPress={() => navigation?.navigate('ProductList')}>
//               <Text style={tw`text-primary text-xs font-RoboMedium`}>
//                 Vedi tutto
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={tw`flex-row items-center flex-wrap justify-between`}>
//             {filteredSellerProducts?.data?.data?.slice(0, 4).map((d, index) => (
//               <TouchableOpacity
//                 style={tw`w-[49%] rounded-xl mb-2 bg-primary100 p-2`}
//                 key={index}
//                 onPress={() => handleSellerProductDetails(d?.id)}>
//                 <Image
//                   source={{uri: d?.images[0]}}
//                   style={tw`h-38 w-full rounded-xl`}
//                 />
//                 <TouchableOpacity style={tw`absolute top-5 right-5`}>
//                   <Image
//                     source={{uri: d?.user?.avatar}}
//                     style={tw`h-6 w-6 rounded-full`}
//                   />
//                 </TouchableOpacity>
//                 <View>
//                   <View style={tw`flex-row justify-between mt-1`}>
//                     <Text
//                       numberOfLines={1}
//                       style={tw`flex-1 text-title text-sm font-RoboBold`}>
//                       {d?.title}
//                     </Text>
//                     <SvgXml xml={IconStrokeHeart} />
//                   </View>
//                   <View style={tw`flex-row justify-between mt-1`}>
//                     <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
//                       Condizione
//                     </Text>
//                     <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
//                       {d?.condition}
//                     </Text>
//                   </View>
//                   <View style={tw`flex-row justify-between mt-1`}>
//                     <Text style={tw`text-title text-xs font-RoboNormal`}>
//                       {d?.price}
//                     </Text>
//                     <View style={tw`flex-row items-center gap-1`}>
//                       <Text style={tw`text-title text-xs font-RoboBold`}>
//                         €{d?.price_with_buyer_protection_fee || 0}
//                       </Text>
//                       <SvgXml xml={IconVerified} />
//                     </View>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default Home;

const Home = ({navigation}: NavigProps<null>) => {
  const [searchItem, setSearchItem] = useState('');
  const {data, isLoading, isError} = useGetHomeSliderQuery({});
  const {data: recommended} = useGetHomeRecommendedQuery();
  const {data: sellerCollection} = useGetHomeSellerCollectionQuery({});
  const {data: search} = useGetHomeSearchQuery(searchItem);
  console.log('280', recommended);
  // console.log("search", search);
  // console.log('27 sc', sellerCollection?.data?.data?.[0]?.title);
  // console.log("searchItem", searchItem);

  const productList = recommended?.data?.data || [];
  const sellerProducts = sellerCollection?.data?.data || [];
  // console.log("287", sellerProducts)
  // Filter logic for recommended products and seller collection
  const filteredRecommended = productList.filter(item =>
    item?.title?.toLowerCase().includes(searchItem.toLowerCase()),
  );

  const filteredSellerProducts = sellerProducts.filter(item =>
    item?.title?.toLowerCase().includes(searchItem.toLowerCase()),
  );
  // console.log("296+++++++++++++++", filteredSellerProducts)

  // eikhane sell orders bosaia disi just, ekhon kaj kortase

  const handleProductDetails = async id => {
    // console.log("304", id)
    navigation?.navigate('ProductDetails', {id, from: 'myOrders'});
  };

  const handleSellerProductDetails = async id => {
    navigation?.navigate('ProductDetails', {id, from: 'sellOrders'});
  };
  const handleFavorite = () => {
    console.log('click');
  };

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
    <View style={tw`h-ful bg-white flex-1 px-[4%] pb-4`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <Header/>

        {/* Search Bar */}
        <View style={tw`mt-3`}>
          <InputText
            value={searchItem}
            onChangeText={value => setSearchItem(value)}
            placeholder=
            // "Ricerca"
            'Search'
            iconLeft={IconSearch}
          />
        </View>

        {/* Banner */}
        <View style={tw`h-40 rounded-xl overflow-hidden`}>
          <Swiper
            dot={<View style={tw`bg-white w-1.5 h-1.5 rounded-full mx-1`} />}
            activeDot={
              <View style={tw`bg-white w-4 h-1.5 rounded-full mx-1`} />
            }
            paginationStyle={tw`bottom-2`}
            autoplay={true}
            loop={true}>
            {Array.isArray(data?.data?.data) &&
              data?.data?.data.map((d, idx) => (
                <View
                  key={idx}
                  style={tw`justify-center items-center bg-red-200`}>
                  {d?.image && (
                    <Image
                      source={{uri: d?.image}}
                      style={tw`w-full h-40`}
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}
          </Swiper>
        </View>

        {/* Recommended Products */}
        <View>
          <View style={tw`flex-row items-center justify-between my-2`}>
            <Text style={tw`text-title text-base font-RoboMedium`}>
              {/* Consigliato per te */}
              Recommended for you.
            </Text>
            <TouchableOpacity
              onPress={() => navigation?.navigate('ProductList')}>
              <Text style={tw`text-primary text-xs font-RoboMedium`}>
                {/* Vedi tutto */}
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row items-center flex-wrap justify-between`}>
            {filteredRecommended.slice(0, 4).map((recomend, index) => (
              <TouchableOpacity
                style={tw`w-[49%] rounded-xl mb-2 bg-primary100 p-2`}
                key={index}
                onPress={() => handleProductDetails(recomend?.id)}>
                {recomend?.images && (
                  <Image
                    source={{uri: recomend?.images?.[0]}}
                    style={tw`h-38 w-full rounded-xl`}
                  />
                )}
                <View>
                  <Text
                    numberOfLines={1}
                    style={tw`text-title text-sm font-RoboBold mt-1`}>
                    {recomend?.title}
                  </Text>

                  <View style={tw`flex-row justify-between mt-1`}>
                    <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
                      {/* Condizione */}
                      Condition
                    </Text>
                    <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
                      {recomend?.condition}
                    </Text>
                  </View>

                  <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-subT text-xs font-RoboNormal mt-1`}>
                      €{recomend?.price}
                    </Text>
                    <Text style={tw`text-subT text-xs font-RoboBold mt-1`}>
                      €{recomend?.price_with_buyer_protection_fee}
                      <Text>
                        {' '}
                        <SvgXml xml={IconVerified} />
                      </Text>
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleFavorite}
                  style={tw`absolute top-5 right-5`}>
                  {recomend?.user?.avatar && (
                    <Image
                      source={{uri: recomend?.user?.avatar}}
                      style={tw`h-6 w-6 rounded-full`}
                    />
                  )}
                  {/* <SvgXml
                    width={30}
                    height={30}
                    style={tw`absolute top-24 right-0`}
                    xml={IconStrokeHeart}
                  /> */}
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seller Collection */}
        <View>
          <View style={tw`flex-row items-center justify-between my-2`}>
            <Text style={tw`text-title text-base font-RoboMedium`}>
              {/* Ritiro dal venditore */}
              Pickup from the seller.
            </Text>
            <TouchableOpacity
              onPress={() => navigation?.navigate('SellerProductList')}>
              <Text style={tw`text-primary text-xs font-RoboMedium`}>
                {/* Vedi tutto */}
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row items-center flex-wrap justify-between`}>
            {filteredSellerProducts.slice(0, 4).map((d, index) => (
              <TouchableOpacity
                style={tw`w-[49%] rounded-xl mb-2 bg-primary100 p-2`}
                key={index}
                onPress={() => handleSellerProductDetails(d?.id)}>
                {d?.images && (
                  <Image
                    source={{uri: d?.images?.[0]}}
                    style={tw`h-38 w-full rounded-xl`}
                  />
                )}

                <View>
                  <Text
                    numberOfLines={1}
                    style={tw`text-title text-sm font-RoboBold mt-1`}>
                    {d?.title}
                  </Text>
                  <View style={tw`flex-row justify-between mt-1`}>
                    <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
                      {/* Condizione */}
                      Condition
                    </Text>
                    <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
                      {d?.condition}
                    </Text>
                  </View>

                  <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-subT text-xs font-RoboNormal mt-1`}>
                      €{d?.price}
                    </Text>
                    <Text style={tw`text-subT text-xs font-RoboBold mt-1`}>
                      €{d?.price_with_buyer_protection_fee}
                      <Text>
                        <SvgXml xml={IconVerified} />
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
     <StatusBar barStyle="dark-content" backgroundColor={'#4964C6'} translucent={false} />
    </View>
  );
};

export default Home;
