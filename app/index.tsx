import React, { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Linking, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { Redirect, router } from 'expo-router';
import ObscuraButton from '@/components/ObscuraButton';

const HomeScreen = () => {
  const { hasPermission: hasCameraPermission } = useCameraPermission();
  const { hasPermission: hasMicrophonePermission } = useMicrophonePermission();
  const redirectToPermissions = !hasCameraPermission || !hasMicrophonePermission;

  const [flash, setFlash] = useState<"off" | "on">("off");
  const [torch, setTorch] = useState<"off" | "on">("off");
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");
  const device = useCameraDevice(cameraPosition);
  const [zoom, setZoom] = useState(device?.neutralZoom);
  const [exposure, setExposure] = useState(0);

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
            zoom={zoom}
            resizeMode='cover'
            exposure={exposure}
            torch={torch}
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
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
            <ObscuraButton
              iconName={
                torch === "on" ?
                  "flashlight" : "flashlight-outline"
              }
              onPress={() => {
                setTorch(t => (t === "on" ? "off" : "on"));
              }}
              containerStyle={{
                alignSelf: 'center',
              }}
            />
            <ObscuraButton
              iconName={
                flash === "on" ?
                  "flash-outline" : "flash-off-outline"
              }
              onPress={() => {
                setFlash(f => (f === "on" ? "off" : "on"));
              }}
              containerStyle={{
                alignSelf: 'center',
              }}
            />
            <ObscuraButton
              iconName='camera-reverse-outline'
              onPress={() => {
                setCameraPosition(p => (p === "back" ? "front" : "back"));
              }}
              containerStyle={{
                alignSelf: 'center',
              }}
            />
            <ObscuraButton
              iconName='image-outline'
              onPress={() => {
                const link = Platform.select({
                  ios: 'photos-redirect://',
                  android: 'content://media/external/images/media',
                });
                if (link) Linking.openURL(link);
              }}
              containerStyle={{
                alignSelf: 'center',
              }}
            />
            <ObscuraButton
              iconName='settings-outline'
              onPress={() => router.push('/_sitemap')}
              containerStyle={{
                alignSelf: 'center',
              }}
            />
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