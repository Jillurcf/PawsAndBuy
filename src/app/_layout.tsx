// import { Stack } from "expo-router";
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { StyleSheet } from 'react-native';
// // import './global.css';

// export default function RootLayout() {
//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <Stack
//         initialRouteName="index"
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="screens/auth/onboarding1" options={{ headerShown: false }} />
//         <Stack.Screen name="screens/auth/login" options={{ headerShown: false }} />
//         <Stack.Screen name="screens/auth/verifyScreen" options={{ headerShown: false }} />
//       </Stack>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import tw from '../lib/tailwind';
import store from '../redux/store';

export default function RootLayout() {
  const [loaded] = useFonts({
    RoboBlack: require('../assets/fonts/Roboto/Roboto-Black.ttf'),
    RoboBlackItalic: require('../assets/fonts/Roboto/Roboto-BlackItalic.ttf'),
    RoboMedium: require('../assets/fonts/Roboto/Roboto-Medium.ttf'),
    RoboBold: require('../assets/fonts/Roboto/Roboto-Bold.ttf'),
    RoboBoldItalic: require('../assets/fonts/Roboto/Roboto-BoldItalic.ttf'),
    RoboItalic: require('../assets/fonts/Roboto/Roboto-Italic.ttf'),
    RoboLight: require('../assets/fonts/Roboto/Roboto-Light.ttf'),
    RoboRegular: require('../assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  if (!loaded) {

    return null;
  }
  // return (
  //   <StripeProvider publishableKey="pk_test_51QKAtBKOpUtqOuW1x5VdNqH3vG7CZZl1P6V3VuV1qsRUmPLNk26i34AXeu2zCO3QurFJAOZ9zfb0EkWeCVhqBYgH008X41cXr6">
  //     <SafeAreaView style={tw`flex-1`}>
  //       <GestureHandlerRootView >
  //         <Provider store={store}>
  //           <Slot />
  //         </Provider>

  //       </GestureHandlerRootView>
  //     </SafeAreaView>
  //   </StripeProvider>

  // );
  return (
    <StripeProvider publishableKey="pk_test_51QKAtBKOpUtqOuW1x5VdNqH3vG7CZZl1P6V3VuV1qsRUmPLNk26i34AXeu2zCO3QurFJAOZ9zfb0EkWeCVhqBYgH008X41cXr6">
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={tw`flex-1`}>
            <Slot />
          </SafeAreaView>
        </GestureHandlerRootView>
      </Provider>
    </StripeProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
