
import { IconBack } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { useGetSellOrderQuery } from '@/src/redux/api/apiSlice/apiSlice';
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


const SellOrder = ({navigation, route}: any) => {
    const [searchItem, setSearchItem] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const {title} = route?.params || {};

    // Fetch data using useGetMyOrderQuery
    const {data, isLoading, isFetching} = useGetSellOrderQuery({
        per_page: 20,
        page: currentPage,
    });

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
        const filtered = products.filter((item) =>
            (item?.product?.title || '').toLowerCase().includes(searchItem.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchItem, products]);

    const loadMore = () => {
        if (!isFetching && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handleProductDetails = (id) => {
        navigation?.navigate('OrderProductDetails', {id});
    };

    const renderItem = ({item}) => (
        <TouchableOpacity
            style={tw`w-[49%] rounded-xl mb-2 mr-2 bg-primary100 p-2`}
            onPress={() => handleProductDetails(item?.id)}>
                {item?.product?.images &&
                <Image
                source={{uri: item?.product?.images[0]}}
                style={tw`h-38 w-full rounded-xl`}
            />
                }
            
            <TouchableOpacity style={tw`absolute top-5 right-5`}>
               {item?.seller?.avatar && 
                <Image
                source={{uri: item?.seller?.avatar}}
                style={tw`h-6 w-6 rounded-full`}
            />
               }
            </TouchableOpacity>
            <View>
                <View style={tw`flex-row justify-between mt-1`}>
                    <Text
                        numberOfLines={1}
                        style={tw`flex-1 text-title text-sm font-RoboBold`}>
                        {item?.product?.title || 'No Title'}
                    </Text>
                    {/* <SvgXml xml={IconStrokeHeart} /> */}
                </View>
                <View style={tw`flex-row justify-between mt-1`}>
                    <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
                        {/* Condizione */}
                        Condition
                    </Text>
                    <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
                        {item?.product?.condition || 'Unknown'}
                    </Text>
                </View>
                <View style={tw`flex-row justify-between mt-1`}>
                    <Text style={tw`text-title text-xs font-RoboNormal`}>
                        €{item?.product?.price || '0.00'}
                    </Text>
                    <View style={tw`flex-row items-center gap-1`}>
                        <Text style={tw`text-title text-xs font-RoboBold`}>
                            €{item?.buyer_protection_fee || '0.00'}
                        </Text>
                        {/* <SvgXml xml={IconVerified} /> */}
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
        <View style={tw`h-full bg-white px-[4%] pb-4`}>
            <TouchableOpacity
                style={tw`mt-4 flex-row items-center gap-2`}
                onPress={() =>router?.back()}>
                <SvgXml xml={IconBack} />
                <Text style={tw`text-title text-base font-RoboMedium my-4`}>
                    {/* {title || 'Seller Collection'} */}
                    Sell orders
                </Text>
            </TouchableOpacity>

            {/* Search Bar */}
            {/* <View style={tw`mt-3`}>
                <InputText
                    value={searchItem}
                    onChangeText={(value) => setSearchItem(value)}
                    placeholder="Ricerca"
                    iconLeft={IconSearch}
                />
            </View> */}

            {isLoading && products.length === 0 ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredProducts}
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

export default SellOrder;
