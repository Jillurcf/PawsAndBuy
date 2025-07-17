import { IconBack, IconVerified } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { useGetWishListQuery, usePostCreateRatingsMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SvgXml } from 'react-native-svg';


const WishList = ({navigation, route}: any) => {
  const [searchItem, setSearchItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [postCreateRatings] = usePostCreateRatingsMutation();

  const {title, from} = route?.params || {};

  // Fetch data using useGetMyOrderQuery
  const {data, isLoading, isFetching} = useGetWishListQuery({});
  // console.log('++++++++++', data?.data?.data[1]?.images);
  // useEffect(() => {
  //   if (data?.data?.data && currentPage === 1) {
  //     setProducts(data.data.data);
  //     setFilteredProducts(data.data.data); // Initialize filtered products
  //     setHasMore(!!data.data.next_page_url);
  //   } else if (data?.data?.data && currentPage > 1) {
  //     const newProducts = [...products, ...data.data.data];
  //     setProducts(newProducts);
  //     setFilteredProducts(newProducts); // Update filtered products
  //     setHasMore(!!data.data.next_page_url);
  //   }
  // }, [data]);

  // Filter products based on search input

  const handleProductDetails = id => {
    router.push({pathname: '/screens/productDetails/ProductDetails', params: {id, from: 'wishList'}});
    console.log('221', id);
  };
  const [ratings, setRatings] = useState(0);
  console.log(ratings);
  const [review, setReview] = useState();
  const handleRatingChange = newRating => {
    setRatings(Math.round(newRating)); // Update with only the latest integer value
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ....</Text>
      </View>
    );
  }
  return (
    <View style={tw`flex-1 bg-white px-[4%] pb-4`}>
      <TouchableOpacity
        style={tw`mt-8 flex-row items-center gap-2`}
        onPress={() => router?.back()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          {/* {title || 'Seller Collection'} */}
          Wishlist
        </Text>
      </TouchableOpacity>

      {/* Search Bar */}
      {/* <View style={tw`mt-3`}>
          <InputText
            value={searchItem}
            onChangeText={value => setSearchItem(value)}
            placeholder="Ricerca"
            iconLeft={IconSearch}
          />
        </View> */}

      {isLoading && products.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={tw`flex-1 mb-4`}>
          <FlatList
          data={data?.data?.data}
          // renderItem={renderItem}
          renderItem={({item}) => {
            console.log("item",item)
            return (
             
                <ScrollView
                  style={tw` w-[50%] p-2 `}>
                  <TouchableOpacity
                    style={tw`w-[100%] rounded-xl p-4 bg-primary100`}
                    //   key={index}
                    onPress={() => handleProductDetails(item?.id)}>
                    {item?.images && (
                      <Image
                        source={{uri: item?.images?.[0]}}
                        style={tw`w-full h-90%] rounded-xl`}
                      />
                    )}
                    <View>
                      <Text
                        numberOfLines={1}
                        style={tw`text-title text-sm font-RoboBold mt-1`}>
                        {item?.title}
                      </Text>

                      <View style={tw`flex-row justify-between mt-1`}>
                        <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
                          {/* Condizione */}
                          Condition
                        </Text>
                        <Text
                          style={tw`text-primary text-[10px] font-RoboNormal`}>
                          {item?.condition}
                        </Text>
                      </View>

                      <View style={tw`flex-row justify-between`}>
                        <Text
                          style={tw`text-subT text-xs font-RoboNormal mt-1`}>
                          €{item?.price}
                        </Text>
                        <Text style={tw`text-subT text-xs font-RoboBold mt-1`}>
                          €{item?.price_with_buyer_protection_fee}
                          <Text>
                            <SvgXml xml={IconVerified} />
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      // onPress={handleFavorite}
                      style={tw`absolute top-5 right-5`}>
                      {item?.user?.avatar && (
                        <Image
                          source={{uri: item?.user?.avatar || ''}}
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
                </ScrollView>
         
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          // onEndReached={loadMore}
          // onEndReachedThreshold={0.5}
          // ListFooterComponent={
          //   isFetching && <ActivityIndicator size="large" color="#0000ff" />
          // }
          showsVerticalScrollIndicator={false}
        />
        </View>
      )}
      <StatusBar translucent={false} />
    </View>
  );
};

export default WishList;
