import React, { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Alert, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableHighlight, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { Redirect, router } from 'expo-router';
import ObscuraButton from '@/components/ObscuraButton';
import { BlurView } from 'expo-blur';
import { FontAwesome5 } from '@expo/vector-icons';
import ZoomControls from '@/components/ZoomControls';
import ExposureControls from '@/components/ExposureControls';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = () => {
  const { hasPermission: hasCameraPermission } = useCameraPermission();
  const { hasPermission: hasMicrophonePermission } = useMicrophonePermission();
  const redirectToPermissions = !hasCameraPermission || !hasMicrophonePermission;
  const isActive = useIsFocused();

  const [flash, setFlash] = useState<"off" | "on">("off");
  const [torch, setTorch] = useState<"off" | "on">("off");
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");
  const device = useCameraDevice(cameraPosition);
  const [zoom, setZoom] = useState(device?.neutralZoom);
  const [exposure, setExposure] = useState(0);
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [showExposureControls, setShowExposureControls] = useState(false);
  const camera = useRef<Camera>(null);

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

  useEffect(() => {
    if (!device.hasTorch) setTorch("off");
    if (!device.hasFlash) setFlash("off");
  }, [device]);

  const takePicture = async () => {
    try {
      if (camera.current === null) {
        throw new Error('Camera ref is null');
      }

      console.log('Taking a picture...');

      const photo = await camera.current.takePhoto({
        flash: device.hasFlash ? flash : "off",
        enableShutterSound: false,
      });

      router.push({
        pathname: '/media',
        params: {
          media: photo.path,
          type: 'photo'
        }
      });
    }
    catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while taking the picture.');
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{
          flex: 2,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          <Camera
            ref={camera}
            style={{
              flex: 1,
            }}
            device={device}
            isActive={isActive}
            zoom={zoom}
            resizeMode='cover'
            exposure={exposure}
            torch={device.hasTorch ? torch : "off"}
            photo
          />
          <BlurView
            intensity={100}
            tint='dark'
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: 10,
              width: '50%'
            }}
            experimentalBlurMethod='dimezisBlurView'
          >
            <ThemedText
              style={{
                color: 'white',
                textAlign: 'center'
              }}
            >
              Exposure: {exposure} | Zoom: x{zoom}
            </ThemedText>
          </BlurView>
        </View>

        <View style={{
          flex: 1,
        }}>
          {showZoomControls ? (
            <ZoomControls
              setZoom={setZoom}
              setShowZoomControls={setShowZoomControls}
              zoom={zoom ?? 1}
            />
          ) : showExposureControls ? (
            <ExposureControls
              exposure={exposure}
              setExposure={setExposure}
              setShowExposureControls={setShowExposureControls}
            />
          ) : (
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
                  {' '}
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
                  disabled={!device.hasTorch}
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
                  disabled={!device.hasFlash}
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
                      android: 'content://media/internal/images/media',
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

              <View style={{
                flex: 1.1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
                <ObscuraButton
                  iconSize={40}
                  title='1x'
                  onPress={() => setShowZoomControls(s => !s)}
                  containerStyle={{
                    alignSelf: 'center',
                  }}
                />
                <TouchableHighlight
                  onPress={takePicture}
                >
                  <FontAwesome5
                    name='dot-circle'
                    size={55}
                    color={"white"}
                  />
                </TouchableHighlight>
                <ObscuraButton
                  iconSize={40}
                  title='+/-'
                  onPress={() => setShowExposureControls(s => !s)}
                  containerStyle={{
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
          )}
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