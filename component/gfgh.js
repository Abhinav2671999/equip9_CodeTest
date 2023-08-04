import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { RNS3 } from 'react-native-aws3';
import { v4 as uuid } from 'uuid';

const config = {
  keyPrefix: 'myphoto/',
  bucket: 'equip9-testing',
  region: 'ap-south-1',
  accessKey: 'AKIA3KZVK3RM6V72UAHV',
  secretKey: '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',
  successActionStatus: 201,
};

function S3Upload() {
  const [imageUri, setImageUri] = useState('');
  const [faces, setFaces] = useState(null);

  function chooseImage() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setImageUri(image.path);
      uploadImage(image.path);
    });
  }

  async function uploadImage(imageUri) {
    try {
      const imageName = `${uuid()}.jpg`;
      const s3file = {
        uri: imageUri,
        name: imageName,
        type: 'image/jpeg',
      };

      // Set ACL to 'private' to upload the image to a private bucket
      const options = {
        ...config,
        keyPrefix: `${config.keyPrefix}`,
        acl: 'private',
        contentType: 'image/jpeg',
      };

      // Generate a pre-signed URL for the S3 bucket
      const signedUrl = await RNS3.put(s3file, options);
      console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',signedUrl);

      if (signedUrl.status !== 201) {
        console.error('Failed to get pre-signed URL:', signedUrl);
        return;
      }

      // Use the generated signed URL to upload the image to S3
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
console.log(response,"222222222222222222222222222222222222222222222222");
      if ( ! response.ok ) {
        console.log('Upload successful!');
      } else {
        console.error('Failed to upload image:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  // Rest of the code remains the same

  return (
    <View style={styles.MainContainer}>
        <ScrollView>
            <TouchableOpacity style={{ elevation: 8, backgroundColor: "blue", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 }} onPress={chooseImage}>
                <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold", alignSelf: "center", textTransform: "uppercase" }}>Verify</Text>
            </TouchableOpacity>
            {imageUri ? <Image source={{ uri: imageUri }} style={{ marginTop: 10, width: 300, height: 300, alignSelf: "center", borderRadius: 10 }} /> : null}
            {faces === null ? (
                <View style={{ marginTop: 10 }}>
                    {/* <ActivityIndicator size="large" color="#0000ff" /> */}
                </View>
            ) : faces && faces.length > 1 ? (
                <View style={{ marginTop: 10, elevation: 8, backgroundColor: "#009688", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 }}>
                    <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold", alignSelf: "center", textTransform: "uppercase" }}>{faces.length-1} faces Detected </Text>
                </View>
            ) : (
                <View style={{ marginTop: 10, elevation: 8, backgroundColor: "red", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 }}>
                    <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold", alignSelf: "center", textTransform: "uppercase" }}>No data found</Text>
                </View>
            )}

        </ScrollView>
    </View>
);

}
const styles = StyleSheet.create({
    MainContainer: {
        marginTop: 60
    },
});

export default S3Upload;
