
import { IconBack, IconSearch } from '@/src/assets/icons/Icons';
import InputText from '@/src/components/InputText';
import MyOrderReview from '@/src/components/MyOrderReview';
import tw from '@/src/lib/tailwind';
import { useGetMyOrderQuery, usePostCreateRatingsMutation } from '@/src/redux/api/apiSlice/apiSlice';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SvgXml } from 'react-native-svg';



const MyOrder = ({navigation, route}: any) => {
  const [searchItem, setSearchItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [postCreateRatings] = usePostCreateRatingsMutation();

  const {title} = route?.params || {};

  // Fetch data using useGetMyOrderQuery
  const {data, isLoading, isFetching} = useGetMyOrderQuery({
    per_page: 20,
    page: currentPage,
  });
  console.log("++++++++++", data?.data?.data);
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

  // Filter products based on search input
  useEffect(() => {
    if (!searchItem.trim()) {
      setFilteredProducts(products); // Show all products when searchItem is empty
      return;
    }
    const filtered = products.filter(item =>
      (item?.product?.title || '')
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
    navigation?.navigate('ProductDetails', {id});
    console.log('221', id);
  };
  const [ratings, setRatings] = useState(0);
  console.log(ratings)
  const [review, setReview] = useState();
  const handleRatingChange = (newRating) => {
    setRatings(Math.round(newRating)); // Update with only the latest integer value
  };

  const handleSubmitReview = async (item) => {
    console.log("item", item?.product_id)
    console.log("item1", item?.seller_id)
    console.log("click")
    try{
        const formData = new FormData()
    formData.append("rating", ratings)
    formData.append("review", review)
    formData.append("products_id", item?.product_id )
    formData.append("seller_id", item?.seller_id )
    console.log("formData++++++++++", formData)
    const res = await postCreateRatings(formData).unwrap()
    console.log("254", res)
    }catch(error) {
        console.log(error)
    }    
  }

  
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ....</Text>
      </View>
    );
  }
  return (
    <View style={tw`h-full bg-white px-[4%] pb-4`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2`}
        onPress={() => navigation?.goBack()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          {/* {title || 'Seller Collection'} */}
          My orders
        </Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={tw`mt-3`}>
        <InputText
          value={searchItem}
          onChangeText={value => setSearchItem(value)}
          placeholder="Search"
          // placeholder="Ricerca"
          iconLeft={IconSearch}
        />
      </View>

      {isLoading && products.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredProducts}
          // renderItem={renderItem}
          renderItem={({ item }) => <MyOrderReview item={item} />}
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

export default MyOrder;
