import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import CustomButton from '../CustomButton';
import Video from 'react-native-video';
import { AttachmentData } from '../../types/post-types';
import FastImage from '@d11/react-native-fast-image';
import ImageSkeleton from '../../skeletons/ImageSkeleton';
import VideoIcon from "../../assets/icons/video.svg"

type Props = {
  item: AttachmentData;
  index: number;
  attachmentCount: number;
  loading: { [key: number]: boolean };
  videoPlaying: boolean;
  onPress: (index: number) => void;
  onLoadStart: (index: number) => void;
  onLoadEnd: (index: number) => void;
};

const PostAttachmentItem: React.FC<Props> = ({
  item,
  index,
  attachmentCount,
  loading,
  videoPlaying,
  onPress,
  onLoadStart,
  onLoadEnd,
}) => {
  if (!item?.Attachment) return null;

  const isImage = item.AttachmentType.includes('image');
  const isSingle = attachmentCount === 1;

  return (
    <CustomButton
      onPress={() => onPress(index)}
      buttonStyle={[
        styles.postContentContainer,
        isSingle && { width: '100%', height: 200 },
      ]}
      icon={
        isImage ? (
          <View style={{ position: 'relative' }}>
            {loading[index] && <ImageSkeleton oneImage={isSingle} />}
            <FastImage
              style={styles.content}
              source={{
                uri: item.Attachment,
                priority: FastImage.priority.high,
              }}
              onLoadStart={() => onLoadStart(index)}
              onLoadEnd={() => onLoadEnd(index)}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        ) : (
          <View style={{ position: 'relative' }}>
            {!videoPlaying && (
              <View style={styles.videoIconBackground}>
                <VideoIcon stroke="white" fill="white" width={14} height={14} />
              </View>
            )}
            <Video
              paused
              renderLoader={
                <ActivityIndicator
                  style={styles.contentLoader}
                  size="small"
                  color="black"
                />
              }
              style={styles.content}
              controls={false}
              source={{ uri: item.Attachment }}
            />
          </View>
        )
      }
    />
  );
};

export default PostAttachmentItem;

const styles = StyleSheet.create({
  postContentContainer: {
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  videoIconBackground: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    padding: 6,
    zIndex: 1,
  },
  contentLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
});
