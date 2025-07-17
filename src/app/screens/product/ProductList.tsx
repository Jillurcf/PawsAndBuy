// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {SvgXml} from 'react-native-svg';
// import {
//   IconBack,
//   IconSearch,
//   IconStrokeHeart,
//   IconVerified,
// } from '../../assets/icons/Icons';
// import tw from '../../lib/tailwind';
// import InputText from '../../components/InputText';
// import {useGetHomeRecommendedQuery, useGetHomeSearchQuery} from '../../redux/api/apiSlice/apiSlice';

// const ProductList = ({navigation, route}: any) => {
//   const [searchItem, setSearchItem] = useState()
//   const {title, from} = route?.params || {};
//   const [currentPage, setCurrentPage] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   console.log('p_________', products);
//   const {data, isLoading, isFetching} = useGetHomeRecommendedQuery(
//     currentPage,
//     {
//       skip: false,
//     },
//   );
//   const {data:product} = useGetHomeSearchQuery(searchItem)
//   console.log('data+++++++++++', product);
//   // Initialize products with the first page data
//   const dataCollection = data?.data?.data || [];
//   const filterDataCollection = products.filter((item) => 
//   item?.title.toLowerCase().includes(searchItem.toLowerCase())
//   )
//   console.log("41", filterDataCollection)
//   useEffect(() => {
//     if (data?.data?.data && currentPage === 1) {
//       setProducts(data.data.data);
//       setHasMore(!!data.data.next_page_url);
//     } else if (data?.data?.data && currentPage > 1) {
//       setProducts(prevProducts => [...prevProducts, ...data.data.data]);
//       setHasMore(!!data.data.next_page_url);
//     }
//   }, [data]);

//   const loadMore = () => {
//     if (!isFetching && hasMore) {
//       setCurrentPage(prevPage => prevPage + 1);
//     }
//   };

//   const handleProductDetails = async (id) => {
//     console.log(id);

//     navigation?.navigate('ProductDetails', {id});
//   };

//   const renderItem = ({item}) => (
//     <TouchableOpacity
//       style={tw`w-[49%] rounded-xl mb-2 bg-primary100 p-2`}
//       onPress={() => handleProductDetails(item?.id)}>
//       {/* onPress={() => navigation?.navigate('ProductDetails', {item?.id}, { from })}
//        */}
//       <Image
//         source={{uri: item?.images[0]}}
//         style={tw`h-38 w-full rounded-xl`}
//       />
//       <TouchableOpacity style={tw`absolute top-5 right-5`}>
//         <Image
//           source={{uri: item?.user?.avatar}}
//           style={tw`h-6 w-6 rounded-full`}
//         />
//       </TouchableOpacity>
//       <View>
//         <View style={tw`flex-row justify-between mt-1`}>
//           <Text
//             numberOfLines={1}
//             style={tw`flex-1 text-title text-sm font-RoboBold`}>
//             {item?.title}
//           </Text>
//           <SvgXml xml={IconStrokeHeart} />
//         </View>
//         <View style={tw`flex-row justify-between mt-1`}>
//           <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
//             Condizione
//           </Text>
//           <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
//             {item?.condition}
//           </Text>
//         </View>
//         <View style={tw`flex-row justify-between mt-1`}>
//           <Text style={tw`text-title text-xs font-RoboNormal`}>
//             €{item?.price}
//           </Text>
//           <View style={tw`flex-row items-center gap-1`}>
//             <Text style={tw`text-title text-xs font-RoboBold`}>
//               €
//               {item?.buyer_protection_fee || 0}
//             </Text>
//             <SvgXml xml={IconVerified} />
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={tw`h-full bg-white px-[4%] pb-4`}>
//       <TouchableOpacity
//         style={tw`mt-4 flex-row items-center gap-2`}
//         onPress={() => navigation?.goBack()}>
//         <SvgXml xml={IconBack} />
//         <Text style={tw`text-title text-base font-RoboMedium`}>
//           {title || 'ProductList'}
//         </Text>
//       </TouchableOpacity>

//       <View style={tw`mt-3`}>
//         <InputText 
//         value={searchItem}
//         onChangeText={(value)=> setCurrentPage(value)}
//         placeholder="Ricerca" iconLeft={IconSearch} />
//       </View>

//       {isLoading && products.length === 0 ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <FlatList
//           data={products}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => index.toString()}
//           numColumns={2}
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={
//             isFetching && <ActivityIndicator size="large" color="#0000ff" />
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// export default ProductList;
import { IconBack, IconVerified } from '@/src/assets/icons/Icons';
import InputText from '@/src/components/InputText';
import tw from '@/src/lib/tailwind';
import { useGetHomeRecommendedCollectionQuery } from '@/src/redux/api/apiSlice/apiSlice';
import { router } from 'expo-router';
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



const ProductList = ({navigation, route}: any) => {
  const [searchItem, setSearchItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const {title} = route?.params || {};

  // Fetch data using useGetHomeSellerCollectionQuery
  const { data, isLoading, isError, isFetching, refetch } = useGetHomeRecommendedCollectionQuery({
    per_page: 20,
    type: 'recommended',
    page: currentPage,
    search: searchTerm,
  });
  const handleSearchChange = (text) => {
    setSearchTerm(text);
    refetch(); // Refetch the query when search term changes
  };
  // Update products on data change
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
      // Show all products when searchItem is empty
      setFilteredProducts(products);
      return;
    }
console.log("Product==========",products)
    const filtered = products.filter((item) =>
      (item?.title || '') // Ensure title exists
        .toLowerCase()
        .includes(searchItem.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchItem, products]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleProductDetails = (id) => {
  router.push({
    pathname: '/screens/productDetails/ProductDetails',
    params: { id, from: 'sellOrders' },
  });
};


  const renderItem = ({item}) => (
    <TouchableOpacity
      style={tw`w-[49%] rounded-xl mr-2 mb-2 bg-primary100 p-2`}
      onPress={() => handleProductDetails(item?.id)}>
      {item?.images && <Image
        source={{uri: item?.images?.[0]}}
        style={tw`h-38 w-full rounded-xl`}
      />}
      <TouchableOpacity style={tw`absolute top-5 right-5`}>
       {item?.user?.avatar && <Image
          source={{uri: item?.user?.avatar}}
          style={tw`h-6 w-6 rounded-full`}
        />}
          {/* <SvgXml width={30} height={30} style={tw`absolute top-24 right-0`} xml={IconStrokeHeart} /> */}
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
            {/* Condizione */}
            Condition
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
              €
              {item?.price_with_buyer_protection_fee || 0}
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
        value={searchTerm}
        onChangeText={handleSearchChange}
      />
      </View>

      {isLoading && products.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
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

export default ProductList;
