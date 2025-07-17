import { IconCloseEye, IconKey, IconOpenEye } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import InputText from '@/src/components/InputText';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { usePostResetPasswordMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';





const CreateNewPass = () => {
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(true);
  const [isCongratsModalVisible, setIsCongratsModalVisible] = useState(false);
  const [postResetPassword, { isLoading, isError }] = usePostResetPasswordMutation();
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    c_password?: string;
  }>({});

console.log(fieldErrors, "fieldErrors");

  const { email } = useLocalSearchParams();
  // console.log('216', email);

 const handleSumbit = async () => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('c_password', confirmPass);

    const res = await postResetPassword(formData).unwrap();

    if (res?.status === true) {
      setIsCongratsModalVisible(true);
    }
  } catch (error: any) {
    console.log('error from catch', error);
     setFieldErrors(error?.message);

    const errorData = error?.message;
    const errors: { password?: string; c_password?: string } = {};

    if (errorData) {
      if (Array.isArray(errorData.password)) {
        errors.password = errorData.password[0];
      }

      if (Array.isArray(errorData.c_password)) {
        errors.c_password = errorData.c_password[0];
      }
    }

    setFieldErrors(errors);
  }
};



  return (
    <View style={tw`px-[4%] pb-4 bg-white h-full justify-between flex-col`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View style={tw`flex-row items-center justify-center mb-2 mt-4`}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={tw`w-20 h-22`}
          />
        </View>
        <View style={tw``}>
          <Text style={tw`text-primary text-2xl font-RoboMedium`}>
            Create new password
          </Text>
          <Text style={tw`text-subT text-xs font-RoboNormal mb-8`}>
            After reset password you have to create a new password
          </Text>

          <View>
            <InputText
              style={tw`h-10`}
              placeholder={'Enter New password'}
              placeholderColor={'#949494'}
              label={'New Password'}
              iconLeft={IconKey}
              iconRight={isShowPassword ? IconOpenEye : IconCloseEye}
              onChangeText={(text: any) => setPassword(text)}
              isShowPassword={isShowPassword}
              rightIconPress={() => setIsShowPassword(!isShowPassword)}
            />

            {fieldErrors.password && (
              <Text style={tw`text-red-500 text-xs mt-2`}>
                {fieldErrors.password}*
              </Text>
            )}
            <InputText
              style={tw`h-10`}
              placeholder={'Enter Confirm password'}
              placeholderColor={'#949494'}
              label={'Confirm Password'}
              iconLeft={IconKey}
              iconRight={isShowConfirmPassword ? IconOpenEye : IconCloseEye}
              onChangeText={(text: any) => setConfirmPass(text)}
              isShowPassword={isShowConfirmPassword}
              rightIconPress={() =>
                setIsShowConfirmPassword(!isShowConfirmPassword)
              }
            />
            {fieldErrors.c_password && (
              <Text style={tw`text-red-500 text-xs mt-2`}>
                {fieldErrors.c_password}*
              </Text>
            )}
            <Button
              containerStyle={tw`mt-6`}
              title={'Submit'}
              onPress={handleSumbit}
            // onPress={() => {
            //   setIsCongratsModalVisible(true);
            // }}
            />
          </View>
        </View>
        <NormalModal
          layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
          containerStyle={tw`rounded-3xl bg-white p-5`}
          visible={isCongratsModalVisible}
          setVisible={setIsCongratsModalVisible}>
          <View style={tw``}>
            <View style={tw`items-center`}>
              <Image source={require('../../../assets/images/congrats.png')} />
            </View>
            <Text
              style={tw`text-primary text-xl font-RoboBold text-center mt-4`}>
              Congrats!{'\n'}Your Password is Updated
            </Text>
            <Button
              containerStyle={tw`mt-4`}
              title={'Done'}
              onPress={() => {
                setIsCongratsModalVisible(false);
                router.push('/screens/Auth/Login');
              }}
            />
          </View>
        </NormalModal>
      </ScrollView>
    </View>
  );
};

export default CreateNewPass;
