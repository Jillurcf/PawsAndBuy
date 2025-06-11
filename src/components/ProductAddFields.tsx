import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { SvgXml } from 'react-native-svg';
import { RadioButton, RadioGroup } from 'react-native-ui-lib';
import { IconClose, IconPlus } from '../assets/icons/Icons';
import tw from '../lib/tailwind';
import Button from './Button';
import InputText from './InputText';
// import {Asset, launchImageLibrary} from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { ImagePickerAsset, launchImageLibraryAsync } from 'expo-image-picker';
import { WebView } from 'react-native-webview';
import {
  useGetCategoryListQuery,
  useGetCheckConnectQuery,
  useGetProfileQuery,
  usePostCreateConnectMutation,
} from '../redux/api/apiSlice/apiSlice';
// import { usePostAddProductMutation } from '../redux/api/apiSlice/apiSlice';

interface IProduct {
  title: string;
  description: string;
  images: ImagePickerAsset[];
  price: string;
  brand: string;
  condition: string;
  weight: string;
  is_food: string;
  category_id: string;
  sub_category_ids: Array<string>;
}

const ProductAddFields = ({
  handleUpload,
  navigation,
}: {
  handleUpload: () => void;
}) => {
  const [subCategories, setSubCategories] = React.useState<[]>();
  const [loading, setLoading] = React.useState(false);
  const [connected, setConnected] = useState()
  const [categoryId, setCategoryId] = React.useState<string>();
  const {data: profileData, refetch} = useGetProfileQuery({});
  const [postCreateConnect] = usePostCreateConnectMutation();
  const email =  profileData?.data?.email
  const {data:checkConnet} = useGetCheckConnectQuery(email);
  console.log("checkConnect", checkConnet)
  console.log('data', profileData?.data?.email); 
  const {data: categories, isLoading, isError} = useGetCategoryListQuery({});
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
 
  const [productData, setProductData] = React.useState<IProduct | null>(null);
  console.log('35', profileData?.data?.stripe_account_id);
  const { height, width } = Dimensions.get('screen'); 
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 5, // Allows selecting up to 5 images
    };

    launchImageLibraryAsync(options, response => {
      if (response.didCancel) {
        console.log('User cancelled gallery picker');
      } else if (response.errorCode) {
        console.error('Gallery Error:', response.errorMessage);
      } else if (response.assets?.length) {
        // Map the URIs of selected assets
        const selectedImages = response.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        }));

        setProductData(prevData => {
          // Check if `images` already exists
          const existingImages = prevData?.images || [];

          // Add only unique images
          const uniqueImages = [
            ...existingImages,
            ...selectedImages.filter(
              newImage =>
                !existingImages.some(existing => existing.uri === newImage.uri),
            ),
          ];

          // Ensure the total does not exceed 5 images
          const limitedImages = uniqueImages.slice(0, 5);

          return {
            ...prevData,
            images: limitedImages, // Update state with up to 5 unique images
          };
        });
      }
    });
  };

  // const openGallery = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     quality: 1,
  //     selectionLimit: 5, // Allows selecting up to 5 images
  //   };

  //   launchImageLibrary(options, response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled gallery picker');
  //       return;
  //     }

  //     if (response.errorCode) {
  //       console.error('Gallery Error:', response.errorMessage);
  //       return;
  //     }

  //     if (response.assets?.length) {
  //       // Helper function to validate and filter image types
  //       const filterValidImages = assets => {
  //         const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
  //         return assets.filter(
  //           asset =>
  //             asset.uri &&
  //             asset.fileName &&
  //             asset.type &&
  //             allowedExtensions.includes(asset.type)
  //         );
  //       };

  //       // Filter valid images
  //       const selectedImages = filterValidImages(response.assets);

  //       // Update state
  //       setProductData(prevData => {
  //         const existingImages = prevData?.images || [];

  //         const uniqueImages = [
  //           ...existingImages,
  //           ...selectedImages
  //             .filter(
  //               newImage =>
  //                 !existingImages.some(existing => existing.uri === newImage.uri) // Prevent duplicates
  //             )
  //             .map(newImage => {
  //               const fileName = newImage.uri.split('/').pop(); // Extract file name from URI
  //               const fileType = fileName?.split('.').pop()?.toLowerCase(); // Extract file extension

  //               // Ensure valid MIME type
  //               const validFileTypes = ['jpeg', 'png', 'jpg'];
  //               if (!validFileTypes.includes(fileType)) {
  //                 console.warn(`Invalid file type: ${fileType}. Skipping file.`);
  //                 return null; // Skip invalid files
  //               }

  //               return {
  //                 uri: Platform.select({
  //                   ios: newImage.uri.replace('file://', ''), // Remove `file://` for iOS
  //                   android: newImage.uri, // Use URI as-is for Android
  //                 }),
  //                 name: fileName,
  //                 type: `image/${fileType}`, // Construct MIME type
  //               };
  //             })
  //             .filter(Boolean), // Remove invalid or null images
  //         ].slice(0, 5); // Limit to 5 images

  //         return {
  //           ...prevData,
  //           images: uniqueImages, // Update state with valid images
  //         };
  //       });

  //     }
  //   });
  // };

  // const fileName = fileUri.split('/').pop();
  //       const fileType = `image/${fileName?.split('.').pop()}`;
  //       formData.append('image', {
  //         uri: fileUri,
  //         name: fileName,
  //         type: fileType,

  React.useEffect(() => {
    if (categoryId) {
      const subCategories = categories?.data?.find(
        (item: any) => item.id == categoryId,
      )?.subcategories;
      setSubCategories(subCategories);
    }
  }, [categoryId]);

  // console.log('Sub =====================', productData);

  // Function to handle redirect to onboarding URL
  // const handleRedirectToOnboarding = url => {
  //   if (url) {
  //     Linking.canOpenURL(url)
  //       .then(supported => {
  //         if (supported) {
  //           Linking.openURL(url);
  //         } else {
  //           console.log('Error', 'Unable to open the link.');
  //         }
  //       })
  //       .catch(err => {
  //         console.error('Error opening URL:', err);
  //         console.log('Error', 'Something went wrong while opening the link.');
  //       });
  //   } else {
  //     console.log('Error', 'No URL found.');
  //   }
  // };

  // Function to handle Stripe Connect button click
  // const handleGetConnect = async () => {
  //   console.log('Button clicked');
  //   setLoading(true); // Show loading indicator
  //   try {
  //     const formData = new FormData();

  //     // Append fields to FormData
  //     formData.append('email', profileData?.data?.email);

  //     // Call API to create Stripe Connect account
  //     const response = await postCreateConnect(formData).unwrap();
  //     console.log('Raw response:', response?.onboarding_url); // Log full response

  //     // Extract onboarding_url from response
  //     const onboarding_url = response?.onboarding_url;

  //     if (onboarding_url) {
  //       console.log('Onboarding URL:', onboarding_url);
  //       // const onbRes = handleRedirectToOnboarding(onboarding_url); // Redirect to URL
  //       return <WebView source={{ uri: onboarding_url }} style={{ flex: 1 }} />;

  //     } else {
  //       console.warn('Onboarding URL is undefined. Full response:', response);
  //       console.log('Error', 'Failed to retrieve onboarding URL.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching connect URL:', error);
  //     console.log('Error', 'Failed to create Stripe Connect account.');
  //   } finally {
  //     setLoading(false); // Hide loading indicator
  //   }
  //   // try {
  //   //   const formData = new FormData();
  //   //   formData.append('email', profileData?.data?.email);

  //   //   // Call API to create Stripe Connect account
  //   //   const response = await postCreateConnect(formData).unwrap();
  //   //   console.log('Raw response:', response);

  //   //   const onboarding_url = response?.onboarding_url;
  //   //   const account_id = response?.account_id; // ✅ Store account ID

  //   //   if (onboarding_url && account_id) {
  //   //     console.log('Onboarding URL:', onboarding_url);
  //   //    const oburl =  await handleRedirectToOnboarding(onboarding_url); // Redirect user
  //   //    console.log("262",oburl)
  //   // const statusAcount=  await checkAccountStatus(account_id);
  //   // console.log("264", statusAcount)
  //   //   } else {
  //   //     console.warn('Missing onboarding URL or account ID:', response);
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Error fetching connect URL:', error);
  //   // } finally {
  //   //   setLoading(false);
  //   // }
  // };

  const handleGetConnect = async () => {
    console.log('Button clicked');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', profileData?.data?.email);

      // Call API to create Stripe Connect account
      const response = await postCreateConnect(formData).unwrap();
      console.log('Raw response:', response);

      const url = response?.onboarding_url;
      if (url) {
        console.log('Onboarding URL:', url);
        setOnboardingUrl(url); // Store URL in state
      } else {
        console.warn('Onboarding URL is undefined:', response);
      }
    } catch (error) {
      console.error('Error fetching connect URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewNavigation = async (event: any) => {
    console.log('WebView Navigation State:', event.url);
    console.log(event.url.includes('success'));
    // if (event.url.includes('your-app-success-url')) {
    if (event.url.includes('success')) {
      console.log('Onboarding Successful! Fetching account status...');
      setConnected(event.url.includes('success'))
      // const urlParams = new URLSearchParams(new URL(event.url).search);
      // const email = urlParams.get('email') as string; // Type assertion
      
      // console.log('Extracted Email:', email);
      // Fetch Stripe Account Status
      // try {
      //   const accountStatus = await checkConnet();
      //   console.log('Account Status:', accountStatus);

      //   // Replace with actual screen
      // } catch (error) {
      //   console.error('Error checking account status:', error);
      // }

      // Close the WebView
      setOnboardingUrl(null);
    }
    // useEffect(()=> {
    //   setTimeout(()=> {
    //     refetch()
    //   })
    // }, [1000])

    useFocusEffect(() => {
      console.log('refetch call');
      refetch();
    });

    if (event.url.includes('your-app-failure-url')) {
      console.warn('Onboarding Failed');
      setOnboardingUrl(null);
    }
  };

  if (onboardingUrl) {
    return (
      <WebView
        source={{uri: onboardingUrl}}
        style={{ flex: 1, width: "100%", height: height * 0.7 }}
        onNavigationStateChange={handleWebViewNavigation} 
      />
    );
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
    <View>
      <Text style={tw`text-title text-[20px] font-RoboMedium`}>
        {/* {'Vendere un prodotto'} */}
        Sell a product.
      </Text>
      <View style={tw`mt-4`}>
        <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
          {/* Aggiungi fino a 5 foto */}
          Add up to 5 photos.
        </Text>

        <View
          style={tw`border border-[#949494] border-dotted rounded-xl py-6 px-2 items-center justify-center`}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-4 border border-primary rounded-xl py-2 px-6`}
            onPress={openGallery}>
            <SvgXml xml={IconPlus} />
            <Text style={tw`text-primary text-xs font-RoboBold`}>
              {/* Carica foto */}
              Upload photo
            </Text>
          </TouchableOpacity>

          <View style={tw`flex-row items-center mt-4`}>
            {productData?.images?.map((item: ImagePickerAsset, index: number) => (
              <View key={index} style={tw`relative`}>
                <Image
                  source={{uri: item.uri}}
                  style={tw`${
                    productData?.images[0] === item.uri
                      ? 'w-16 h-16'
                      : 'w-12 h-12'
                  } rounded-lg ml-2`}
                />

                <TouchableOpacity
                  onPress={() => {
                    setProductData(prev => ({
                      ...prev,
                      images: prev?.images?.filter(
                        image => image?.name !== item?.name,
                      ), // Replace `targetUri` with the specific URI to remove
                    }));
                  }}
                  style={tw`bg-secondary rounded-full w-4 h-4 absolute top-1 right-1 items-center justify-center`}>
                  <SvgXml xml={IconClose} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={tw`mt-4`}>
          <InputText
            placeholder=
            // {'Inserisci il titolo del prodotto'}
            {"Enter the product title."}
            placeholderColor={'#949494'}
            label=
            // {'Titolo'}
            {"Title"}
            onChangeText={(text: any) =>
              setProductData({
                ...productData,
                title: text,
              })
            }
          />

          <InputText
            placeholder={'Enter the product description'}
            // {'Inserisci la descrizione del prodotto'}
            placeholderColor={'#949494'}
            label={"Describe your product"}
            // {'Descrivi il tuo prodotto'}
            onChangeText={(text: any) =>
              setProductData({
                ...productData,
                description: text,
              })
            }
            style={tw`h-18`}
            placeholderAlignment={'top'}
          />

          <InputText
            placeholder={"Enater the product brand"}
            // {'Inserisci la marca del prodotto'}
            placeholderColor={'#949494'}
            label={"Brand"}
            // {'Marchio'}
            onChangeText={(text: any) =>
              setProductData({
                ...productData,
                brand: text,
              })
            }
          />

          <View style={tw`mb-2`}>
            <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>
              {/* Condizione */}
              Condtition
            </Text>
            <RadioGroup
              initialValue={productData?.condition}
              // onValueChange={}
              style={tw`flex-row items-center gap-4`}>
              <RadioButton
                onPress={() => {
                  setProductData({
                    ...productData,
                    condition: 'new',
                  });
                }}
                value={'new'}
                color="#064145"
                label={"New"}
                // {'Nuova'}
              />
              <RadioButton
                onPress={() => {
                  setProductData({
                    ...productData,
                    condition: 'used',
                  });
                }}
                value={'used'}
                color="#064145"
                label={"Used"}
              />
            </RadioGroup>
          </View>

          <View style={tw`mb-2`}>
            <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>
              {/* è il cibo? */}
              Is it the food?
            </Text>
            <RadioGroup
              initialValue={productData?.is_food}
              // onValueChange={setIsFood}
              style={tw`flex-row items-center gap-4`}>
              <RadioButton
                onPress={() => {
                  setProductData({
                    ...productData,
                    is_food: 'yes',
                  });
                }}
                value={'yes'}
                color="#064145"
                label={'Yes'}
              />
              <RadioButton
                onPress={() => {
                  setProductData({
                    ...productData,
                    is_food: 'no',
                  });
                }}
                value={'no'}
                color="#064145"
                label={'No'}
              />
            </RadioGroup>
          </View>
          {productData?.is_food === 'yes' && (
            <InputText
              placeholder={'Enter product weight'}
              placeholderColor={'#949494'}
              label={'Weight'}
              onChangeText={(text: any) =>
                setProductData({
                  ...productData,
                  weight: text,
                })
              }
            />
          )}
          {!isLoading && (
            <View style={tw`mt-4`}>
              <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
                {/* categoria */}
                Category
              </Text>
              <Dropdown
                style={tw`bg-secondary py-3 px-2 rounded-xl text-title`}
                data={categories?.data?.map(cat => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                labelField="label"
                containerStyle={tw`bg-white rounded-xl`}
                selectedTextStyle={tw`text-title text-base font-RoboMedium`}
                valueField="value"
                placeholder="Select the product from the category."
                // "selezionare il prodotto della categoria"
                value={productData?.category_id}
                activeColor="#F4FAFA"
                onChange={item => {
                  setCategoryId(item?.value);
                  setProductData({
                    ...productData,
                    category_id: item.value,
                  });
                }}
                search
                searchPlaceholder="Search Category"
                // "cerca categoria"
                placeholderStyle={tw`text-[#949494] text-base font-RoboMedium pl-2`}
              />
            </View>
          )}

          {subCategories?.length && (
            <View style={tw`mt-4 mb-2`}>
              <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
                Subcategory
              </Text>
              <MultiSelect
                style={tw`bg-secondary py-3 px-2 rounded-xl`}
                data={
                  subCategories?.map(sub => ({
                    label: sub?.name,
                    value: sub?.id,
                  })) || []
                } // Fallback to an empty array if subCategories is undefined
                labelField="label"
                valueField="value"
                containerStyle={tw`bg-white rounded-xl`}
                selectedTextStyle={tw`text-title text-base font-RoboMedium`}
                placeholder="Seleziona le sottocategorie"
                placeholderStyle={tw`text-[#949494] text-base font-RoboMedium pl-2`}
                value={productData?.sub_category_ids}
                onChange={selectedItems => {
                  // Handle updated selected items
                  setProductData(prevData => ({
                    ...prevData,
                    sub_category_ids: selectedItems || [], // Ensure selectedItems is always an array
                  }));
                }}
                search
                searchPlaceholder="Cerca sottocategoria"
                activeColor="#F4FAFA"
                selectedStyle={tw`bg-primary100 border border-primary100 rounded-xl`}
              />
            </View>
          )}

          <InputText
            placeholder={'€0.00'}
            placeholderColor={'#949494'}
            label={"Price"}
            // {'Prezzo'}
            onChangeText={(text: any) =>
              setProductData({
                ...productData,
                price: text,
              })
            }
          />
        </View>
        {profileData?.data?.stripe_account_id || connected &&
        profileData?.data?.stripe_account_id || connected ? (
          <Button
            containerStyle={tw`mt-4 mb-2`}
            title={'Add Product'}
            // {'Caricamento'}
            onPress={() => handleUpload && handleUpload(productData)}
          />
        ) : (
          <Button
            containerStyle={tw`mt-4 mb-2 bg-[red]`}
            title={'Get Connect'}
            onPress={handleGetConnect}
          />
        )}
      </View>

      {/* <NormalModal
        layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
        containerStyle={tw`rounded-xl bg-white p-5`}
        visible={stripePaymentVisble}
        setVisible={setStripePaymentVisble}>
        <Text style={tw`text-center text-title text-lg font-RoboMedium mb-4`}>
          Give your card details
        </Text>
        <View style={tw`gap-y-2`}>
          <InputText
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
          />
          <InputText
            placeholder="MM/YY"
            value={expiry}
            onChangeText={setExpiry}
            keyboardType="number-pad"
          />
          <InputText
            placeholder="CVC"
            value={cvc}
            onChangeText={setCvc}
            keyboardType="number-pad"
            secureTextEntry
          />
        </View>
        <Button title="Submit Payment" onPress={handlePayment} />
      </NormalModal> */}
    </View>
  );
};

export default React.memo(ProductAddFields);
