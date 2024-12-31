import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { Redirect, router } from 'expo-router';

const HomeScreen = () => {
  const { hasPermission: hasCameraPermission } = useCameraPermission();
  const { hasPermission: hasMicrophonePermission } = useMicrophonePermission();
  const redirectToPermissions = !hasCameraPermission || !hasMicrophonePermission;
  const device = useCameraDevice('back');

  if (redirectToPermissions) return (
    <Redirect href={'/permissions'} />
  );

  if (!device) return (
    <ThemedView style={styles.container}>
      <ThemedText style={{
        textAlign: 'center'
      }}>
        Your back camera is not detected or not present, please use a different device.
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText>
        HomeScreen
      </ThemedText>
    </ThemedView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
});