import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { IconBack } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { useGetLegalNoteQuery } from '@/src/redux/api/apiSlice/apiSlice';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { htmlToText } from 'html-to-text';
import { SvgXml } from 'react-native-svg';

const LegalNotes = ({navigation}: any) => {
  const {data, isLoading, isError} = useGetLegalNoteQuery({})
  console.log( data?.data?.data)

  const htmlContent = data?.data?.data || '';
  const plainText = htmlToText(htmlContent, {
    wordwrap: false
  })
  return (
    <View style={tw`flex-1 bg-white px-[4%] pb-4`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View style={tw`flex-row mt-6 items-center border-b border-b-offWhite`}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-3 py-3`}
            onPress={() => router?.back()}>
            <SvgXml xml={IconBack} />
            <Text style={tw`text-title text-base font-RoboMedium`}>
              {/* Note legali */}
              Legal notes
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`mt-8 gap-y-2`}>
          <Text style={tw`text-subT text-base font-RoboNormal`}>
          {plainText}
          </Text>
        </View>
      </ScrollView>
      <StatusBar translucent={false} />
    </View>
  );
};

export default LegalNotes;
