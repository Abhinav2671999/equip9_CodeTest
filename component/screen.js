import React, { useState } from 'react';
import { View, Button, Image, Text,SafeAreaView, StyleSheet, } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { RNS3 } from 'react-native-aws3';
import { useNavigation } from '@react-navigation/native';

const config = {
  keyPrefix: 'myphoto/',
  bucket: 'equip9-testing',
  region: 'ap-south-1',
  accessKey: 'AKIA3KZVK3RM6V72UAHV',
  secretKey: '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',
  successActionStatus: 201,
};

function Screen() {
  const [clickimageUri, setclickImageUri] = useState('');
  const [pickimageUri, setpickImageUri] = useState('');
  const navigation = useNavigation();
  const [selectedImageUri, setSelectedImageUri] = useState('');

  const [filePath, setFilePath] = useState({});
  const [imageUri, setImageUri] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  function openCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image.path);
      console.log(image, 'as');
      setclickImageUri(image.path);
      NextScreenImage(image.path);
      uploadImage(image.path);
    }).catch(error => {
      console.log(error.message);
    });
  }

  function openPicker() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image.path);
      setpickImageUri(image.path);
      NextScreenImage(image.path);
      uploadImage(image.path);
    });
  }

  function NextScreenImage(image) {
    console.log('hgfghfhjgjhg', image);
    setSelectedImageUri(image);

  }


  async function uploadImage(imageUri) {
    try {
      const randomNumber = Math.floor(Math.random() * 1000000);
      const imageName = `image_${randomNumber}.jpg`;
      
      const s3file = {
        uri: imageUri,
        name: imageName,
        type: 'image/jpeg',
      };

      // Set ACL to 'private' to upload the image to private bucket
      const options = {
        ...config,
        keyPrefix: `${config.keyPrefix}`,
        acl: 'private',
        contentType: 'image/jpeg',
      };

      // Generate a pre-signed URL  S3 bucket
      const signedUrl = await RNS3.put(s3file, options);
      console.log('111', signedUrl);

      if (signedUrl.status !== 201) {
        console.error('Failed to get pre-signed URL:', signedUrl);
        return;
      }

      // Usegenerated signed URL to upload the image to S3
      const response = await fetch(signedUrl.body.postResponse.location, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: {
          uri: imageUri,
          name: imageName,
          type: 'image/jpeg',
        },
      });
      console.log(response, "222");
      if (!response.ok) {
        console.log('Upload successful!');
      } else {
        console.error('Failed to upload image:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  function navigateToScreen2() {
    navigation.navigate('Screen2', { selectedImageUri });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Button title="Click Photo" onPress={openCamera} color="#3498db" />
        {clickimageUri ? <Image source={{ uri: clickimageUri }} style={styles.image} /> : null}
      </View>
      <View style={styles.card}>
        <Button title="Pick Image" onPress={openPicker} color="#3498db" />
        {pickimageUri ? <Image source={{ uri: pickimageUri }} style={styles.image} /> : null}
      </View>
      {selectedImageUri ? (
        <View style={styles.card}>
          <Button title="Go to Screen 2" onPress={navigateToScreen2} color="#27ae60" />
        </View>
      ) : null}
      {uploadSuccessMessage ? (
        <Text style={styles.uploadMessage}>
          {uploadSuccessMessage}
        </Text>
      ) : null}
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
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  uploadMessage: {
    padding: 10,
    color: 'green',
  },
});

export default Screen;