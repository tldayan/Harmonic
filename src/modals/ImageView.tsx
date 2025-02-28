import { Image, StyleSheet, TouchableWithoutFeedback, View, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import ModalsHeader from './ModalsHeader'

interface ImageViewProps {
    onClose: () => void,
    imageUrl: string
}

export default function ImageView({ onClose, imageUrl }: ImageViewProps) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    Image.getSize(imageUrl, (width, height) => {
      setImageDimensions({ width, height });
    });
  }, [imageUrl]);


  const aspectRatio = imageDimensions.width / imageDimensions.height;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.container}>
        <ModalsHeader onClose={onClose} lightCloseIcon={true} title='' />
        <View style={styles.innerContainer}>
          <Image
            style={[
              styles.image,
              {
                width: screenWidth * 0.9,
                height: screenWidth * 0.9 / aspectRatio,
              }
            ]}
            source={{ uri: imageUrl || undefined }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
/*     backgroundColor: "black", */
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
});
