import React, { useState } from 'react';
import { View, Image, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function Screen2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedImageUri } = route.params;
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const navigateToScreen3 = () => {
    navigation.navigate('Screen3', {
      selectedImageUri,
      latitude,
      longitude,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {selectedImageUri ? (
          <>
            <Text style={styles.title}>My Uploaded Pic</Text>
            <Image source={{ uri: selectedImageUri }} style={styles.image} />
          </>
        ) : null}
      </View>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
        />
        <View style={styles.buttonContainer}>
          <Button title="Next" onPress={navigateToScreen3} color="#3498db" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
});

export default Screen2;
