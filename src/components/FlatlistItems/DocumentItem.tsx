import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import CustomButton from "../CustomButton";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { colors } from "../../styles/colors";


interface DocumentItemProps {
    item: DocumentPickerResponse;
    index: number;
    deleteDocument: (uri: string) => void;
  }


export const DocumentItem = ({item,index,deleteDocument} : DocumentItemProps) => {
    return (
        <View style={styles.documentContainer}>
            <CustomButton onPress={() => deleteDocument(item.uri || "")} buttonStyle={styles.deleteDocument} icon={<Image width={10} height={10} source={require("../../assets/images/x.png")} />} />
            <CustomButton onPress={() => {}} title={item.name} buttonStyle={styles.contentButtonContainer} />
        </View>
    )
}

const styles = StyleSheet.create({
    documentContainer: {
      backgroundColor: colors.LIGHT_COLOR,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      width: 100,
      height: 100,
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
    },
    deleteDocument: {
      position: "absolute",
      right: 5,
      top: 5,
      zIndex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      backgroundColor: "white",
      height: 25,
      width: 25,
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
  