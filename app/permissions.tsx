import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Camera, CameraPermissionStatus, useCameraPermission, useMicrophonePermission } from "react-native-vision-camera";
import * as ExpoMediLibrary from 'expo-media-library';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ICON_SIZE = 26;

const PermissionsScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<CameraPermissionStatus>('not-determined');
  const [mediaLibraryPermission, requestMediaPermission] = ExpoMediLibrary.usePermissions();

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setCameraPermissionStatus(permission);
  };

  const requestMicrophonePermission = async () => {
    const permission = await Camera.requestMicrophonePermission();
    setMicrophonePermissionStatus(permission);
  };

  const requestMediaLibraryPermission = async () => {
    await requestMediaPermission();
  };

  const handleContinue = () => {
    if (cameraPermissionStatus == 'granted' && microphonePermissionStatus == 'granted' && mediaLibraryPermission?.granted) {
      router.replace('/');
    } else {
      Alert.alert("Please go to settings and enable permissions.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.spacer} />
      <ThemedText type='subtitle' style={styles.subtitle}>
        Obscura needs access to a few permissions in order to work properly.
      </ThemedText>

      <View style={styles.spacer} />

      <View style={styles.row}>
        <Ionicons
          name='lock-closed-outline'
          color={"orange"}
          size={ICON_SIZE}
        />
        <ThemedText style={styles.footnote}>
          Required
        </ThemedText>
      </View>

      <View style={styles.spacer} />

      <View style={StyleSheet.compose(styles.row, styles.permissionContainer)}>
        <View style={styles.row}>
          <Ionicons
            name='camera-outline'
            color={"gray"}
            size={ICON_SIZE}
          />
          <View style={styles.permissionText}>
            <ThemedText type='subtitle'>
              Camera
            </ThemedText>
            <ThemedText>
              Used for taking photos and videos.
            </ThemedText>
          </View>
        </View>
        <Switch
          thumbColor={'white'}
          trackColor={{
            true: 'orange'
          }}
          value={cameraPermissionStatus == "granted"}
          onChange={requestCameraPermission}
        />
      </View>

      <View style={styles.spacer} />

      <View style={StyleSheet.compose(styles.row, styles.permissionContainer)}>
        <View style={styles.row}>
          <Ionicons
            name='mic-circle-outline'
            color={"gray"}
            size={ICON_SIZE}
          />
          <View style={styles.permissionText}>
            <ThemedText type='subtitle'>
              Microphone
            </ThemedText>
            <ThemedText>
              Used for recording video.
            </ThemedText>
          </View>
        </View>
        <Switch
          thumbColor={'white'}
          trackColor={{
            true: 'orange'
          }}
          value={microphonePermissionStatus == 'granted'}
          onChange={requestMicrophonePermission}
        />
      </View>

      <View style={styles.spacer} />

      <View style={StyleSheet.compose(styles.row, styles.permissionContainer)}>
        <View style={styles.row}>
          <Ionicons
            name='library-outline'
            color={"gray"}
            size={ICON_SIZE}
          />
          <View style={styles.permissionText}>
            <ThemedText type='subtitle'>
              Library
            </ThemedText>
            <ThemedText>
              Used for saving, viewing and more.
            </ThemedText>
          </View>
        </View>
        <Switch
          thumbColor={'white'}
          trackColor={{
            true: 'orange'
          }}
          value={mediaLibraryPermission?.granted}
          onChange={requestMediaLibraryPermission}
        />
      </View>

      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <View style={styles.spacer} />

      <TouchableOpacity
        style={StyleSheet.compose(styles.row, styles.continueButton)}
        onPress={handleContinue}
      >
        <Ionicons
          name='arrow-forward-outline'
          color={"white"}
          size={ICON_SIZE}
        />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default PermissionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    textAlign: "center",
  },
  footnote: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  spacer: {
    marginVertical: 8,
  },
  permissionContainer: {
    backgroundColor: "#ffffff20",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  permissionText: {
    marginLeft: 10,
    flexShrink: 1,
  },
  continueButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 50,
    alignSelf: "center",
  },
});