import { Image, StyleSheet, TouchableWithoutFeedback, View, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import ModalsHeader from './ModalsHeader'

interface ImageViewProps {
    onClose: () => void,
    imageUrl: string
}

export default function ImageView({ onClose, imageUrl }: ImageViewProps) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });


  useEffect(() => {
    Image.getSize(imageUrl, (width, height) => {
      setImageDimensions({ width, height });
    });
  }, [imageUrl]);


  const isPortrait = imageDimensions.height > imageDimensions.width;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.container}>
        <ModalsHeader onClose={onClose} lightCloseIcon={true} title='' />
        <View style={styles.innerContainer}>
          <Image
            style={[
              styles.image,
              isPortrait ? styles.portraitImage : styles.landscapeImage
            ]}
            source={{ uri: imageUrl ? imageUrl : undefined }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 8,
    width: "100%",
  },
  innerContainer: {
    paddingHorizontal: 0,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
  portraitImage: {
    height: Dimensions.get('window').height * 0.8, 
    maxHeight: Dimensions.get('window').height * 0.9,
  },
  landscapeImage: {
    height: 300, 
    maxHeight: 500,
  },
});
