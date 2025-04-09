import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { Asset } from "react-native-image-picker";
import CustomButton from "../CustomButton";
import Video from "react-native-video";


interface AttachmentItemProps {
    item: Asset;
    index: number;
    setAttachment?: (attachment: string | null) => void
    deleteAttachment: (fileName: string) => void;
    setViewingAttachments: (value: boolean) => void;
    setInitialAttachmentIndex: (index: number) => void;
  }


export const Attachmentitem = ({item,index,deleteAttachment, setViewingAttachments, setInitialAttachmentIndex, setAttachment} : AttachmentItemProps) => {
    return (
        <View style={styles.imageContainer}>
            <CustomButton onPress={() => deleteAttachment(item.fileName || "")} buttonStyle={styles.deleteImage} icon={<Image width={10} height={10} source={require("../../assets/images/x.png")} />} />
            <CustomButton buttonStyle={styles.contentButtonContainer} onPress={() => {setAttachment?.(null);setViewingAttachments(true); setInitialAttachmentIndex(index)}} icon={item.type?.includes("video") ? 
                <Video 
                    paused 
                    renderLoader={<ActivityIndicator style={styles.loader} size={'small'} color={"black"} />} 
                    style={styles.content}
                    controls={false}
                    source={{ uri: item.uri }}
                /> 
                : 
                <Image style={styles.content} source={{uri: item.uri ? item.uri : undefined}} />} />
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
  