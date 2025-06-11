import { IconBack } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import { CustomAlert } from '@/src/components/CustomAlert';
import InputText from '@/src/components/InputText';
import tw from '@/src/lib/tailwind';
import { usePostHelpCenterMutation } from '@/src/redux/api/apiSlice/apiSlice';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';


const HelpSupport = ({navigation}: any) => {
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [postHelpCenter, {isLoading, isError}] = usePostHelpCenterMutation();

  const [alertVisible, setAlertVisible] = useState(false);

  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  const handleSend = async () => {
    console.log('click');
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('description', desc);
      console.log('formdata sending', formData);
      const res = await postHelpCenter(formData).unwrap();
      console.log(res);
      if (res) {
        setAlertVisible(true);
      }
    } catch (error) {
      console.log(error);
      console.log('Please send again', error);
    }
  };

  // if (isLoading) {
  //   return (
  //     <View style={tw`flex-1 justify-center items-center`}>
  //       <ActivityIndicator size="large" color="#064145" />
  //       <Text style={tw`text-primary mt-2`}>Loading ...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={tw`h-full bg-white px-[4%] pb-4`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View style={tw`flex-row items-center border-b border-b-offWhite`}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-3 py-3`}
            onPress={() => navigation?.goBack()}>
            <SvgXml xml={IconBack} />
            <Text style={tw`text-title text-base font-RoboMedium`}>
              {/* Centro assistenza */}
              Help center
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`mt-8 gap-y-2`}>
          <InputText
            placeholder={"Enter the product title"}
            // {'Inserisci il titolo del prodotto'}
            placeholderColor={'#949494'}
            label={'Title'}
            onChangeText={(text: any) => setSubject(text)}
          />

          <InputText
            placeholder={"Enter the product description"}
            // {'Inserisci la descrizione del prodotto'}
            placeholderColor={'#949494'}
            label={"Describe your product"}
            // {'Descrivi il tuo prodotto'}
            onChangeText={(text: any) => setDesc(text)}
            style={tw`h-18`}
            placeholderAlignment={'top'}
          />
        </View>
      </ScrollView>
      <Button onPress={handleSend} title="Send" />
      <CustomAlert
        visible={alertVisible}
        message="Message sent"
        onClose={closeCustomAlert}
      />
    </View>
  );
};

export default HelpSupport;
