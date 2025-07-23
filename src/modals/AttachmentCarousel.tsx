import { FlatList, StyleSheet, View, Dimensions, TouchableWithoutFeedback, ActivityIndicator, Image, Platform } from 'react-native'
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { AttachmentData } from '../types/post-types'
import ModalsHeader from './ModalsHeader';
import { Asset } from 'react-native-image-picker';
import { PhotoFile } from 'react-native-vision-camera';
import CustomButton from '../components/CustomButton';
const Pinchable = require('react-native-pinchable').default;
import Close from "../assets/icons/close-light.svg"
import { colors } from '../styles/colors';
import FastImage from '@d11/react-native-fast-image';
import CustomVideoPlayer from './CustomVideoPlayer';
import SwipeToDismissWrapper from './SwiperToDismissWrapper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width, height: screenHeight } = Dimensions.get('window');

interface AttachmentCarouselProps {
  AttachmentData?: AttachmentData[]
  capturedAttachments?: PhotoFile[]
  Attachment?: string | null
  Assets?: Asset[]
  onClose: () => void
  initialIndex?: number
}

type ItemType = {
  uri: string,
  isVideo: boolean,
  key: string,
}

export default function AttachmentCarousel({
  onClose,
  AttachmentData,
  initialIndex = 0,
  Assets,
  Attachment,
  capturedAttachments
}: AttachmentCarouselProps) {
  const [loading, setLoading] = useState(true)
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null)
  const [imageSizes, setImageSizes] = useState<Record<string, { width: number, height: number }>>({})
  const flatListRef = useRef<FlatList>(null)

  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);

  // Prepare a unified data array of items with uri and isVideo flags and keys
  const unifiedData: ItemType[] = useMemo(() => {
    if (AttachmentData && AttachmentData.length) {
      return AttachmentData
        .filter(item => !!item.Attachment && !!item.AttachmentUUID)
        .map(item => ({
          uri: item.Attachment!,
          isVideo: item.AttachmentType.includes("video"),
          key: item.AttachmentUUID!,
        }))
    }
    if (Assets && Assets.length) {
      return Assets
        .filter(item => !!item.uri && !!item.fileName)
        .map(item => ({
          uri: item.uri!,
          isVideo: item.type?.includes("video") || false,
          key: item.fileName!,
        }))
    }
    if (capturedAttachments && capturedAttachments.length) {
      return capturedAttachments
        .filter(item => !!item.path)
        .map(item => ({
          uri: `file://${item.path}`,
          isVideo: false,
          key: item.path,
        }))
    }
    if (Attachment) {
      return [{
        uri: Attachment,
        isVideo: false,
        key: 'single-attachment',
      }]
    }
    return []
  }, [AttachmentData, Assets, capturedAttachments, Attachment])



  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index)
      setLoading(true)
    }
  }, [])

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  }

  const horizontalPanGesture = useMemo(() =>
    Gesture.Pan()
      .activeOffsetX([-10, 10]) // small horizontal threshold to activate
      .failOffsetY([-10, 10])   // fail if vertical movement > 10 px to avoid conflicts
  , []);

  // Render function for all items (images/videos)
  const renderItem = useCallback(({ item, index }: { item: ItemType; index: number }) => {
    return (
      <TouchableWithoutFeedback>
         {/*  {!loading && <CustomButton buttonStyle={[styles.close, (Platform.OS === "ios" && styles.closeIconPosition)]} onPress={onClose} icon={<Close width={20} height={20} />} />} */}
          <View style={styles.contentWrapper}>
            {!item.isVideo ? (
               <SwipeToDismissWrapper
               onSwipeDown={onClose}
               simultaneousHandlers={horizontalPanGesture} 
             >
             
               <Pinchable>
                 <FastImage
                   onLoad={() => setLoading(false)}
                   style={[styles.content, { width, aspectRatio: 1 }]}
                   source={{
                     uri: item.uri,
                     priority: FastImage.priority.high,
                   }}
                   resizeMode="contain"
                 />
               </Pinchable>
             </SwipeToDismissWrapper>
            ) : (
              <CustomVideoPlayer
              uri={item.uri}
              isVisible={visibleIndex === index}
              onSwipeDown={onClose} // Pass it here
            />
            

            )}
          </View>
      </TouchableWithoutFeedback>
    )
  }, [loading, visibleIndex, onClose, imageSizes])

  if (unifiedData.length === 0) {
    // Fallback UI if no attachments
    return (
      <View style={styles.postImageContainer}>
        <ModalsHeader lightCloseIcon onClose={onClose} />
        <ActivityIndicator style={styles.loader} size="small" color="white" />
      </View>
    )
  }

  return (
    <GestureDetector gesture={horizontalPanGesture}>
      <FlatList
        ref={flatListRef}
        style={styles.carouselMainContainer}
        data={unifiedData}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={initialIndex}
      />
    </GestureDetector>
  );
  
}

const styles = StyleSheet.create({
  carouselMainContainer: {
    width,
  },
  postImageContainer: {
/*     borderWidth: 2,
    borderColor: "red", */
    width,
    height: "auto",
    paddingHorizontal: 10,
/*     justifyContent: "center", */
    alignItems: "center",
  },
  contentWrapper: {
    width,
    
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width,
    resizeMode: "contain",
    aspectRatio: 1.5,
    alignSelf: "center",
    position: "relative",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  close: {
    borderWidth: 1,
    marginLeft: "auto",
    marginBottom: 15,
    borderColor: colors.ACTIVE_ORANGE,
    borderRadius: 50,
    padding: 10,
  },
  closeIconPosition: {
    position: "absolute",
    zIndex: 1,
    right: "2%",
    top: "2%"
  }
});
