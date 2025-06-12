

import { IconLogout } from '@/src/assets/icons/Icons';
import Button from '@/src/components/Button';
import NormalModal from '@/src/components/NormalModal';
import tw from '@/src/lib/tailwind';
import { usePostLogOutMutation } from '@/src/redux/api/apiSlice/apiSlice';
import { getStorageToken, removeStorageToken } from '@/src/utils/Utils';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

export default function DrawerLayout() {
  const [postLogOut, { isLoading, isError }] = usePostLogOutMutation();
  const [logoutConfirmationModalVisible, setLogoutConfirmationModalVisible] =
    useState(false);
  const handleLogout = async () => {
    try {
      const token = getStorageToken();
      console.log("token", token)
      // Trigger your logout API call
      const response = await postLogOut(token);
      console.log('Logout API Response:', response);
      removeStorageToken()
      // Sign out the user using GoogleSignin
      // await GoogleSignin.signOut();
      console.log('Google Signout Successful');

      // Log success message
      console.log('User signed out successfully');

      // Navigate to the Login screen
      router?.replace('/screens/Auth/Login');

      // Close the logout confirmation modal
      setLogoutConfirmationModalVisible(false);
    } catch (error) {
      // Handle errors
      console.error('Error signing out:', error);
    }
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: 'white',
          // marginTop: 20,
        },
        drawerLabelStyle: {
          color: 'black',
          fontSize: 15,
          marginTop: 0
        },
      }}
      drawerContent={(props) => (
        <View style={tw`flex-1`}>
          {/* Scrollable Drawer Content */}
          <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={tw`flex-1`}>
              {/* 🔙 Back Icon at Top Right */}
              {/* <View style={tw`flex-row justify-end px-4 py-2`}>
                <TouchableOpacity
                  onPress={() => props.navigation.closeDrawer()}
                  style={tw` w-10 h-10 items-center justify-center rounded-full`}
                >
                  <SvgXml xml={IconBack} width={20} height={20} />
                </TouchableOpacity>
              </View> */}
              <View style={tw`flex-row items-center justify-center`}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={tw`h-22 w-20`}
                />
              </View>
              {/* 📋 Drawer Items */}
              <DrawerItemList {...props} />

            </View>
          </DrawerContentScrollView>

          {/* 🚪 Logout Button at Bottom Left */}
          <View style={tw`px-4 mb-20 flex-row items-center justify-start`}>
            <TouchableOpacity style={tw` px-4`} onPress={() => setLogoutConfirmationModalVisible(true)}>
              <SvgXml xml={IconLogout} />

            </TouchableOpacity>
            <Text style={tw`text-black text-base font-AvenirLTProHeavy`}>Logout</Text>
          </View>
          <NormalModal
            layerContainerStyle={tw`flex-1 justify-center items-center mx-5`}
            containerStyle={tw`rounded-xl bg-white p-5`}
            visible={logoutConfirmationModalVisible}
            setVisible={setLogoutConfirmationModalVisible}>
            <View>
              <Text style={tw`text-title text-2xl text-center font-RoboBold mb-2`}>
                {/* Sei sicuro di voler {'\n'}uscire? */}
                Are you sure {'\n'}you want to exit?
              </Text>

              <View style={tw`mt-2 gap-y-2 flex-row items-center gap-2`}>
                <Button
                  title='Exit'
                  // "Esci"
                  containerStyle={tw`flex-1`}
                  onPress={handleLogout}
                // onPress={() => {
                //   navigation?.navigate('Login');
                //   setLogoutConfirmationModalVisible(false);
                // }}
                />
                <Button
                  title="Cancel"
                  // "Cancellare"
                  containerStyle={tw`bg-transparent border border-primary flex-1`}
                  style={tw`text-primary`}
                  onPress={() => {
                    setLogoutConfirmationModalVisible(false);
                  }}
                />
              </View>
            </View>
          </NormalModal>
        </View>
      )}
    >
      <Drawer.Screen
        name="(tab)"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="MyOrder"
        options={{
          title: 'My orders',
          // drawerIcon: ({ color }) => (
          //   <SvgXml xml={IconHomeLight} width={24} height={24} fill={color} />
          // ),
        }}
      />
      <Drawer.Screen
        name="SellOrder"
        options={{
          title: 'Sell orders',
          // drawerIcon: ({ color }) => (
          //   <SvgXml xml={IconHomeLight} width={24} height={24} fill={color} />
          // ),
        }}
      />
      <Drawer.Screen
        name="Wishlist"
        options={{
          title: 'Wishlist',

        }}
      />
      <Drawer.Screen
        name="Faq"
        options={{
          title: 'FAQ',
          // drawerIcon: ({ color }) => (
          //   <SvgXml xml={IconHomeLight} width={24} height={24} fill={color} />
          // ),
        }}
      />
      <Drawer.Screen
        name='TermsCondition'
        options={{
          title: 'Terms & Conditions',
        }} />
      <Drawer.Screen
        name='LegalNotes'
        options={{
          title: 'Legal Notes',
        }} />
      <Drawer.Screen
        name='OurPlatform'
        options={{
          title: 'Our Platform',
        }} />
      <Drawer.Screen
        name='HelpSupport'
        options={{
          title: 'Help center',
        }} />

    </Drawer>
  );
}
