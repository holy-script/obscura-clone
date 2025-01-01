import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Link, router, useLocalSearchParams } from 'expo-router';
import ObscuraButton from '@/components/ObscuraButton';
import { saveToLibraryAsync } from 'expo-media-library';
import { ThemedText } from '@/components/ThemedText';

const MediaScreen = () => {
  console.log('MediaScreen');
  const { media, type } = useLocalSearchParams();

  console.log(media, type);

  return (
    <ThemedView style={styles.container}>
      {
        type === "photo" ? (
          <Image
            source={{ uri: `file://${media}` }}
            style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
          />
        ) : null
      }
      <ObscuraButton
        title='Save to gallery'
        containerStyle={{ alignSelf: 'center' }}
        onPress={async () => {
          saveToLibraryAsync(media as string);
          Alert.alert('Saved to gallery!');
          router.back();
        }}
      />
      <Link href={'/'} style={styles.link}>
        <ThemedText type='link'>
          Delete and go back
        </ThemedText>
      </Link>
    </ThemedView>
  );
};

export default MediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    alignSelf: "center",
  },
});