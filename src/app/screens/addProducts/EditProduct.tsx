import { CustomAlert } from '@/src/components/CustomAlert';
import ProductEditField from '@/src/components/ProductEditField';
import SecondaryHeader from '@/src/components/SecondaryHeader';
import tw from '@/src/lib/tailwind';
import { useGetHomeProductDetailsQuery, usePosUpdateProductMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

const EditProduct = ({ navigation, route }: any) => {
  const { id } = useLocalSearchParams()
  const { data, isLoading, isError } = useGetHomeProductDetailsQuery(id);
  // console.log("profile data", data?.data?.id)

  const [posUpdateProduct] = usePosUpdateProductMutation();
  const [alertVisible, setAlertVisible] = useState(false);
    const [loading, setLoading] = React.useState(false);

  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };
  const handleUpload = async productData => {
     setLoading(true);
    try {
      const formData = new FormData();

      // Append fields to FormData
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category_id', productData.category_id);
      formData.append('sub_category_id', productData.sub_category_id);
      formData.append('condition', productData.condition);
      formData.append('weight', productData.weight);
      const isFood = productData.is_food === 'yes' ? 1 : 0;
      formData.append('is_food', isFood);
      formData.append('brand', productData.brand);
      formData.append('_method', 'PUT');

      //  formData.append('sub_category_ids', JSON.stringify(productData.sub_category_ids));
      // Append each sub_category_id
      // if (Array.isArray(productData.sub_category_id)) {
      //   productData.sub_category_id.forEach(id => {
      //     formData.append('sub_category_id', id);
      //   });
      // } else {
      //   console.error('sub_category_id must be an array');
      // }
      if (Array.isArray(productData.sub_category_id)) {
        productData.sub_category_id?.forEach((key, i) => {
          formData.append(`sub_category_id[${i}]`, key);
        });
      } else {
        console.error('sub_category_id must be an array');
        return;
      }

     

      // Append images as binary files
      if (Array.isArray(productData.images)) {
        productData.images.forEach((image, index) => {
          if (!image.uri || !image.name || !image.type) {
            throw new Error(`Invalid image data at index ${index}`);
          }
          formData.append(`images[${index}]`, {
            uri: image.uri,
            name: image.name,
            type: image.type, // E.g., 'image/jpeg'
          });
        });
      } else {
        console.error('Images must be an array');
      }

      console.log('FormData ready. Sending request...');
      console.log('formdata+++', data?.data?.id);
      // Use `formData` instead of `productData` for the API call
      const response = await posUpdateProduct({
        formData,
        id: id,
      });
      console.log('product updated =========', response);
      if (response?.data?.status === true) {
        setAlertVisible(true);
        
          setLoading(false); // Hide loading indicator
           router.back();
       
      }
    } catch (error) {
      console.error(
        'Error during upload:',
        error?.data?.message || error.message || error,
      );
    }
  };

  // const handleUpload = async productData => {
  //   try {
  //     const formData = new FormData();

  //     // Append basic fields
  //     formData.append('title', productData.title);
  //     formData.append('description', productData.description);
  //     formData.append('price', productData.price);
  //     formData.append('category_id', productData.category_id);
  //     formData.append('condition', productData.condition);
  //     formData.append('weight', productData.weight);
  //     formData.append('is_food', productData.is_food === 'yes' ? 1 : 0);
  //     formData.append('brand', productData.brand);

  //     // Append sub_category_id as an array
  //     productData.sub_category_id.forEach(id => {
  //       formData.append('sub_category_id[]', id);
  //     });

  //     // Append images
  //     if (productData.images && productData.images.length > 0) {
  //       productData.images.forEach(image => {
  //         if (image.uri && image.name && image.type) {
  //           formData.append('images[]', {
  //             uri: image.uri,
  //             name: image.name,
  //             type: image.type,
  //           });
  //         } else {
  //           console.error('Invalid image format:', image);
  //           throw new Error('Invalid image format.');
  //         }
  //       });
  //     }

  //     // Send request with PUT method
  //     console.log('request sending');
  //     const response = await posUpdateProduct({ idd, formData });
  //     console.log('Product updated:', response);

  //     Alert.alert('Success', 'Product updated successfully.');
  //   } catch (error) {
  //     console.error('Error during upload:', error?.response?.data || error.message || error);
  //     Alert.alert('Error', 'Failed to update the product. Please try again.');
  //   }
  // };

  return (
    <View style={tw`bg-white px-[4%] h-full`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <SecondaryHeader navigation={navigation} />

        {/* <ProductEditFields data={data}  id={id} handleUpload={handleUpload} /> */}
        <ProductEditField
          data={data}
          // isLoading={isLoading}
            loading={loading}
          id={id}
          handleUpload={handleUpload}
        />
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        message="Product updated Successfully"
        onClose={closeCustomAlert}
      />
    </View>
  );
};

export default EditProduct;
