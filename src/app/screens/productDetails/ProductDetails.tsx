import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { IconBack, IconRating, IconStrokeHeart, IconStrokeHeartFill, IconVerified } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { useGetHomeProductDetailsQuery, useGetHomeProductDetailsSimilarProductQuery, usePostSendOfferMutation, usePostWishlistMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { SvgXml } from 'react-native-svg';




const ProductDetails = ({navigation, route}: any) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [acceptOfferModalVisible, setAcceptOfferModalVisible] = useState(false);
  const [openProductEditModal, setOpenProductEditModal] = useState(false);
  const [offerValue, setOfferValue] = useState();
  // console.log('112', offerValue);
  const {from} = route?.params || {};
  console.log("from", from)
  console.log('Checking: ', route.params);
  // const data = route?.params?.recomend
  // const { id } = from; // Access the 'id' from params
  const {id} = route?.params;
  // console.log('115', id);

  const {data, isLoading, isError, refetch} = useGetHomeProductDetailsQuery(id);
  console.log('125', data?.data?.rating?.rating_user?.avatar);
  const {data: similarProduct} =
    useGetHomeProductDetailsSimilarProductQuery(id);
  const [postWishlist, wishlistResult] = usePostWishlistMutation();
  // console.log('similarProduct', similarProduct?.data?.data?.[0]?.images);
  useEffect(() => {
    // console.log('Product ID:', id);
    // Fetch product details using the id
  }, [id]);
  // console.log('data ++++', data?.data);
  // const data =[1, 2, 3]
  // Function to handle image click
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  // console.log('127', from);

  // //  Edit product code
  // const [title, setTitle] = useState('');
  // const [condition, setCondition] = useState('');
  // const [desc, setDesc] = useState('');
  // const [brandName, setBrandName] = useState('');
  // const [weight, setWeight] = useState('');
  // const [isFood, setIsFood] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState('');
  // const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
  //   [],
  // );
  // const [cardNumber, setCardNumber] = useState('');
  // const [expiry, setExpiry] = useState('');
  // const [cvc, setCvc] = useState('');
  // const {createPaymentMethod} = useStripe();
  // const [stripePaymentVisble, setStripePaymentVisble] = useState(false);

  // const getSubCategories = () => {
  //   const selected = categories.find(cat => cat.cate === selectedCategory);
  //   return selected ? selected.subCate : [];
  // };

  // const handleSubCategorySelect = (selectedItems: any) => {
  //   setSelectedSubCategories(selectedItems);
  // };

  // const [imageUris, setImageUris] = useState([]);
  // const removeImage = index => {
  //   setImageUris(prevUris => prevUris.filter((_, i) => i !== index));
  // };

  // const addImages = newImages => {
  //   const uniqueImages = newImages.filter(uri => !imageUris.includes(uri));
  //   setImageUris(prevUris => [...prevUris, ...uniqueImages]);
  // };

  // // Open gallery to select images
  // const openGallery = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     quality: 1,
  //     selectionLimit: 5,
  //     multiSelect: true,
  //   };

  //   launchImageLibrary(options, response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled gallery picker');
  //     } else if (response.errorCode) {
  //       console.error('Gallery Error:', response.errorMessage);
  //     } else if (response.assets) {
  //       const uris = response.assets.map(asset => asset.uri);
  //       addImages(uris);
  //     }
  //   });
  // };

  // const handleUpload = () => {
  //   setStripePaymentVisble(true);
  // };

  // // stripe code

  // const handlePayment = async () => {
  //   // Validate the input fields before proceeding
  //   if (!cardNumber || !expiry || !cvc) {
  //     Alert.alert('Error', 'Please fill in all the fields');
  //     return;
  //   }

  //   // Parse expiry date
  //   const [expMonth, expYear] = expiry
  //     .split('/')
  //     .map(str => parseInt(str.trim(), 10));

  //   // Create a PaymentMethod
  //   const paymentMethodResult = await createPaymentMethod({
  //     type: 'Card',
  //     card: {
  //       number: cardNumber,
  //       expMonth,
  //       expYear,
  //       cvc,
  //     },
  //     billingDetails: {
  //       name: 'John Doe', // Optional: add user details
  //     },
  //   });

  //   if (paymentMethodResult.error) {
  //     Alert.alert('Payment Error', paymentMethodResult.error.message);
  //   } else {
  //     Alert.alert(
  //       'Payment Method Created',
  //       `ID: ${paymentMethodResult.paymentMethod.id}`,
  //     );
  //     console.log('PaymentMethod:', paymentMethodResult.paymentMethod);
  //   }
  // };

  const handleProductDetails = async id => {
    // console.log(id);

    navigation?.navigate('ProductDetails', {id, from: 'similar_product'});
  };

  const [postSendOffer] = usePostSendOfferMutation();

  const handleSendOffer = async () => {
    // console.log("click");
    setIsPriceModalVisible(false);

    try {
      // Create and populate formData
      const formData = new FormData();
      // console.log('Initial formData', formData);

      // Append necessary fields
      formData.append('seller_id', data?.data?.user_id || '');
      formData.append('product_id', data?.data?.id || '');
      formData.append('asking_price', offerValue || '');

      // console.log('Populated formData', formData);

      // Send the offer
      const res = await postSendOffer(formData).unwrap();
      if (res) {
        Alert.alert('Offer sent');
      }
      console.log('res send offer', res);
    } catch (error) {
      console.log('Error', error);
    }
  };

  console.log('++++++++++++++++++++', wishlistResult);

  const handleFavorite = async () => {
    if (!id) {
      console.error('Product ID is undefined');
      return;
    }

    const formData = new FormData();
    formData.append('product_id', id);
    console.log(formData);
    // Log FormData entries
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
    refetch();

    try {
      const res = await postWishlist(formData); // Mutation call
      console.log('add wish', res);
    } catch (error) {
      console.error('Error in mutation call:', error);
    }
  };
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ...</Text>
      </View>
    );
  }
  return (
    <View style={tw`h-full bg-white px-[4%]`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2 pb-2`}
        onPress={() => navigation?.goBack()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          {
          // 'Cibo per cani'
          "Dog food."
          }
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
                style={tw`w-full rounded-xl w-full h-56`}
              />
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`mt-4`}>
              {data?.data?.images.map((d, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImageClick(index)}>
                  {d && (
                    <Image
                      source={{uri: d}}
                      style={tw`w-20 h-20 rounded-xl mr-2`}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={tw`my-4`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-title text-base font-RoboBold`}>
                {data?.data?.title}
              </Text>
              <TouchableOpacity onPress={handleFavorite} style={tw`pr-4`}>
                <SvgXml
                  width={30}
                  height={30}
                  style={tw``}
                  xml={
                    data?.data?.wishlist === true
                      ? IconStrokeHeartFill
                      : IconStrokeHeart
                  }
                />
                <Text>{data?.data?.wishlist_count}</Text>
              </TouchableOpacity>
            </View>
            <Text style={tw`text-subT text-sm font-RoboNormal py-4`}>
              {data?.data?.description}
            </Text>
            <View style={tw`mt-4 gap-y-2`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Marca: */}
                  Brand:
                </Text>
                <Text style={tw`text-title text-sm font-RoboBold`}>
                  {data?.data?.brand}
                </Text>
              </View>

              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Condizione: */}
                  Condition
                </Text>
                <Text style={tw`text-title text-sm font-RoboBold`}>
                  {data?.data?.condition}
                </Text>
              </View>

              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Posizione: */}
                  Address:
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
                <View style={tw`flex-row items-center gap-4`}>
                  <Text style={tw`text-subT text-xs font-RoboBold`}>
                    €{data?.data?.price}
                  </Text>
                  <View style={tw`flex-row items-center gap-1`}>
                    <Text style={tw`text-title text-sm font-RoboBold`}>
                     €{data?.data?.price_with_buyer_protection_fee || 0}
                    </Text>
                    <SvgXml xml={IconVerified} />
                  </View>
                </View>
              </View>

              {from === 'admin' && (
                <>
                  <View style={tw`flex-row items-center justify-between`}>
                    <Text style={tw`text-title text-sm font-RoboMedium`}>
                      {/* Prezzo richiesto: */}
                      Asking price:
                    </Text>
                    <Text style={tw`text-title text-sm font-RoboBold`}>
                      $400
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center justify-between`}>
                    <Text style={tw`text-danger text-xs font-RoboMedium`}>
                      {/* Differenza: */}
                      Difference
                    </Text>
                    <Text style={tw`text-danger text-xs font-RoboBold`}>
                      -$56
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={tw`mt-4 gap-y-2`}>
              <Button
                title={
                  from === 'admin'
                    ? 'Accettare'
                    : from === 'myOrders'
                    ? 'Buy Now'
                    : from === 'sellOrders'
                    ? 'Buy Now'
                    : from === 'similar_product'
                    ? 'Buy Now'
                    : from === 'wishList'
                    ? 'Buy Now'
                    : 'Modifica prodotto'
                }
                containerStyle={tw`border border-primary`}
                onPress={() => {
                  from === 'admin'
                    ? setAcceptOfferModalVisible(true)
                    : from === 'sellOrders'
                    ? navigation?.navigate('Payment', {id})
                    : from === 'myOrders'
                    ? navigation?.navigate('Payment', {id})
                    : from === 'similar_product'
                    ? navigation?.navigate('Payment', {id})
                    :from === 'Own Product'
                    ? navigation?.navigate('EditProduct', {id})
                    :from === 'wishList'
                    ? navigation?.navigate('Payment', {id})
                    : setOpenProductEditModal(true);
                }}
              />
              {from === 'myOrders' || from === 'sellOrders' || from === 'similar_product' || from === 'wishList' ? (
                <Button
                  title={from === 'admin' ? 'Decline' : 'Make an offer'}
                  containerStyle={tw`border border-primary bg-transparent`}
                  style={tw`text-primary`}
                  onPress={() => {
                    from === 'admin'
                      ? setAcceptOfferModalVisible(false)
                      : setIsPriceModalVisible(true);
                  }}
                />
              ) :  (
                // <Button
                //   title={from === 'admin' ? 'Decline' : 'Make an offer'}
                //   containerStyle={tw`border border-primary bg-transparent`}
                //   style={tw`text-primary`}
                //   onPress={() => {
                //     from === 'admin'
                //       ? setAcceptOfferModalVisible(false)
                //       : setIsPriceModalVisible(true);
                //   }}
                // />
                ""
              )}
              {data?.data?.rating?.rating ? (
                <View
                  style={tw`flex-row items-center justify-between bg-primary100 p-3 rounded-xl mt-2`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Image
                      source={{uri: data?.data?.rating?.rating_user?.avatar}}
                      style={tw`h-11 w-11 rounded-full`}
                    />
                    <View style={tw``}>
                      <Text style={tw`text-title text-sm font-RoboMedium`}>
                        {data?.data?.rating?.rating_user?.name}
                      </Text>
                      <View style={tw`flex-row items-center`}>
                        <View style={tw`flex-row gap-1 mr-2`}>
                          {[...Array(data?.data?.rating?.rating)].map(
                            (_, index) => (
                              <SvgXml xml={IconRating} key={index} />
                            ),
                          )}
                        </View>
                        <Text style={tw`text-title text-sm font-RoboMedium`}>
                          ({data?.data?.rating?.total_rating_count})
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* {from === 'sellOrders' ? null : (
                    <TouchableOpacity style={tw`border-b border-b-primary`}>
                      <Text style={tw`text-primary text-sm font-RoboMedium`}>
                        View Profile
                      </Text>
                    </TouchableOpacity>
                  )} */}
                </View>
              ) : (
                ''
              )}
            </View>
            {from === 'myOrders' || from === 'sellOrders' ? (
              <View style={tw`mt-2`}>
                <View style={tw`flex-row items-center justify-between my-2`}>
                  <Text style={tw`text-title text-base font-RoboMedium`}>
                    Similar product
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation?.navigate(
                        'similarProductList',
                        {id},
                        {
                          // products: [...Array(10)],
                          // title: 'Similar product',
                        },
                      )
                    }>
                    <Text style={tw`text-primary text-xs font-RoboMedium`}>
                      {/* Vedi tutto */}
                      See all
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={tw`flex-row items-center flex-wrap justify-between`}>
                  {similarProduct?.data?.data?.map((d, index) => (
                    <TouchableOpacity
                      style={tw`w-[49%] rounded-xl mb-2 bg-primary100 p-2`}
                      key={index}
                      // onPress={() => navigation?.navigate('ProductDetails')}
                      onPress={() => handleProductDetails(d?.id)}>
                 
                      {d?.images && (
                        <Image
                          source={{uri: d?.images[0]}}
                          style={tw`h-38 w-full rounded-xl`}
                        />
                      )}

                      <TouchableOpacity style={tw`absolute top-5 right-5`}>
                        {d?.user?.avatar && (
                          <Image
                            source={{uri: d?.user?.avatar}}
                            style={tw`h-6 w-6 rounded-full`}
                          />
                        )}
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
                          <Text
                            style={tw`text-subT text-[10px] font-RoboNormal`}>
                            {/* Condizione */}
                            Condition
                          </Text>
                          <Text
                            style={tw`text-primary text-[10px] font-RoboNormal`}>
                            {d.condition}
                          </Text>
                        </View>
                        <View style={tw`flex-row justify-between mt-1`}>
                          <Text style={tw`text-title text-xs font-RoboNormal`}>
                            €{d?.price}
                          </Text>
                          <View style={tw`flex-row items-center gap-1`}>
                            <Text style={tw`text-title text-xs font-RoboBold`}>
                              €{d?.price_with_buyer_protection_fee || 0}
                            </Text>
                            <SvgXml xml={IconVerified} />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
          <NormalModal
            layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
            containerStyle={tw`rounded-xl bg-white p-5`}
            visible={isPriceModalVisible}
            setVisible={setIsPriceModalVisible}>
            <View>
              <Text style={tw`text-title text-sm font-RoboBold mb-2`}>
                {/* Offer Prezzo */}
                Make an offer
              </Text>
              <InputText
                value={offerValue}
                onChangeText={value => setOfferValue(value)} // Corrected onChangeText
                placeholder="Enter your offer price"
                keyboardType="number-pad"
              />

              <View style={tw`mt-2 gap-y-2`}>
                <Button
                  title="Send"
                  onPress={handleSendOffer}
                  // onPress={() => setIsPriceModalVisible(false)}
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
                    from === 'admin'
                      ? setAcceptOfferModalVisible(false)
                      : setIsPriceModalVisible(false);
                  }}
                />
                <Button
                  title="Cancel"
                  containerStyle={tw`bg-transparent border border-primary`}
                  style={tw`text-primary`}
                  onPress={() => {
                    from === 'admin'
                      ? setAcceptOfferModalVisible(false)
                      : setIsPriceModalVisible(false);
                  }}
                />
              </View>
            </View>
          </NormalModal>

          {/* <NormalModal
            layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
            containerStyle={tw`rounded-xl bg-white p-5`}
            visible={openProductEditModal}
            setVisible={setOpenProductEditModal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always">
              <ProductAddFields
                btnTitle="Update"
                title="Edit Product"
                setTitle={setTitle}
                setDesc={setDesc}
                setBrandName={setBrandName}
                handleSubCategorySelect={handleSubCategorySelect}
                selectedSubCategories={selectedSubCategories}
                setWeight={setWeight}
                isFood={isFood}
                setIsFood={setIsFood}
                setCondition={setCondition}
                condition={condition}
                openGallery={openGallery}
                imageUris={imageUris}
                removeImage={removeImage}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedSubCategories={setSelectedSubCategories}
                getSubCategories={getSubCategories}
                handlePayment={handlePayment}
                setCvc={setCvc}
                cvc={cvc}
                setExpiry={setExpiry}
                expiry={expiry}
                setCardNumber={setCardNumber}
                cardNumber={cardNumber}
                setStripePaymentVisble={setStripePaymentVisble}
                stripePaymentVisble={stripePaymentVisble}
                handleUpload={handleUpload}
              />
            </ScrollView>
          </NormalModal> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;
