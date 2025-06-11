import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { SvgXml } from 'react-native-svg';

import { IconBack } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import { CustomAlert } from '@/src/components/CustomAlert';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { useGetMyOrderDetailsQuery, usePostSendOfferMutation, usePostWishlistMutation } from '@/src/redux/api/apiSlice/apiSlice';



const categories = [
  {
    cate: 'Cane',
    icon: require('../../../assets/images/dog-cate-icon.png'),
    subCate: [
      {subCate: 'Vedi tutto'},
      {subCate: 'Abbigliamento e accessori'},
      {subCate: 'Collari e guinzagli'},
      {subCate: 'Ciotole e alimentatori'},
      {subCate: 'Toelettatura'},
      {subCate: 'Letti e coperte'},
      {subCate: 'Giochi'},
      {subCate: 'Accessori per l’addestramento'},
      {subCate: 'Trasportini e gabbie'},
    ],
  },
  {
    cate: 'Gatto',
    icon: require('../../../assets/images/cat-cate-icon.png'),
    subCate: [
      {subCate: 'Vedi tutto'},
      {subCate: 'Giochi'},
      {subCate: 'Letti'},
      {subCate: 'Abbigliamento e accessori'},
      {subCate: 'Toelettatura'},
      {subCate: 'Ciotole e alimentatori'},
      {subCate: 'Collari e guinzagli'},
      {subCate: 'Trasportini da viaggio'},
    ],
  },
  {
    cate: 'Piccoli Animali',
    icon: require('../../../assets/images/rabit-cate-icon.png'),
    subCate: [
      {subCate: 'Vedi tutto'},
      {subCate: 'Giochi'},
      {subCate: 'Habitat e accessori'},
    ],
  },
  {
    cate: 'Pesci',
    icon: require('../../../assets/images/fish-cate-icon.png'),
    subCate: [
      {subCate: 'Vedi tutto'},
      {subCate: 'Decorazioni e accessori'},
      {subCate: 'Attrezzature per acquari'},
    ],
  },
  {
    cate: 'Uccelli',
    icon: require('../../../assets/images/bird-cate-icon.png'),
    subCate: [
      {subCate: 'Vedi tutto'},
      {subCate: 'Gabbie e accessori'},
      {subCate: 'Giochi'},
    ],
  },
  {
    cate: 'Rettili',
    icon: require('../../../assets/images/lizard-cate-icon.png'),
    subCate: [
      {subCate: 'Vedi tutto'},
      {subCate: 'Gabbie e accessori'},
      {subCate: 'Giochi'},
    ],
  },
];

