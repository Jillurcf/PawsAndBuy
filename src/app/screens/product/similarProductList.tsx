import { IconBack, IconVerified } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { useGetHomeProductDetailsSimilarProductQuery } from '@/src/redux/api/apiSlice/apiSlice';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const SimilarProductList = ({navigation, route}: any) => {
  const { title, from } = route?.params || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { id } = route?.params;
  const {data:similar, isLoading, isFetching} = useGetHomeProductDetailsSimilarProductQuery(id, currentPage,{
    skip: false,
  } )
console.log("products", products?.[0]?.title)
//   const { data, isLoading, isFetching } = useGetHomeProductDetailsSimilarProductQuery(currentPage, {
//     skip: false,
//   });
console.log("data similar======================", similar?.data?.data?.id)
  // Initialize products with the first page data
  useEffect(() => {
    if (similar?.data?.data && currentPage === 1) {
      setProducts(similar.data.data);
      setHasMore(!!similar.data.next_page_url);
    } else if (similar?.data?.data && currentPage > 1) {
      setProducts((prevProducts) => [...prevProducts, ...similar.data.data]);
      setHasMore(!!similar.data.next_page_url);
    }
  }, [similar]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleProductDetails = async (id) => {
    console.log(id);

    navigation?.navigate('ProductDetails', {id});
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`w-[49%] rounded-xl mb-2 mr-2 bg-primary100 p-2`}
      onPress={() =>handleProductDetails(item?.id)}
    >
      <Image
        source={{ uri: item?.images[0] }}
        style={tw`h-38 w-full rounded-xl`}
      />
      <TouchableOpacity style={tw`absolute top-5 right-5`}>
        <Image
          source={{ uri: item?.user?.avatar }}
          style={tw`h-6 w-6 rounded-full`}
        />
      </TouchableOpacity>
      
      <View>
        <View style={tw`flex-row justify-between mt-1`}>
          <Text numberOfLines={1} style={tw`flex-1 text-title text-sm font-RoboBold `}>{item?.title}</Text>
          {/* <SvgXml xml={IconStrokeHeart} /> */}
        </View>
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={tw`text-subT text-[10px] font-RoboNormal`}>Condizione</Text>
          <Text style={tw`text-primary text-[10px] font-RoboNormal`}>{item?.condition}</Text>
        </View>
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={tw`text-title text-xs font-RoboNormal`}>€{item?.price}</Text>
          <View style={tw`flex-row items-center gap-1`}>
            <Text style={tw`text-title text-xs font-RoboBold`}>€{item?.price_with_buyer_protection_fee || 0}</Text>
            <SvgXml xml={IconVerified} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ....</Text>
      </View>
    );
  }
  return (
    <View style={tw`h-full bg-white  px-[4%] pb-4`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2`}
        onPress={() => navigation?.goBack()}
      >
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title my-4 text-base font-RoboMedium`}>
          {title || 'Similar Product'}
        </Text>
      </TouchableOpacity>

      {/* <View style={tw`mt-3`}>
        <InputText placeholder="Ricerca" iconLeft={IconSearch} />
      </View> */}

      {isLoading && products.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && <ActivityIndicator size="large" color="#0000ff" />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default SimilarProductList;