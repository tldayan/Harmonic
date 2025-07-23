import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface CustomVideoPlayerProps {
  uri: string;
  isVisible: boolean;
  onSwipeDown?: () => void; 
}

export default function CustomVideoPlayer({ uri, isVisible, onSwipeDown }: CustomVideoPlayerProps) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  const translateY = useSharedValue(0);

  const onLoad = (data: any) => {
    setLoading(false);
    const { width, height } = data.naturalSize;
    if (width && height) {
      setAspectRatio(width / height);
    }
  };

  const onError = (err: any) => {
    console.log("Video error:", err);
    setLoading(false);
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    },
    onEnd: (event) => {
      if (event.translationY > 120) {
        onSwipeDown && runOnJS(onSwipeDown)();

      } else {
        translateY.value = withSpring(0); 
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, { aspectRatio }, animatedStyle]}>
        <Video
          ref={videoRef}
          source={{ uri }}
          paused={!isVisible}
          onLoadStart={() => setLoading(true)}
          onLoad={onLoad}
          onError={onError}
          resizeMode="contain"
          style={styles.video}
          controls={!loading}
        />
        {loading && (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    position: 'absolute',
  },
});
