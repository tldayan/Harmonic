import { Image, StyleSheet, TouchableWithoutFeedback, View, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import ModalsHeader from './ModalsHeader'

interface ImageViewProps {
    onClose: () => void,
    imageUrl: string
}

export default function ImageView({ onClose, imageUrl }: ImageViewProps) {
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(imageUrl, (width, height) => {
        setImageDimensions({ width, height });
      });
    }
  }, [imageUrl]);

  const aspectRatio = imageDimensions ? imageDimensions.width / imageDimensions.height : 1;

  const isImageUrlValid = imageUrl && imageUrl.trim() !== ''; // Check if the imageUrl is valid

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {imageLoaded && <ModalsHeader onClose={onClose} lightCloseIcon={true} title='' />}

          {!imageLoaded && <ActivityIndicator style={styles.loadingSpinner} size="small" color="white" />}
          
          {isImageUrlValid && imageDimensions && (
            <Image
              onLoad={() => setImageLoaded(true)}
              style={[
                styles.image,
                {
                  width: screenWidth * 0.9,
                  height: screenWidth * 0.9 / aspectRatio,
                  opacity: imageLoaded ? 1 : 0, 
                },
              ]}
              source={{ uri: imageUrl }}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1, 
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center', 
    position: 'relative', 
  },
  image: {
    resizeMode: 'contain',
  },
  loadingSpinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }]
  }
});
