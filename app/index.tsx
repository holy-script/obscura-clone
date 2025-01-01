import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
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
    <ThemedView style={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      padding: 20,
    }}>
      <ThemedText style={{
        textAlign: 'center'
      }}>
        Your back camera is not detected or not present, please use a different device.
      </ThemedText>
    </ThemedView>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{
          flex: 2,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          <Camera
            style={{
              flex: 1,
            }}
            device={device}
            isActive
          />
        </View>

        <View style={{
          flex: 1,
        }}>
          <View style={{
            flex: 0.7,
          }}>
            <ThemedText>
              Max FPS: {device.formats[0].maxFps}
            </ThemedText>
            <ThemedText>
              Width: {device.formats[0].photoWidth}
            </ThemedText>
            <ThemedText>
              Height: {device.formats[0].photoHeight}
            </ThemedText>
            <ThemedText>
              Camera: {device.name}
            </ThemedText>
          </View>

          <View style={{
            flex: 0.7,
          }}>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  }
});