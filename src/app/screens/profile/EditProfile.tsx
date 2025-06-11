// 

import { IconBack, IconCloseEye, IconEdit, IconKey, IconOpenEye, IconTik } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { useGetProfileQuery, usePostChangePasswordMutation, usePostEditProfileMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { launchImageLibraryAsync } from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

// import {launchImageLibrary} from 'react-native-image-picker';


const EditProfile = ({navigation}: any) => {
  // State declarations
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [imageUri, setImageUri] = useState<any>(null);
  const [saveChangesModalVisible, setSaveChangesModalVisible] = useState(false);
console.log("38", imageUri)
  // API hooks
  const {data: profileData, isLoading, isError} = useGetProfileQuery();
  const [postEditProfile] = usePostEditProfileMutation();
  const [postChangePassword] = usePostChangePasswordMutation();

  // Log profile data for debugging
  console.log('ProfileData', oldPassword, newPassword, confirmPassword);

  // Form data
  const data = {
    name: username,
    address: location,
    image: imageUri,
  };

  // console.log('Form Data:', data);

  // Handle image picker
  const handleAccessGallery = () => {
    launchImageLibraryAsync(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled gallery picker');
        } else if (response.errorCode) {
          console.error('Gallery Error:', response.errorMessage);
        } else if (response.assets) {
          const uri = response.assets.map(asset => asset.uri);
          setImageUri(uri);
        }
      },
    );
  };

  // console.log('Selected Image URI:', imageUri);

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
  
      // Add name and address to FormData
      formData.append('name', username || profileData?.data?.name);
      formData.append('address', location || profileData?.data?.address);
  
      // Add image to FormData (if available)
      if (imageUri && imageUri.length > 0) {
        const fileUri = imageUri[0]; // Assuming single image
        const fileName = fileUri.split('/').pop();
        const fileType = `image/${fileName?.split('.').pop()}`;
        formData.append('image', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
      }
  
      console.log('Form Data:', formData);
  
      const response = await postEditProfile(formData).unwrap();
      console.log('Profile Updated Successfully:', response);
  
      if (response) {
        setSaveChangesModalVisible(true);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };
  
  // handle password
  const handleChangePassword = async () => {
    console.log("click");
  
    // Prepare the payload
    const payload = {
      current_password: oldPassword,
      new_password: newPassword,
      c_password: confirmPassword,
    };
  
    console.log("updatePassword", payload);
  
    try {
      // Call the mutation directly with the payload
      const response = await postChangePassword(payload).unwrap();
  
      console.log("change password", response);
  
      // Show success modal
      setSaveChangesModalVisible(true);
    } catch (error) {
      // Handle errors
      console.log("Error changing password:", error);
  
      if (error?.data?.message) {
        console.error("Validation errors:", error.data.message);
      }
    }
  };
  

  return (
    <View style={tw`bg-white px-[4%] h-full pb-2`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`flex-row items-center py-2`}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-2`}
            onPress={() => navigation.goBack()}>
            <SvgXml xml={IconBack} />
            <Text style={tw`text-title text-base font-RoboMedium`}>Profilo</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={tw`mt-4 items-center`}>
          <View>
            <Image
            
              source={{uri: imageUri?.length ? imageUri[0] : profileData?.data?.avatar}}
              style={tw`h-18 w-18 rounded-full`}
            />
            <TouchableOpacity
              style={tw`absolute bottom-2 right-[-2] bg-primary w-7 h-7 rounded-full flex-row items-center justify-center gap-1`}
              onPress={handleAccessGallery}>
              <SvgXml xml={IconEdit} height={16} width={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Inputs */}
        <View style={tw`mt-4`}>
          <InputText
            placeholder={profileData?.data?.name || 'Entra con il nome'}
            placeholderColor={'#949494'}
            label={'Your name'}
            // {'Il tuo nome'}
            onChangeText={text => setUsername(text)}
          />
          <InputText
            placeholder={profileData?.data?.address || 'Inserisci la tua posizione'}
            placeholderColor={'#949494'}
            label={'Address'}
            // {'Posizione'}
            onChangeText={text => setLocation(text)}
          />
          <Button
            title="Save changes."
            // "Salva modifiche"
            containerStyle={tw`flex-1`}
            onPress={handleSaveProfile}
          />

          {/* Password Update Section */}
          <Text style={tw`text-center text-title text-2xl font-RoboBold my-4`}>
            {/* Aggiorna la tua password */}
            Update your password.
          </Text>
          <InputText
            placeholder={'Enter your old password'}
            // {'Inserisci la tua vecchia password'}
            placeholderColor={'#949494'}
            label={'Old password'}
            // {'Vecchia password'}
            iconLeft={IconKey}
            iconRight={isShowOldPassword ? IconOpenEye : IconCloseEye}
            isShowPassword={!isShowOldPassword}
            rightIconPress={() => setIsShowOldPassword(!isShowOldPassword)}
            onChangeText={text => setOldPassword(text)}
          />
          <InputText
            placeholder={'Enter your new password'}
            // {'Inserisci la tua nuova password'}
            placeholderColor={'#949494'}
            label={'New password'}
            // {'Nuova password'}
            iconLeft={IconKey}
            iconRight={isShowNewPassword ? IconOpenEye : IconCloseEye}
            isShowPassword={!isShowNewPassword}
            rightIconPress={() => setIsShowNewPassword(!isShowNewPassword)}
            onChangeText={text => setNewPassword(text)}
          />
          <InputText
            placeholder={'Enter confirm password'}
            // {'Inserisci la tua password di conferma'}
            placeholderColor={'#949494'}
            label={'Confirm password'}
            // {'Conferma la password'}
            iconLeft={IconKey}
            iconRight={isShowConfirmPassword ? IconOpenEye : IconCloseEye}
            isShowPassword={!isShowConfirmPassword}
            rightIconPress={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>

        {/* Save Button */}
        <View style={tw`mt-4 gap-y-4`}>
          <Button
            title="Save changes"
            // "Salva modifiche"
            containerStyle={tw``}
            onPress={handleChangePassword}
            // onPress={() => setSaveChangesModalVisible(true)}
          />
        </View>

        {/* Save Changes Modal */}
        <NormalModal
          layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
          containerStyle={tw`rounded-xl bg-white p-5`}
          visible={saveChangesModalVisible}
          setVisible={setSaveChangesModalVisible}>
          <View>
            <View style={tw`items-center mb-2`}>
              <SvgXml xml={IconTik} height={60} width={60} />
            </View>
            <Text
              style={tw`text-center text-title text-2xl font-RoboBold mb-2`}>
              Your profile has been {'\n'}updated
            </Text>
            <Button
              title="Done"
              onPress={() => {
                setSaveChangesModalVisible(false);
                navigation.goBack();
              }}
            />
          </View>
        </NormalModal>
      </ScrollView>
    </View>
  );
};

export default EditProfile;
