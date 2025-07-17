import { IconBack } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import { CustomAlert } from '@/src/components/CustomAlert';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { useGetMyOrderDetailsQuery, useLazyGetDownloadLabelQuery, useLazyGetGenerateLabelQuery, usePostSendOfferMutation, usePostWishlistMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { Buffer } from 'buffer';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

import * as Print from 'expo-print';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import WebView from 'react-native-webview';



// Polyfill Buffer for React Native (iOS & Android)
global.Buffer = global.Buffer || Buffer;


const OrderProductDetails = () => {

  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [acceptOfferModalVisible, setAcceptOfferModalVisible] = useState(false);
  const [openProductEditModal, setOpenProductEditModal] = useState(false);
  const [offerValue, setOfferValue] = useState();
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  // console.log('112', offerValue);
  // const { from } = route?.params || {};

  // const {id} = route?.params;
  const { id, from } = useLocalSearchParams();
  console.log('121 id', id);

  const { data, isLoading, isError, refetch } = useGetMyOrderDetailsQuery(id);
  // console.log('125', data?.data?.rating?.rating_user?.avatar);
  const { data: similarProduct } = useGetMyOrderDetailsQuery(id);
  const [postWishlist, wishlistResult] = usePostWishlistMutation();
  const [getGenerateLabel] = useLazyGetGenerateLabelQuery();
  const [getDownloadLabel] = useLazyGetDownloadLabelQuery();


  useEffect(() => {
    // console.log('Product ID:', id);
    // Fetch product details using the id
  }, [id]);
  console.log('data ++++', data?.data?.shipping?.shipping_status);
  // const data =[1, 2, 3]
  // Function to handle image click
  // const handleImageClick = (index: number) => {
  //   setSelectedImageIndex(index);
  // };

  const handleProductDetails = async id => {
    // console.log(id);

    router.push('/screens/productDetails/ProductDetails', { id });
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

  // console.log('++++++++++++++++++++', wishlistResult);

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

  const handleGenerateLabel = async () => {
    console.log("click");
    const res = await getGenerateLabel(data?.data?.shipping?.parcel_id)
    console.log(res?.data?.message, "label Generated +++++++++")
    // setLabelGenerateStatus(res?.data?.message)
  }
  // const handleDownloadLabel = async () => {
  //   console.log("click download label");
  //   try {
  //     const order_id = id;
  //     const parcel_id = data?.data?.shipping?.parcel_id;
  //     console.log(order_id, parcel_id, "order and percel id+++++++")

  //     const res = await getDownloadLabel({ order_id: order_id, parcel_id: parcel_id })
  //     // 1️⃣  Download the PDF as raw binary
  //     console.log(res, "pdf download")
  //     // 2️⃣  Convert to base64 so Expo FS can write it
  //     const base64 = Buffer.from(res.data, 'binary').toString('base64');

  //     // 3️⃣  Construct a local file path inside the app sandbox
  //     const fileName = `label_${parcelId}.pdf`;
  //     const fileUri = FileSystem.documentDirectory + fileName; // e.g. file:///data/...

  //     // 4️⃣  Persist the file
  //     await FileSystem.writeAsStringAsync(fileUri, base64, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     console.log(`Label saved to: ${fileUri}`);
  //     return fileUri;
  //   } catch (err: any) {
  //     console.log('Download error:', err.message);
  //     Alert.alert('Error', 'Could not download label.');
  //     return null;
  //   }
  // }


  const handleDownloadLabel = async () => {
    try {
      const order_id = id as string;
      const parcel_id = data?.data?.shipping?.parcel_id as string;
      const base64String = await getDownloadLabel({ order_id, parcel_id }).unwrap();
      setPdfBase64(base64String); // Serializable base64 string from RTK Query
    } catch (err: any) {
      console.error('Download error:', err?.message || err);
      Alert.alert('Error', 'Could not download label.');
    }
  };

  const handlePrintPdf = async () => {
    try {
      if (!pdfBase64) {
        Alert.alert('Error', 'PDF not loaded');
        return;
      }

      await Print.printAsync({
        html: `<iframe src="${pdfBase64}" style="width:100%; height:100%; border:none;"></iframe>`,
      });
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Print Error', 'Failed to print PDF');
    }
  };

  const renderPdfWebView = () => {
    if (!pdfBase64) return null;

    const htmlContent = `<!DOCTYPE html><html><head><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><style>html,body{margin:0;padding:0;height:100%;}iframe{width:100%;height:100%;border:none;} </style></head><body><iframe src=\"${pdfBase64}\"></iframe></body></html>`;

    return (
      <>
        <WebView
          containerStyle={tw`flex-1 justify-center`}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={tw`flex-1 ml-8 `}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator style={tw`flex-1`} size="large" color="#064145" />
          )}
        />
        <View style={tw`items-center`}>
          <Button onPress={handlePrintPdf} containerStyle={tw`w-80% mx-0 items-center`} title={"Print pdf"} />
        </View>
      </>
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                  */
  /* ------------------------------------------------------------------------ */
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ....</Text>
      </View>
    );
  }

  return (
    <View style={tw`h-full bg-white px-[4%]`}>
      <TouchableOpacity
        style={tw`mt-4 flex-row items-center gap-2 pb-2`}
        onPress={() => router.back()}>
        <SvgXml xml={IconBack} />
        <Text style={tw`text-title text-base font-RoboMedium`}>
          {/* {'Cibo per cani'} */}
          Dog food
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
                source={{ uri: data?.data?.product?.images[0] }}
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
                  {/* Marca: */}
                  Brand
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
                  {/* Prezzo: */}
                  Price
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
                      {/* Prezzo richiesto: */}
                      Requested price:
                    </Text>
                    <Text style={tw`text-title text-sm font-RoboBold`}>
                      $400
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center justify-between`}>
                    <Text style={tw`text-danger text-xs font-RoboMedium`}>
                      {/* Differenza: */}
                      Difference:
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
                      router.push({
                        pathname:
                          '/screens/product/similarProductList', params:
                          { id: id },
                      })
                    }>
                    <Text style={tw`text-primary text-xs font-RoboMedium`}>
                      {/* Vedi tutto */}
                      View all
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
                        source={{ uri: d?.images[0] }}
                        style={tw`h-38 w-full rounded-xl`}
                      />}
                      <TouchableOpacity style={tw`absolute top-5 right-5`}>
                        {d?.user?.avatar &&
                          <Image
                            source={{ uri: d?.user?.avatar }}
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

            {data?.data?.shipping?.shipping_status && data?.data?.shipping?.shipping_status === "Label Generated" ? (
              <View style={tw` items-center`}>
                <Button
                  onPress={handleDownloadLabel}
                  containerStyle={tw`w-[80%] my-[20%]`} title={"Download Label"} />
              </View>
            )
              : (
                <View style={tw` items-center`}>
                  <Button
                    onPress={handleGenerateLabel}
                    containerStyle={tw`w-[80%] my-[20%]`} title={"Generate Label"} />
                </View>
              )
            }

          </View>
          {/* PDF WEBVIEW */}
          <View style={{ height: pdfBase64 ? 500 : 0, marginTop: 16 }}>
            {renderPdfWebView()}

          </View>

          <NormalModal
            layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
            containerStyle={tw`rounded-xl bg-white p-5`}
            visible={isPriceModalVisible}
            setVisible={setIsPriceModalVisible}>
            <View>
              <Text style={tw`text-title text-sm font-RoboBold mb-2`}>
                {/* Offer Prezzo */}
                Offer price
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


        </View>
      </ScrollView>
    </View>
  );
};

export default OrderProductDetails;
