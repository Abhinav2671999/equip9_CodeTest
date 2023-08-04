import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { S3 } from 'aws-sdk';
import fs from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const config = {
  keyPrefix: 'Index/',
  bucket: "equip9-testing",
  region: "ap-south-1",
  accessKey: "YOUR_ACCESS_KEY",
  secretKey: "YOUR_SECRET_KEY",
  successActionStatus: 201,
};

function Screen() {
  const [clickimageUri, setclickImageUri] = useState('');
  const [pickimageUri, setpickImageUri] = useState('');
  const navigation = useNavigation();
  const [selectedImageUri, setSelectedImageUri] = useState('');

  const [filePath, setFilePath] = useState({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  const openCamera = () => {
    // ... (same code as before)
  };

  const openPicker = () => {
    // ... (same code as before)
  };

  const NextScreenImage = (image) => {
    // ... (same code as before)
  };

  const uploadImage = async (filePath) => {
    if (Object.keys(filePath).length === 0) {
      alert('Please select an image first');
      return;
    }
    const imagePath = filePath.replace('file:///', '');
    const randomNumber = Math.floor(Math.random() * 1000000);
    const imageName = `image_${randomNumber}.jpg`;

    try {
      const s3 = new S3({
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
        region: config.region,
      });

      const uploadResponse = await s3.upload({
        Bucket: config.bucket,
        Key: imageName,
        Body: fs.createReadStream(imagePath),
        ContentType: 'image/jpeg',
      }).promise();

      const imageUrl = s3.getSignedUrl('getObject', {
        Bucket: config.bucket,
        Key: imageName,
        Expires: 3600, // URL expires in 1 hour (adjust as needed)
      });

      setUploadSuccessMessage(
        `Uploaded Successfully!\nImage URL: ${imageUrl}`
      );

      // Call your detectFaces function here using the uploaded image URL (imageUrl)
      // detectFaces(imageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToScreen2 = () => {
    // ... (same code as before)
  };

  return (
    <View>
      <Button title="click photo" onPress={openCamera} />
      {/* ... (same code as before) */}
    </View>
  );
}

export default Screen;
