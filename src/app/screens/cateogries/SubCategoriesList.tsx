import { IconBack, IconVerified } from '@/src/assets/icons/Icons';
import InputText from '@/src/components/InputText';
import tw from '@/src/lib/tailwind';
import { useGetSubCategoryListQuery } from '@/src/redux/api/apiSlice/apiSlice';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';


const SubCategoriesList = ({navigation, route}: any) => {
  const [searchItem, setSearchItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const {title, sub_category_id} = useLocalSearchParams();

  // Fetch data using useGetSubCategoryListQuery
  const {data, isLoading, isError, isFetching, refetch} =
    useGetSubCategoryListQuery(sub_category_id);

  useEffect(() => {
    if (data?.data?.data && currentPage === 1) {
      setProducts(data.data.data);
      setFilteredProducts(data.data.data); // Initialize filtered products
      setHasMore(!!data.data.next_page_url);
    } else if (data?.data?.data && currentPage > 1) {
      const newProducts = [...products, ...data.data.data];
      setProducts(newProducts);
      setFilteredProducts(newProducts); // Update filtered products
      setHasMore(!!data.data.next_page_url);
    }
  }, [data]);

  // Handle search input change
  const handleSearchChange = text => {
    setSearchItem(text);
  };

  // Filter products based on search input
  useEffect(() => {
    if (!searchItem.trim()) {
      setFilteredProducts(products); // Show all products when search input is empty
      return;
    }

    const filtered = products.filter(item =>
      (item?.title || '')
        .toLowerCase()
        .includes(searchItem.toLowerCase()),
    );

    setFilteredProducts(filtered);
  }, [searchItem, products]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleProductDetails = id => {
    router.push({pathname: '/screens/productDetails/ProductDetails', params: {id:id, from: 'sellOrders'}});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={tw`w-[49%] rounded-xl mb-2 mr-2 bg-primary100 p-2`}
      onPress={() => handleProductDetails(item?.id)}>
      {item?.images && (
        <Image
          source={{uri: item?.images?.[0]}}
          style={tw`h-38 w-full rounded-xl`}
        />
      )}
      <TouchableOpacity style={tw`absolute top-5 right-5`}>
        {item?.user?.avatar && (
          <Image
            source={{uri: item?.user?.avatar}}
            style={tw`h-6 w-6 rounded-full`}
          />
        )}
      </TouchableOpacity>
      <View>
        <View style={tw`flex-row justify-between mt-1`}>
          <Text
            numberOfLines={1}
            style={tw`flex-1 text-title text-sm font-RoboBold`}>
            {item?.title}
          </Text>
        </View>
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
            Condizione
          </Text>
          <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
            {item?.condition}
          </Text>
        </View>
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={tw`text-title text-xs font-RoboNormal`}>
            €{item?.price}
          </Text>
          <View style={tw`flex-row items-center gap-1`}>
            <Text style={tw`text-title text-xs font-RoboBold`}>
              €{item?.price_with_buyer_protection_fee || 0}
            </Text>
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
    <View style={tw`h-full bg-white px-[4%] pb-4`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2`}
        onPress={() => router.back()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          {title || 'Recommended for your'}
        </Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={tw`mt-3`}>
        <InputText
          style={tw``}
          placeholder="Search..."
          value={searchItem}
          onChangeText={handleSearchChange}
        />
      </View>

      {filteredProducts.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>No products found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts} // Use filtered products
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

export default SubCategoriesList;
