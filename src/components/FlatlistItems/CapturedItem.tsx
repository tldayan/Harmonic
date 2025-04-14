import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PhotoFile } from 'react-native-vision-camera';
import CustomButton from '../CustomButton';
import Video from 'react-native-video';


interface CapturedItemProps {
    item: PhotoFile;
    index: number;
    setAttachment?: (attachment: string | null) => void
    deleteAttachment: (fileName: string) => void;
    setViewingAttachments: (value: boolean) => void;
    setInitialAttachmentIndex: (index: number) => void;
  }

  export const CapturedItem = ({item,index,deleteAttachment, setViewingAttachments, setInitialAttachmentIndex, setAttachment} : CapturedItemProps) => {
    return (
        <View style={styles.imageContainer}>
            <CustomButton onPress={() => deleteAttachment(item.path || "")} buttonStyle={styles.deleteImage} icon={<Image width={10} height={10} source={require("../../assets/images/x.png")} />} />
            <CustomButton buttonStyle={styles.contentButtonContainer} onPress={() => {setAttachment?.(null);setViewingAttachments(true); setInitialAttachmentIndex(index)}} icon={!item.path?.includes(".jpg") ? 
                <Video 
                    paused 
                    renderLoader={<ActivityIndicator style={styles.loader} size={'small'} color={"black"} />} 
                    style={styles.content}
                    controls={false}
                    source={{ uri: item.path }}
                /> 
                : 
                <Image style={styles.content} source={{uri: `file://${item.path}` ? `file://${item.path}` : undefined}} />} />
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
    },
    deleteImage: {
      position: "absolute",
      right: 5,
      top: 5,
      zIndex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      backgroundColor: "white",
      height: 30,
      width: 30,
    },
    contentButtonContainer: {
      overflow: "hidden",
      borderRadius: 5,
    },
    content: {
      width: 150,
      height: 150,
      position: "relative",
    },
    loader: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    },
  });
  