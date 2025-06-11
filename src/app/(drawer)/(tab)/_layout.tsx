
import { IconCategoryDark, IconCategoryLight, IconHomeDark, IconHomeLight, IconProductDark, IconProductLight, IconUserDark, IconUserLight } from '@/src/assets/icons/Icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

type Props = {}

const _layout = (props: Props) => {
  return (


    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 45,
                width: 60,
                borderRadius: 20, // makes it circular
                backgroundColor: focused ? "#064145" : "transparent", // apply background color when focused
              }}
            >
              <SvgXml
                xml={focused ? IconHomeLight : IconHomeDark}
                width={24}
                height={24}
                fill={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Categories"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 45,
                width: 60,
                borderRadius: 20, // makes it circular
                backgroundColor: focused ? "#064145" : "transparent", // apply background color when focused
              }}
            >
              <SvgXml
                xml={focused ? IconCategoryLight: IconCategoryDark}
                width={24}
                height={24}
                fill={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="AddProducts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 45,
                width: 60,
                borderRadius: 20, // makes it circular
                backgroundColor: focused ? "#064145" : "transparent", // apply background color when focused
              }}
            >
              <SvgXml
                xml={focused ? IconProductLight: IconProductDark}
                width={24}
                height={24}
                fill={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 45,
                width: 60,
                borderRadius: 20, // makes it circular
                backgroundColor: focused ? "#064145" : "transparent", // apply background color when focused
              }}
            >
              <SvgXml
                xml={focused ? IconUserLight: IconUserDark}
                width={24}
                height={24}
                fill={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>



  )
}

export default _layout

const styles = StyleSheet.create({})