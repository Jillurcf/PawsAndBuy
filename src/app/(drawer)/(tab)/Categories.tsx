

import { IconBottomArrow, IconTopArrow } from '@/src/assets/icons/Icons';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ExpandableSection } from 'react-native-ui-lib';
import SecondaryHeader from '../../../components/SecondaryHeader';
import tw from '../../../lib/tailwind';
import { useGetCategoryListQuery } from '../../../redux/api/apiSlice/apiSlice';

// const CategoriesData = [
//   {
//     cate: 'Cane',
//     icon: require('../../assets/images/dog-cate-icon.png'),
//     subCate: [
//       {subCate: 'Vedi tutto'},
//       {subCate: 'Abbigliamento e accessori'},
//       {subCate: 'Collari e guinzagli'},
//       {subCate: 'Ciotole e alimentatori'},
//       {subCate: 'Toelettatura'},
//       {subCate: 'Letti e coperte'},
//       {subCate: 'Giochi'},
//       {subCate: 'Accessori per l’addestramento'},
//       {subCate: 'Trasportini e gabbie'},
//     ],
//   },
//   {
//     cate: 'Gatto',
//     icon: require('../../assets/images/cat-cate-icon.png'),
//     subCate: [
//       {subCate: 'Vedi tutto'},
//       {subCate: 'Giochi'},
//       {subCate: 'Letti'},
//       {subCate: 'Abbigliamento e accessori'},
//       {subCate: 'Toelettatura'},
//       {subCate: 'Ciotole e alimentatori'},
//       {subCate: 'Collari e guinzagli'},
//       {subCate: 'Trasportini da viaggio'},
//     ],
//   },
//   {
//     cate: 'Piccoli Animali',
//     icon: require('../../assets/images/rabit-cate-icon.png'),
//     subCate: [
//       {subCate: 'Vedi tutto'},
//       {subCate: 'Giochi'},
//       {subCate: 'Habitat e accessori'},
//     ],
//   },
//   {
//     cate: 'Pesci',
//     icon: require('../../assets/images/fish-cate-icon.png'),
//     subCate: [
//       {subCate: 'Vedi tutto'},
//       {subCate: 'Decorazioni e accessori'},
//       {subCate: 'Attrezzature per acquari'},
//     ],
//   },
//   {
//     cate: 'Uccelli',
//     icon: require('../../assets/images/bird-cate-icon.png'),
//     subCate: [
//       {subCate: 'Vedi tutto'},
//       {subCate: 'Gabbie e accessori'},
//       {subCate: 'Giochi'},
//     ],
//   },
//   {
//     cate: 'Rettili',
//     icon: require('../../assets/images/lizard-cate-icon.png'),
//     subCate: [
//       {subCate: 'Vedi tutto'},
//       {subCate: 'Gabbie e accessori'},
//       {subCate: 'Giochi'},
//     ],
//   },
// ];


const Categories = ({navigation}: any) => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const {data, isLoading, isError}= useGetCategoryListQuery({});
  console.log("86", data?.data?.[0]?.subcategories)

  const handleExpand = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? -1 : index));
  };


  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <ActivityIndicator size="large" color="#064145" />
        <Text style={tw`text-primary mt-2`}>Loading ...</Text>
      </View>
    );
  }

  // if (isError) {
  //   return (
  //     <View style={tw`flex-1 justify-center items-center`}>
  //       <Text style={tw`text-red-500 text-lg`}>Failed to load products.</Text>
  //       <TouchableOpacity
  //         style={tw`mt-4 p-2 bg-[#064145] rounded-lg`}
  //         onPress={() => navigation?.goBack()}>
  //         <Text style={tw`text-white`}>Go Back</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <View style={tw`flex-1 bg-white py-8 px-[4%] h-full`}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <SecondaryHeader navigation={navigation}/>

        <View style={tw`gap-2 p-2 rounded-lg`}>
          {data?.data?.map((item: any, index: number) => {
            const isExpanded = expandedIndex === index;
            return (
              <View
                key={index}
                style={tw`${
                  isExpanded ? 'bg-primary100 rounded-xl' : ''
                } py-1 px-2 `}>
                <ExpandableSection
                  expanded={isExpanded}
                  sectionHeader={
                    <View
                      style={tw`flex-row justify-between items-center my-2`}>
                      <View style={tw`flex-row items-center gap-4`}>
                        <Image width={25} height={25} source={{uri:item?.icon}} />
                        <Text style={tw`text-title text-base font-RoboMedium`}>
                          {item.name}
                        </Text>
                      </View>
                      <SvgXml
                        xml={isExpanded ? IconTopArrow : IconBottomArrow}
                        style={tw`pr-4`}
                      />
                    </View>
                  }
                  onPress={() => handleExpand(index)}>
                  <View style={tw`my-2`}>
                    {item?.subcategories?.map((subCate: any, subIndex: number) => (
                      <TouchableOpacity
                        style={tw`py-2 border-b border-b-primary200`}
                        key={subIndex}
                        onPress={() =>
                          navigation?.navigate('SubCategories', {
                          sub_category_id:subCate?.id,
                            title: subCate?.name,
                          })
                        }>
                        <Text style={tw`text-subT text-sm font-RoboMedium`}>
                          {subCate?.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ExpandableSection>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" backgroundColor={'#4964C6'} translucent={false} />
    </View>
  );
};

export default Categories;
