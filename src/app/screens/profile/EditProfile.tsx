// imports...
import {
  IconBack, IconCloseEye, IconEdit, IconKey, IconOpenEye, IconTik
} from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import {
  useGetProfileQuery,
  usePostChangePasswordMutation,
  usePostEditProfileMutation
} from '@/src/redux/api/apiSlice/apiSlice';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const EditProfile = () => {
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState('');
  console.log(generalError, 'generalError');

  const { data: profileData } = useGetProfileQuery({});
  const [postEditProfile] = usePostEditProfileMutation();
  const [postChangePassword] = usePostChangePasswordMutation();

  const handleAccessGallery = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets.map(asset => asset.uri);
      setImageUri(uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', username || profileData?.data?.name);
      formData.append('address', location || profileData?.data?.address);

      if (imageUri?.length > 0) {
        const fileUri = imageUri[0];
        const fileName = fileUri.split('/').pop();
        const fileType = `image/${fileName?.split('.').pop()}`;
        formData.append('image', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
      }

      const response = await postEditProfile(formData).unwrap();
      if (response) setSaveChangesModalVisible(true);
    } catch (error: any) {
      const messages = error?.message || {};
      const parsedErrors: { [key: string]: string } = {};
      Object.keys(messages).forEach((field) => {
        parsedErrors[field] = Array.isArray(messages[field])
          ? messages[field][0]
          : messages[field];
      });
      setFieldErrors(parsedErrors);
    }
  };

  const handleChangePassword = async () => {
    const payload = {
      current_password: oldPassword,
      new_password: newPassword,
      c_password: confirmPassword,
    };

    try {
      const response = await postChangePassword(payload).unwrap();
      setFieldErrors({});
      setGeneralError('');
      setSaveChangesModalVisible(true);
    } catch (error: any) {
  console.log('Raw error:', JSON.stringify(error, null, 2));

  const message = error?.error?.message || error?.message;

  if (typeof message === 'string') {
    setGeneralError(message); // ✅ safe to render
  } else if (typeof message === 'object') {
    // Optional: Convert first field to string message
    const firstKey = Object.keys(message)[0];
    setGeneralError(message[firstKey]);
  } else {
    setGeneralError('Something went wrong. Please try again.');
  }

  // Also set field-specific errors
  const parsedErrors: { [key: string]: string } = {};
  if (typeof message === 'object') {
    Object.keys(message).forEach((field) => {
      parsedErrors[field] = Array.isArray(message[field])
        ? message[field][0]
        : message[field];
    });
    setFieldErrors(parsedErrors);
  }
}

  }
  return (
    <View style={tw`bg-white px-[4%] h-full pb-2`}>
      <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`flex-row items-center py-2`}>
          <TouchableOpacity style={tw`flex-row items-center gap-2`} onPress={() => router.back()}>
            <SvgXml xml={IconBack} />
            <Text style={tw`text-title text-base font-RoboMedium`}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={tw`mt-4 items-center`}>
          <View>
            <Image
              source={{ uri: imageUri?.length ? imageUri[0] : profileData?.data?.avatar }}
              style={tw`h-18 w-18 rounded-full`}
            />
            <TouchableOpacity
              style={tw`absolute bottom-2 right-[-2] bg-primary w-7 h-7 rounded-full items-center justify-center`}
              onPress={handleAccessGallery}>
              <SvgXml xml={IconEdit} height={16} width={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Edit Profile Fields */}
        <View style={tw`mt-4`}>
          <InputText
            style={tw`h-10`}
            placeholder={profileData?.data?.name || 'Enter your name'}
            label={'Your name'}
            value={username || profileData?.data?.name}
            onChangeText={text => setUsername(text)}
          />
          {fieldErrors?.name && <Text style={tw`text-red-500 text-xs`}>{fieldErrors.name}</Text>}

          <InputText
            style={tw`h-10`}
            placeholder={profileData?.data?.address || 'Enter your address'}
            label={'Address'}
            value={location || profileData?.data?.address}
            onChangeText={text => setLocation(text)}
          />
          <Button title="Save changes" containerStyle={tw`flex-1`} onPress={handleSaveProfile} />

          <Text style={tw`text-center text-title text-2xl font-RoboBold my-4`}>
            Update your password.
          </Text>

          {/* Password Fields */}
          <InputText
            style={tw`h-10`}
            placeholder={'Enter your old password'}
            label={'Old password'}
            iconLeft={IconKey}
            iconRight={isShowOldPassword ? IconOpenEye : IconCloseEye}
            isShowPassword={!isShowOldPassword}
            rightIconPress={() => setIsShowOldPassword(!isShowOldPassword)}
            onChangeText={setOldPassword}
          />
          {fieldErrors?.current_password && (
            <Text style={tw`text-xs text-red-500 mt-1`}>{fieldErrors.current_password}</Text>
          )}

          <InputText
            style={tw`h-10`}
            placeholder={'Enter your new password'}
            label={'New password'}
            iconLeft={IconKey}
            iconRight={isShowNewPassword ? IconOpenEye : IconCloseEye}
            isShowPassword={!isShowNewPassword}
            rightIconPress={() => setIsShowNewPassword(!isShowNewPassword)}
            onChangeText={setNewPassword}
          />
          {fieldErrors?.new_password && (
            <Text style={tw`text-xs text-red-500 mt-1`}>{fieldErrors.new_password}</Text>
          )}

          <InputText
            style={tw`h-10`}
            placeholder={'Enter confirm password'}
            label={'Confirm password'}
            iconLeft={IconKey}
            iconRight={isShowConfirmPassword ? IconOpenEye : IconCloseEye}
            isShowPassword={!isShowConfirmPassword}
            rightIconPress={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            onChangeText={setConfirmPassword}
          />
          {fieldErrors?.c_password && (
            <Text style={tw`text-xs text-red-500 mt-1`}>{fieldErrors.c_password}</Text>
          )}

          {/* General Error Fallback */}
          {generalError ? (
            <Text style={tw`text-xs text-red-500 mt-1`}>{generalError}</Text>
          ) : null}

          {/* Save Button */}
          <View style={tw`mt-4 gap-y-4`}>
            <Button title="Save changes" onPress={handleChangePassword} />
          </View>
        </View>

        {/* Success Modal */}
        <NormalModal
          layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
          containerStyle={tw`rounded-xl bg-white p-5`}
          visible={saveChangesModalVisible}
          setVisible={setSaveChangesModalVisible}>
          <View>
            <View style={tw`items-center mb-2`}>
              <SvgXml xml={IconTik} height={60} width={60} />
            </View>
            <Text style={tw`text-center text-title text-2xl font-RoboBold mb-2`}>
              Your profile has been {'\n'}updated
            </Text>
            <Button
              title="Done"
              onPress={() => {
                setSaveChangesModalVisible(false);
                router.back();
              }}
            />
          </View>
        </NormalModal>
      </ScrollView>
    </View>
  );
};

export default EditProfile;
