import { ActivityIndicator, Image, StyleSheet, View, Text } from "react-native";
import CustomButton from "../CustomButton";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { colors } from "../../styles/colors";

interface DocumentItemProps {
  item: ExtendedDocument;
  index: number;
  deleteDocument?: (uri: string) => void;
}

interface ExtendedDocument extends DocumentPickerResponse {
  localUri?: string;
}


export const DocumentItem = ({ item, index, deleteDocument }: DocumentItemProps) => {
  const isImage = item.name?.match(/\.(jpeg|jpg|gif|png)$/i);
  const uriToUse = item.localUri ?? item.uri;
  return (
    <View style={[styles.documentContainer, {padding: isImage ? 0 : 10}]}>
      {deleteDocument && <CustomButton onPress={() => deleteDocument?.(item.uri || "")} buttonStyle={styles.deleteDocument} icon={<Image width={10} height={10} source={require("../../assets/images/x.png")} />} />}
      
      {isImage ? (

        <Image source={{ uri: uriToUse }} style={styles.content} />
      ) : (

        <CustomButton onPress={() => {}} textStyle={{fontSize: 10}} title={item.name} buttonStyle={styles.contentButtonContainer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  documentContainer: {
    backgroundColor: colors.LIGHT_COLOR,
    alignItems: "center",
    justifyContent: "center",
    padding: 0, 
    width: 100,
    flex: 1,
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
    width: '100%', 
    height: '100%', 
    borderRadius: 10,
    resizeMode: 'cover', 
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
});
