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

import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from '../redux/store';

export default function RootLayout() {
   const [loaded] = useFonts({
    RobotoBlack: require('../assets/fonts/Roboto/Roboto-Black.ttf'),
    RobotoBlackItalic: require('../assets/fonts/Roboto/Roboto-BlackItalic.ttf'),
    RoboMedium: require('../assets/fonts/Roboto/Roboto-Medium.ttf'),
    RobotoBold: require('../assets/fonts/Roboto/Roboto-Bold.ttf'),
    RobotoBoldItalic: require('../assets/fonts/Roboto/Roboto-BoldItalic.ttf'),
    RobotoItalic: require('../assets/fonts/Roboto/Roboto-Italic.ttf'),
    RobotoLight: require('../assets/fonts/Roboto/Roboto-Light.ttf'),
    RobotoMedium: require('../assets/fonts/Roboto/Roboto-Medium.ttf'),
    RobotoRegular: require('../assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  if (!loaded) {

    return null;
  }
  return (
    <GestureHandlerRootView >
      <Provider store={store}>
   <Slot /> 
      </Provider>
   
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
