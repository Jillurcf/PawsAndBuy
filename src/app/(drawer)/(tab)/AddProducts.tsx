import React, { useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import SecondaryHeader from '../../../components/SecondaryHeader';
import tw from '../../../lib/tailwind';

import { CustomAlert } from '../../../components/CustomAlert';
import ProductAddFields from '../../../components/ProductAddFields';
import { useGetProfileQuery, usePostAddProductMutation } from '../../../redux/api/apiSlice/apiSlice';


const AddProducts = ({navigation}: any) => {
const {data, isLoading, isError, refetch} = useGetProfileQuery({});
console.log("profile data", data?.data)
const [postAddProduct] = usePostAddProductMutation();

const [alertVisible, setAlertVisible] = useState(false);
//  useEffect(() => {
//     setTimeout(() => {
//       refetch();
//     }, 100);
//   }, []);
const showCustomAlert = () => {
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);
};
  

  // Initial form state
  const initialFormState = {
    title: "",
    description: "",
    price: "",
    category_id: "",
    condition: "",
    is_food: "no",
    sub_category_ids: [],
    brand: "",
    images: []
  };

  const [formData, setFormData] = useState(initialFormState);

  // Function to reset the form
  const resetForm = () => {
    setFormData(initialFormState);
  };
  const handleUpload = async (productData) => {
    console.log('Upload clicked');
    console.log('productData', productData);

    try {
      const formData = new FormData();

      // Append fields to FormData
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category_id', productData.category_id);
      formData.append('condition', productData.condition);
      const isFood = productData.is_food === 'yes' ? 1 : 0;
      formData.append('is_food', isFood);
      formData.append('sub_category_ids', productData.sub_category_ids);
      formData.append('brand', productData.brand);

      // Append sub_category_ids (handle arrays properly)
      productData.sub_category_ids.forEach((id, index) => {
        formData.append(`sub_category_ids[${index}]`, id);
      });

      // Append images in the correct format
      productData.images.forEach((image, index) => {
        if (!image.uri || !image.name || !image.type) {
          throw new Error(`Invalid image data at index ${index}`);
        }

        // React Native requires using the actual file format for `uri`
        formData.append(`images[${index}]`, {
          uri: image.uri,
          name: image.name,
          type: image.type, // E.g., 'image/png'
        });
      });

      console.log('FormData ready. Sending request...');
      console.log(formData);
      // Use `formData` instead of `productData` for the API call
      const response = await postAddProduct(formData);
      console.log("product added", response)
      setAlertVisible(true);
      // Alert.alert('Product added Successfully:');
        // Reset form after successful upload
        
        resetForm()
  
    } catch (error) {
      console.error(
        'Error during upload:',
        error?.data?.message || error.message || error,
      );
    }
  };

  return (
    <View style={tw`flex-1 bg-white py-8 px-[4%] h-full`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <SecondaryHeader navigation={navigation} />

        <ProductAddFields formData={formData} setFormData={setFormData} handleUpload={handleUpload} />
        <CustomAlert
        visible={alertVisible}
        message=
        // "Prodotto aggiunto con successo"
        'Product successfully added.'
        onClose={closeCustomAlert}
      />
      </ScrollView>
      <StatusBar barStyle="dark-content" backgroundColor={'#4964C6'} translucent={false} />
    </View>
  );
};

export default AddProducts;
