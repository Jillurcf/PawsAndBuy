import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { SvgXml } from 'react-native-svg';
import { RadioButton, RadioGroup, TextArea } from 'react-native-ui-lib';
import { IconClose, IconPlus } from '../assets/icons/Icons';
import tw from '../lib/tailwind';
import Button from './Button';
// import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { ImagePickerAsset, launchImageLibraryAsync } from 'expo-image-picker';
import {
  useGetCategoryListQuery,
  useGetProfileQuery,
  usePostCreateConnectMutation
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

const ProductEditFields = ({
  handleUpload,
  navigation,
  route,
  id,
  data,
  loading
}: // isLoading
  {
     handleUpload: (productData: IProduct) => void; // ✅ Fix this
    loading: boolean;
  }) => {
  const [subCategories, setSubCategories] = React.useState<[]>([]);
  // const [loading, setLoading] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState<string>();
  const { data: profileData } = useGetProfileQuery({});
  const [openingWebview, setOpeningWebview] = useState(false);
  const colorScheme = useColorScheme();
  console.log(openingWebview, "OpeningWebvew+++++++++++++++")
  // const [postCreateConnect] = usePostCreateConnectMutation();
  // const {id} = route?.params
  // console.log('54', id);
  // const {data, isLoading, isError} = useGetHomeProductDetailsQuery(id)
  // console.log('data====', data?.data?.id);
  const { data: categories, isLoading, isError } = useGetCategoryListQuery({});
  const [postCreateConnect] = usePostCreateConnectMutation();
  // console.log("cat", categories?.data[0]?.id)

  const [productData, setProductData] = React.useState<IProduct>({
    images: [],
    title: '',
    description: '',
    brand: '',
    condition: '',
    is_food: 0,
    category_id: null,
    sub_category_id: null,
    price: '',
    weight: '', // Initialize the weight
  });
  // console.log('product data', productData);
  React.useEffect(() => {
    console.log('useEffect data :', data?.data);
    if (data?.data) {
      setProductData(prevData => ({
        ...prevData,
        description: data?.data?.description,
        title: data?.data?.title || '',
        brand: data?.data?.brand,
        condition: data?.data?.condition.toLowerCase(),
        is_food: data.data.is_food === 1 ? 'yes' : 'no',
        category_id: data?.data?.category_id,
        sub_category_id: data?.data?.sub_category_id?.map(i => Number(i)),
        price: data.data.price.toString(),
        weight: data?.data?.weight || '', // Initialize the weight
        images:
          data?.data?.images.map(url => ({
            uri: url, // Map to required format
            name: url.split('/').pop(),
            type: 'image/jpeg', // Default type
          })) || [],
      }));
      setCategoryId(data?.data?.category_id)

    }
  }, [data]);

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

    const subCategories = categories?.data?.find(
      (item: any) => item.id == categoryId,
    )?.subcategories;
    setSubCategories(subCategories);

  }, [categoryId, categories]);


  // console.log("244",subCategories,categoryId)



  // console.log('Sub =====================', productData);

  // Function to handle redirect to onboarding URL
  const handleRedirectToOnboarding = url => {
    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert('Error', 'Unable to open the link.');
          }
        })
        .catch(err => {
          console.error('Error opening URL:', err);
          Alert.alert('Error', 'Something went wrong while opening the link.');
        });
    } else {
      Alert.alert('Error', 'No URL found.');
    }
  };

  // Function to handle Stripe Connect button click
  const handleGetConnect = async () => {
  
    setOpeningWebview(true);
    console.log('Button+++++', openingWebview);
    // Simulate WebView navigation (replace with real navigation)
    // setTimeout(() => {
    //   setOpeningWebview(false); // Hide indicator once WebView is open
    //   // Navigate to Stripe WebView or trigger your logic here
    // }, 3000); // adjust delay to match your actual delay


   
    // setLoading(true); // Show loading indicator
    try {
      const formData = new FormData();

      // Append fields to FormData
      formData.append('email', profileData?.data?.email);

      // Call API to create Stripe Connect account
      const response = await postCreateConnect(formData).unwrap();
      console.log('Raw response:', response?.onboarding_url); // Log full response

      // Extract onboarding_url from response
      const onboarding_url = response?.onboarding_url;

      if (onboarding_url) {
        console.log('Onboarding URL:', onboarding_url);
        handleRedirectToOnboarding(onboarding_url); // Redirect to URL
      } else {
        console.warn('Onboarding URL is undefined. Full response:', response);
        Alert.alert('Error', 'Failed to retrieve onboarding URL.');
      }
    } catch (error) {
      console.error('Error fetching connect URL:', error);
      Alert.alert('Error', 'Failed to create Stripe Connect account.');
    } finally {
      // setLoading(false); // Hide loading indicator
    }
  };
 
  // return (
  //   <View>
  //     <Text style={tw`text-title text-[20px] font-RoboMedium`}>
  //       {/* {'Vendere un prodotto'} */}
  //       Sell a product.
  //     </Text>
  //     <View style={tw`mt-4`}>
  //       <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
  //         {/* Aggiungi fino a 5 foto */}
  //         Add up to 5 photos.
  //       </Text>

  //       <View
  //         style={tw`border border-[#949494] border-dotted rounded-xl py-6 px-2 items-center justify-center`}>
  //         <TouchableOpacity
  //           style={tw`flex-row items-center gap-4 border border-primary rounded-xl py-2 px-6`}
  //           onPress={openGallery}>
  //           <SvgXml xml={IconPlus} />
  //           <Text style={tw`text-primary text-xs font-RoboBold`}>
  //             {/* Carica foto */}
  //             Upload photo.
  //           </Text>
  //         </TouchableOpacity>

  //         <View style={tw`flex-row flex-wrap`}>
  //           {productData?.images.map((image, index) => (
  //             <Image
  //               key={index}
  //               source={{ uri: image.uri }}
  //               style={tw`w-20 h-20 m-2 rounded`}
  //             />
  //           ))}
  //         </View>
  //         <View style={tw`flex-row items-center mt-4`}>
  //           {productData?.images?.map((item: Asset, index: number) => (
  //             <View key={index} style={tw`relative`}>
  //               <Image
  //                 source={{ uri: item.uri }}
  //                 style={tw`${productData?.images[0] === item.uri
  //                     ? 'w-16 h-16'
  //                     : 'w-12 h-12'
  //                   } rounded-lg ml-2`}
  //               />

  //               <TouchableOpacity
  //                 onPress={() => {
  //                   setProductData(prev => ({
  //                     ...prev,
  //                     images: prev?.images?.filter(
  //                       image => image?.name !== item?.name,
  //                     ), // Replace `targetUri` with the specific URI to remove
  //                   }));
  //                 }}
  //                 style={tw`bg-secondary rounded-full w-4 h-4 absolute top-1 right-1 items-center justify-center`}>
  //                 <SvgXml xml={IconClose} />
  //               </TouchableOpacity>
  //             </View>
  //           ))}
  //         </View>
  //       </View>

  //       <View style={tw`mt-4`}>
  //         <Text style={tw`text-black py-2`}>
  //           {/* Titolo */}
  //           Title
  //         </Text>
  //         <TextInput
          
  //           style={tw`bg-[#82A0A21A] h-10 rounded-lg px-4 font-RoboNormal`}
  //           // placeholder={productData?.title}
  //           // placeholderColor={'#949494'}
  //           // label={'Titolo'}
  //           value={productData?.title}
  //           onChangeText={(text: any) =>
  //             setProductData({
  //               ...productData,
  //               title: text,
  //             })
  //           }
  //         />
  //         <Text style={tw`text-black py-2`}>
  //           {/* Descrivi il tuo prodotto */}
  //           Describe your product
  //         </Text>
  //         <View style={tw`bg-[#82A0A21A] h-24 px-4 rounded-lg`}>
  //           <TextArea
  //             placeholder={"Enter the product description."}
  //             // {'Inserisci la descrizione del prodotto'}
  //             // placeholderColor={'#949494'}
  //             // label={'Descrivi il tuo prodotto'}
  //             value={data?.data?.description}
  //             onChangeText={(text: any) =>
  //               setProductData({
  //                 ...productData,
  //                 description: text,
  //               })
  //             }
  //             style={tw` text-black`}
  //             placeholderAlignment={'top'}
  //           />
  //         </View>
  //         <Text style={tw`text-black py-2`}>
  //           {/* Marchio */}
  //           Brand
  //         </Text>
  //         <TextInput
  //           // placeholder={'Inserisci la marca del prodotto'}
  //           // placeholderColor={'#949494'}
  //           // label={'Marchio'}
  //           style={tw`bg-[#82A0A21A] h-10 rounded-lg px-4 font-RoboNormal`}
  //           value={productData.brand}
  //           onChangeText={(text: any) =>
  //             setProductData({
  //               ...productData,
  //               brand: text,
  //             })
  //           }
  //         />

  //         <View style={tw`mb-2`}>
  //           <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>
  //             {/* Condizione */}
  //             Condition
  //           </Text>
  //           <RadioGroup
  //             initialValue={productData?.condition}
  //             // onValueChange={}
  //             style={tw`flex-row items-center gap-4`}>
  //             <RadioButton
  //               onPress={() => {
  //                 setProductData({
  //                   ...productData,
  //                   condition: 'new',
  //                 });
  //               }}
  //               value={'new'}
  //               color="#064145"
  //               label={"New"}
  //             // {'Nuova'}
  //             />
  //             <RadioButton
  //               onPress={() => {
  //                 setProductData({
  //                   ...productData,
  //                   condition: 'used',
  //                 });
  //               }}
  //               value={'used'}
  //               color="#064145"
  //               label={"Used"}
  //             // {'Usata'}
  //             />
  //           </RadioGroup>
  //         </View>

  //         <View style={tw`mb-2`}>
  //           <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>
  //             {/* è il cibo? */}
  //             Is it the food
  //           </Text>
  //           <RadioGroup
  //             initialValue={productData?.is_food}
  //             // onValueChange={setIsFood}
  //             style={tw`flex-row items-center gap-4`}>
  //             <RadioButton
  //               onPress={() => {
  //                 setProductData({
  //                   ...productData,
  //                   is_food: 'yes',
  //                 });
  //               }}
  //               value={'yes'}
  //               color="#064145"
  //               label={'Yes'}
  //             />
  //             <RadioButton
  //               onPress={() => {
  //                 setProductData({
  //                   ...productData,
  //                   is_food: 'no',
  //                 });
  //               }}
  //               value={'no'}
  //               color="#064145"
  //               label={'No'}
  //             />
  //           </RadioGroup>
  //         </View>
  //         <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>
  //           Peso
  //         </Text>
  //         {productData?.is_food === 'yes' && (

  //           <TextInput
  //             style={tw`bg-[#82A0A21A] rounded-lg px-4 font-RoboNormal`}
  //             // placeholder={'Enter product weight'}
  //             // placeholderColor={'#949494'}
  //             value={productData?.weight}
  //             // label={'Weight'}
  //             onChangeText={(text: any) =>
  //               setProductData({
  //                 ...productData,
  //                 weight: text,
  //               })
  //             }
  //           />
  //         )}
  //         {!isLoading && (
  //           <View style={tw`mt-4`}>
  //             <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
  //               {/* Categoria */}
  //               Category
  //             </Text>
  //             <Dropdown
  //               style={tw`bg-secondary py-3 px-2 rounded-xl text-title`}
  //               data={categories?.data?.map(cat => ({
  //                 label: cat.name,
  //                 value: cat.id,
  //               }))}
  //               labelField="label"
  //               containerStyle={tw`bg-white rounded-xl`}
  //               selectedTextStyle={tw`text-title text-base font-RoboMedium`}
  //               valueField="value"
  //               placeholder="Select the product from the category."
  //               // "selezionare il prodotto della categoria"
  //               value={productData?.category_id}
  //               activeColor="#F4FAFA"
  //               onChange={item => {
  //                 setCategoryId(item?.value);
  //                 setProductData({
  //                   ...productData,
  //                   category_id: item.value,
  //                 });
  //               }}
  //               search
  //               searchPlaceholder="Search category"
  //               // "cerca categoria"
  //               placeholderStyle={tw`text-[#949494] text-base font-RoboMedium pl-2`}
  //             />
  //           </View>
  //         )}


  //         <View style={tw`mt-4 mb-2`}>
  //           <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
  //             {/* Sottocategoria */}
  //             Sub Category
  //           </Text>
  //           <MultiSelect
  //             style={tw`bg-secondary py-3 px-2 rounded-xl`}
  //             data={
  //               subCategories?.map(sub => ({
  //                 label: sub?.name,
  //                 value: sub?.id,
  //               })) || []
  //             } // Fallback to an empty array if subCategories is undefined
  //             labelField="label"
  //             valueField="value"
  //             containerStyle={tw`bg-white rounded-xl`}
  //             selectedTextStyle={tw`text-title text-base font-RoboMedium`}
  //             placeholder="Seleziona le sottocategorie"
  //             placeholderStyle={tw`text-[#949494] text-base font-RoboMedium pl-2`}
  //             value={productData?.sub_category_id}
  //             onChange={selectedItems => {
  //               // Handle updated selected items
  //               setProductData(prevData => ({
  //                 ...prevData,
  //                 sub_category_id: selectedItems || [], // Ensure selectedItems is always an array
  //               }));
  //             }}
  //             search
  //             searchPlaceholder="Search subcategory."
  //             // "Cerca sottocategoria"
  //             activeColor="#F4FAFA"
  //             selectedStyle={tw`bg-primary100 border border-primary100 rounded-xl`}
  //           />
  //         </View>

  //         <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>Price

  //         </Text>
  //         <TextInput
  //           placeholder={'€0.00'}
  //           // placeholderColor={'#949494'}
  //           // label={'Prezzo'}
  //           style={tw`bg-[#82A0A21A] rounded-lg px-4 font-RoboNormal`}
  //           value={productData?.price || ''}
  //           onChangeText={(text: any) =>
  //             setProductData({
  //               ...productData,
  //               price: text,
  //             })
  //           }
  //         />
  //       </View>
  //       {profileData?.data?.stripe_account_id &&
  //         profileData?.data?.stripe_account_id ? (
  //         <Button
  //           containerStyle={tw`mt-4 mb-2`}
  //           title={"Update product"}
  //           // {'Aggiorna Prodotto'}
  //           onPress={() => handleUpload && handleUpload(productData)}
  //         />
  //       ) : (
  //         <View style={tw`flex-row items-center mt-4 mb-2 relative`}>
  //           <Button
  //             buttonStyle={tw`bg-[red]`}
  //             title="Get Connect"
  //             onPress={handleGetConnect}
  //           />
  //           {openingWebview && (
  //             <ActivityIndicator size="small" color="#0000ff" style={tw`ml-2 absolute top-9 left-5`} />
  //           )}
  //         </View>
  //       )}
  //     </View>

  //     {/* <NormalModal
  //         layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
  //         containerStyle={tw`rounded-xl bg-white p-5`}
  //         visible={stripePaymentVisble}
  //         setVisible={setStripePaymentVisble}>
  //         <Text style={tw`text-center text-title text-lg font-RoboMedium mb-4`}>
  //           Give your card details
  //         </Text>
  //         <View style={tw`gap-y-2`}>
  //           <InputText
  //             placeholder="Card Number"
  //             value={cardNumber}
  //             onChangeText={setCardNumber}
  //             keyboardType="number-pad"
  //           />
  //           <InputText
  //             placeholder="MM/YY"
  //             value={expiry}
  //             onChangeText={setExpiry}
  //             keyboardType="number-pad"
  //           />
  //           <InputText
  //             placeholder="CVC"
  //             value={cvc}
  //             onChangeText={setCvc}
  //             keyboardType="number-pad"
  //             secureTextEntry
  //           />
  //         </View>
  //         <Button title="Submit Payment" onPress={handlePayment} />
  //       </NormalModal> */}
  //   </View>
  // );

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
              Upload photo.
            </Text>
          </TouchableOpacity>

          <View style={tw`flex-row flex-wrap`}>
            {productData?.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={tw`w-20 h-20 m-2 rounded`}
              />
            ))}
          </View>
          <View style={tw`flex-row items-center mt-4`}>
            {productData?.images?.map((item: Asset, index: number) => (
              <View key={index} style={tw`relative`}>
                <Image
                  source={{ uri: item.uri }}
                  style={tw`${productData?.images[0] === item.uri
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
          <Text style={tw`text-black py-2`}>
            {/* Titolo */}
            Title
          </Text>
          <TextInput
           style={tw`${colorScheme === 'dark' ? 'bg-[#82A0A21A]' : 'bg-[#82A0A21A]'} text-black rounded-lg px-4 font-RoboNormal h-10`}
            // placeholder={productData?.title}
            // placeholderColor={'#949494'}
            // label={'Titolo'}
            value={productData?.title}
            onChangeText={(text: any) =>
              setProductData({
                ...productData,
                title: text,
              })
            }
          />
          <Text style={tw`text-black py-2`}>
            {/* Descrivi il tuo prodotto */}
            Describe your product
          </Text>
          <View style={tw`bg-[#82A0A21A] px-4 h-24 rounded-lg`}>
            <TextArea
              placeholder={"Enter the product description."}
              // {'Inserisci la descrizione del prodotto'}
              // placeholderColor={'#949494'}
              // label={'Descrivi il tuo prodotto'}
              value={data?.data?.description}
              onChangeText={(text: any) =>
                setProductData({
                  ...productData,
                  description: text,
                })
              }
              style={tw`h-28 text-black`}
              placeholderAlignment={'top'}
            />
          </View>
          <Text style={tw`text-black py-2`}>
            {/* Marchio */}
            Brand
          </Text>
          <TextInput
            // placeholder={'Inserisci la marca del prodotto'}
            // placeholderColor={'#949494'}
            // label={'Marchio'}
            style={tw`bg-[#82A0A21A] text-black rounded-lg h-10 px-4 font-RoboNormal`}
            value={productData.brand}
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
              Condition
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
              // {'Usata'}
              />
            </RadioGroup>
          </View>

          <View style={tw`mb-2`}>
            <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>
              {/* è il cibo? */}
              Is it the food
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
          <Text style={[tw`text-title text-sm  font-RoboMedium mb-1.5`]}>
            Weight
          </Text>
          {/* {productData?.is_food === 'yes' && ( */}

          <TextInput
            style={tw`bg-[#82A0A21A] text-black h-10 rounded-lg px-4 font-RoboNormal`}
            // placeholder={'Enter product weight'}
            // placeholderColor={'#949494'}
            value={productData?.weight}
            // label={'Weight'}
            onChangeText={(text: any) =>
              setProductData({
                ...productData,
                weight: text,
              })
            }
          />
          {/* )} */}
          {!isLoading && (
            <View style={tw`mt-4`}>
              <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
                {/* Categoria */}
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
                searchPlaceholder="Search category"
                // "cerca categoria"
                placeholderStyle={tw`text-[#949494] text-base font-RoboMedium pl-2`}
              />
            </View>
          )}


          <View style={tw`mt-4 mb-2`}>
            <Text style={tw`text-title text-sm font-RoboMedium mb-2`}>
              {/* Sottocategoria */}
              Sub Category
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
              value={productData?.sub_category_id}
              onChange={selectedItems => {
                // Handle updated selected items
                setProductData(prevData => ({
                  ...prevData,
                  sub_category_id: selectedItems || [], // Ensure selectedItems is always an array
                }));
              }}
              search
              searchPlaceholder="Search subcategory."
              // "Cerca sottocategoria"
              activeColor="#F4FAFA"
              selectedStyle={tw`bg-primary100 border border-primary100 rounded-xl`}
            />
          </View>

          <Text style={[tw`text-title text-sm font-RoboMedium mb-1.5`]}>Price

          </Text>
          <TextInput
            placeholder={'€0.00'}
            // placeholderColor={'#949494'}
            // label={'Prezzo'}
            style={tw`bg-[#82A0A21A] text-black h-10 rounded-lg px-4 font-RoboNormal`}
            value={productData?.price || ''}
            onChangeText={(text: any) =>
              setProductData({
                ...productData,
                price: text,
              })
            }
          />
        </View>
        {/* {profileData?.data?.stripe_account_id &&
          profileData?.data?.stripe_account_id ? ( */}
        <Button
          containerStyle={tw`mt-4 mb-2`}
          title={loading ? "Updating..." : "Update product"}
          // {'Aggiorna Prodotto'}
          onPress={() => handleUpload && handleUpload(productData)}
        />
        {/* ) : (
          <View style={tw`flex-row items-center mt-4 mb-2 relative`}>
            <Button
              buttonStyle={tw`bg-[red]`}
              title="nnect"
              onPress={handleGetConnect}
            />
            {openingWebview && (
              <ActivityIndicator size="small" color="#0000ff" style={tw`ml-2 absolute top-9 left-5`} />
            )}
          </View>
        )} */}
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

export default React.memo(ProductEditFields);
