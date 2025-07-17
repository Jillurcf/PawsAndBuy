// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { SvgXml } from 'react-native-svg';
// import { IconTik } from '../assets/icons/Icons';
// import tw from '../lib/tailwind';

// export const CustomAlert = ({ visible, message, onClose }: any) => {
//   const navigation = useNavigation();
//   const handleClose = () => {
//     onClose();
//     // navigation.goBack(); // Navigate back to the previous screen
//   }
//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>

//         <View style={styles.modalContainer}>
//           <View style={tw`items-center`}>
//             {/* <Image source={require('../assets/images/congrats.png')} /> */}
//             <SvgXml xml={IconTik} width={64} height={64} />
//           </View>
//           <Text style={styles.message}>{message}</Text>
//           <TouchableOpacity style={styles.button} onPress={handleClose}>
//             <Text style={styles.buttonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: '80%',
//   },
//   message: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#064145',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { IconTik } from '../assets/icons/Icons';
import tw from '../lib/tailwind';

interface CustomAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  message,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handleClose = () => {
    onClose();
    // navigation.goBack(); // Optional: uncomment to go back
  };

  const styles = getStyles(colorScheme);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={tw`items-center`}>
            <SvgXml xml={IconTik} width={64} height={64} />
          </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Dynamic styles based on light/dark mode
const getStyles = (colorScheme: string | null) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        colorScheme === 'dark'
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#FFFFFF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
      shadowColor: colorScheme === 'dark' ? '#000' : '#ccc',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    message: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    },
    button: {
      backgroundColor: colorScheme === 'dark' ? '#0a7a74' : '#064145',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });

