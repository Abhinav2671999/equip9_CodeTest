import React, { useState } from 'react';
import { View, Image, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius 
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = R * c; // Distanceee in km
  const distanceInMiles = distanceInKm * 0.621; // Convert distance to miles
  return { km: distanceInKm.toFixed(2), miles: distanceInMiles.toFixed(2) };
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function Screen3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedImageUri, latitude: initialLatitude, longitude: initialLongitude } = route.params;
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [distance, setDistance] = useState('');

  const Calculate = () => {
    if (initialLatitude && initialLongitude && latitude && longitude) {
      const distances = calculateDistance(
        parseFloat(initialLatitude),
        parseFloat(initialLongitude),
        parseFloat(latitude),
        parseFloat(longitude)
      );
      setDistance(`${distances.km} km (${distances.miles} miles)`);
    } else {
      setDistance('Invalid coordinates');
    }
  };

  const handlePrevious = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      {selectedImageUri ? (
        <View style={styles.card}>
          <Text style={styles.title}>My Uploaded Pic</Text>
          <Image source={{ uri: selectedImageUri }} style={styles.image} />
        </View>
      ) : null}
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
        <Button title="Calculate" onPress={Calculate} color="#3498db" />
        <Text style={styles.distanceText}>{distance}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Previous" onPress={handlePrevious} color="#27ae60" />
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
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#27ae60',
  },
  buttonsContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

export default Screen3;
