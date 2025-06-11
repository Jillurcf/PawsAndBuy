import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ExpandableSection } from 'react-native-ui-lib';

import { IconBack, IconBottomArrow, IconFaq, IconTopArrow } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { useGetFaqQuery } from '@/src/redux/api/apiSlice/apiSlice';
import { SvgXml } from 'react-native-svg';



const Faq = ({navigation}) => {
  // Use a state to track which item is expanded
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const {data, isLoading, isError} = useGetFaqQuery({});
console.log(data)
  // Sample data for FAQs
  const faqs = [...Array(10)].map((_, index) => ({
    question: `What is the purpose of this app? #${index + 1}`,
    answer: `This app allows users to transfer funds between wallets securely and efficiently. It simplifies peer-to-peer financial transactions with minimal fees and maximum security. (Domande frequenti #${
      index + 1
    })`,
  }));

  // if (isLoading) {
  //   return (
  //     <View style={tw`flex-1 justify-center items-center`}>
  //       <ActivityIndicator size="large" color="#064145" />
  //       <Text style={tw`text-primary mt-2`}>Loading ....</Text>
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
          onPress={()=> navigation?.goBack()}
          style={tw`flex-row items-center gap-3 py-3`}>
            <SvgXml xml={IconBack} />
            <Text style={tw`text-title text-base font-RoboMedium`}>
            Frequently Asked Questions
              {/* Domande frequenti */}
              </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`mt-8 gap-y-2`}>
          {data?.data.map((faq, index) => (
            <ExpandableSection
              key={index}
              expanded={expandedIndex === index}
              sectionHeader={
                <TouchableOpacity
                  style={tw`flex-row justify-between items-center p-2 rounded-xl bg-primary100`}
                  onPress={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }>
                  <View style={tw`flex-row items-center gap-4`}>
                    <SvgXml xml={IconFaq} />
                    <Text style={tw`text-title font-RoboMedium text-base`}>
                      {faq?.question}
                    </Text>
                  </View>
                  <SvgXml
                    xml={
                      expandedIndex === index ? IconTopArrow : IconBottomArrow
                    }
                    style={tw`pr-4`}
                  />
                </TouchableOpacity>
              }>
              <View style={tw`my-2`}>
                <Text style={tw`text-subT font-RoboNormal text-sm`}>
                  {faq.answer}
                </Text>
              </View>
            </ExpandableSection>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Faq;