const OrderProductDetails = ({navigation, route}: any) => {
  // const images = [
  //   require('../../assets/images/food-1.png'),
  //   require('../../assets/images/food-2.png'),
  //   require('../../assets/images/food-3.png'),
  //   require('../../assets/images/food-4.png'),
  //   require('../../assets/images/food-1.png'),
  //   require('../../assets/images/food-2.png'),
  //   require('../../assets/images/food-3.png'),
  //   require('../../assets/images/food-4.png'),
  // ];
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [acceptOfferModalVisible, setAcceptOfferModalVisible] = useState(false);
  const [openProductEditModal, setOpenProductEditModal] = useState(false);
  const [offerValue, setOfferValue] = useState();
  // console.log('112', offerValue);
  const {from} = route?.params || {};

  const {id} = route?.params;
  console.log('121 id', id);

  const {data, isLoading, isError, refetch} = useGetMyOrderDetailsQuery(id);
  // console.log('125', data?.data?.rating?.rating_user?.avatar);
  const {data: similarProduct} = useGetMyOrderDetailsQuery(id);
  const [postWishlist, wishlistResult] = usePostWishlistMutation();

  useEffect(() => {
    // console.log('Product ID:', id);
    // Fetch product details using the id
  }, [id]);
  console.log('data ++++', data?.data);
  // const data =[1, 2, 3]
  // Function to handle image click
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleProductDetails = async id => {
    // console.log(id);

    navigation?.navigate('ProductDetails', {id});
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
       setAlertVisible(true);
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
        <Text style={tw`text-primary mt-2`}>Loading ....</Text>
      </View>
    );
  }

  

  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };
  return (
    <View style={tw`h-full bg-white px-[4%]`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2 pb-2`}
        onPress={() => navigation?.goBack()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          {'Cibo per cani'}
        </Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={tw`pb-4`}>
        <View>
          <View style={tw`bg-primary100 p-3 rounded-xl mt-4`}>
            {data?.data?.product &&
             <Image
             source={{uri: data?.data?.product?.images[0]}}
             style={tw`w-full rounded-xl h-56`}
           />
        }
           
            {/*   
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tw`mt-4`}>
                {data?.data?.images.map((d, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleImageClick(index)}>
                    <Image
                      source={{uri: d}}
                      style={tw`w-20 h-20 rounded-xl mr-2`}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView> */}
          </View>

          <View style={tw`my-4`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-title text-base font-RoboBold`}>
                {data?.data?.product?.title}
              </Text>
              {/* <TouchableOpacity onPress={handleFavorite} style={tw`pr-4`}>
                  <SvgXml
                    width={30}
                    height={30}
                    style={tw``}
                    xml={
                      data?.data?.wishlist_count === 1
                        ? IconStrokeHeartFill
                        : IconStrokeHeart
                    }
                  />
                  <Text>{data?.data?.wishlist_count}</Text>
                </TouchableOpacity> */}
            </View>
            <Text style={tw`text-subT text-sm font-RoboNormal py-4`}>
              {data?.data?.product?.description}
            </Text>
            <View style={tw`mt-4 gap-y-2`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  Marca:
                </Text>
                <Text style={tw`text-title text-sm font-RoboBold`}>
                  {data?.data?.product?.brand}
                </Text>
              </View>

              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  {/* Condizione: */}
                  Condition
                </Text>
                <Text style={tw`text-title text-sm font-RoboBold`}>
                  {data?.data?.product?.condition}
                </Text>
              </View>

              {/* <View style={tw`flex-row items-center justify-between`}>
                  <Text style={tw`text-subT text-sm font-RoboMedium`}>
                    Posizione:
                  </Text>
                  <Text style={tw`text-title text-sm font-RoboBold`}>
                    {data?.data?.product?.address}
                  </Text>
                </View> */}
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-subT text-sm font-RoboMedium`}>
                  Prezzo:
                </Text>
                <View style={tw`flex-row items-center gap-4`}>
                  <Text style={tw`text-subT text-xs font-RoboBold`}>
                    €{data?.data?.product?.price}
                  </Text>
                  {/* <View style={tw`flex-row items-center gap-1`}>
                    <Text style={tw`text-title text-sm font-RoboBold`}>
                      $456.00€
                      {data?.data?.product?.price_with_buyer_protection_fee ||
                        0}
                    </Text>
                    <SvgXml xml={IconVerified} />
                  </View> */}
                </View>
              </View>

              {from === 'admin' && (
                <>
                  <View style={tw`flex-row items-center justify-between`}>
                    <Text style={tw`text-title text-sm font-RoboMedium`}>
                      Prezzo richiesto:
                    </Text>
                    <Text style={tw`text-title text-sm font-RoboBold`}>
                      $400
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center justify-between`}>
                    <Text style={tw`text-danger text-xs font-RoboMedium`}>
                      Differenza:
                    </Text>
                    <Text style={tw`text-danger text-xs font-RoboBold`}>
                      -$56
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* <View style={tw`mt-4 gap-y-2`}>
                <Button
                  title={
                    // from === 'admin'
                    //   ? 'Accettare'
                    //   : from === 'myOrders'
                    //   ? 'Annulla ordine'
                    //   : from === 'myOrders'
                    //   ?
                       'Buy Now'
                    //   : 'Modifica prodotto'
                  }
                  containerStyle={tw`border border-primary`}
                  onPress={() => {
                    from === 'admin'
                      ? setAcceptOfferModalVisible(true)
                      : from === 'sellOrders'
                      ? navigation?.navigate('Payment', {id})
                      : from === 'myOrders'
                      ? null
                      : setOpenProductEditModal(true);
                  }}
                />
                {from === 'myOrders' ||
                  (from === 'sellOrders' && (
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
                  ))}
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
                    {from === 'sellOrders' ? null : (
                      <TouchableOpacity style={tw`border-b border-b-primary`}>
                        <Text style={tw`text-primary text-sm font-RoboMedium`}>
                          View Profile
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  ''
                )}
              </View> */}
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
                      Vedi tutto
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
                      {d?.images && <Image
                        source={{uri: d?.images[0]}}
                        style={tw`h-38 w-full rounded-xl`}
                      />}
                      <TouchableOpacity style={tw`absolute top-5 right-5`}>
                        {d?.user?.avatar && 
                        <Image
                        source={{uri: d?.user?.avatar}}
                        style={tw`h-6 w-6 rounded-full`}
                      />
                        }
                        
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
                            Condition: 
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
                            {/* <SvgXml xml={IconVerified} /> */}
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
                Offer Prezzo
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
            <CustomAlert
        visible={alertVisible}
        message="Offer sent"
        onClose={closeCustomAlert}
      />
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

export default OrderProductDetails;
