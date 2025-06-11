

import { IconBack, IconHomeLight, IconLogout } from '@/src/assets/icons/Icons';
import tw from '@/src/lib/tailwind';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

export default function DrawerLayout() {
  const handleLogout = () => {
    // Perform your logout logic here
    console.log('Logout pressed');
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
          fontSize: 20,
        },
      }}
      drawerContent={(props) => (
        <View style={tw`flex-1`}>
          {/* Scrollable Drawer Content */}
          <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={tw`flex-1`}>
              {/* 🔙 Back Icon at Top Right */}
              <View style={tw`flex-row justify-end px-4 py-2`}>
                <TouchableOpacity
                  onPress={() => props.navigation.closeDrawer()}
                  style={tw` w-10 h-10 items-center justify-center rounded-full`}
                >
                  <SvgXml xml={IconBack} width={20} height={20} />
                </TouchableOpacity>
              </View>

              {/* 📋 Drawer Items */}
              <DrawerItemList {...props} />
            </View>
          </DrawerContentScrollView>

          {/* 🚪 Logout Button at Bottom Left */}
          <View style={tw`px-4 py-4`}>
            <TouchableOpacity style={tw`flex-row gap-4 px-4`} onPress={handleLogout}>
             <SvgXml xml={IconLogout}/>
              <Text style={tw`text-white text-base font-AvenirLTProHeavy`}>Logout</Text>
            </TouchableOpacity>
          </View>
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
          title: 'Home',
          drawerIcon: ({ color }) => (
            <SvgXml xml={IconHomeLight} width={24} height={24} fill={color} />
          ),
        }}
      />
       
    </Drawer>
  );
}
