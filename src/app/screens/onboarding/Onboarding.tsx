import tw from '@/src/lib/tailwind';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import OnboardItem from './component/OnboardItem';


const Onboarding = ({navigation}: any) => {
  const [currentOnboard, setCurrentOnboard] = useState(1);

  return (
    <View style={tw`px-[4%] py-4 h-full justify-between bg-white`}>
      <View>
        <Text
          style={tw`text-primary text-[28px] text-center mb-4 font-RoboBold`}>
          Petswap
        </Text>
        {currentOnboard === 1 ? (
          <OnboardItem
            item={1}
            title={'Benvenuto su\nPetswap'}
            subTitle={'Fai una foto, carica, vendi, invia. Facile!'}
          />
        ) : currentOnboard === 2 ? (
          <OnboardItem
            item={2}
            title={'Connettiti, acquista e\ncondividi'}
            subTitle={
              'Gli accessori migliori per i tuoi amici pet, tutti a portata di zampa. Scopri, connettiti e condividi con chi ama gli animali come te.'
            }
          />
        ) : (
          <OnboardItem
            item={3}
            title={'Where Pet Dreams\nCome True'}
            subTitle={"Dai nuova vita ai prodotti per animali, risparmia e proteggi l'ambiente."}
          />
        )}
      </View>
      <View style={tw`flex-row items-center gap-4 `}>
        {currentOnboard !== 3 && (
          <TouchableOpacity
            style={tw`bg-offWhite py-2 flex-1 rounded-lg flex-row justify-center items-center`}>
            <Text style={tw`text-title text-base font-RoboMedium`}>Salta</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={tw`bg-primary py-2 flex-1 rounded-lg flex-row justify-center items-center`}
          onPress={() => {
            setCurrentOnboard(currentOnboard + 1);
            currentOnboard === 3 && navigation.navigate('Login');
          }}>
          <Text style={tw`text-white text-base font-RoboMedium`}>
            {currentOnboard === 3 || currentOnboard === 4
              ? 'Inizia'
              : 'Avanti'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;
