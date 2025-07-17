// screens/TrackingWebView.tsx
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const TrackingWebView: React.FC = () => {
  const { url } = useLocalSearchParams();
  const decodedUrl = decodeURIComponent(url as string);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: decodedUrl }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="blue" />}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
};

export default TrackingWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
