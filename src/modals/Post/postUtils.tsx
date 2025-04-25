import { Asset } from "react-native-image-picker"
import { PollOption } from "../../types/post-types"
import storage from "@react-native-firebase/storage"
import { getStorage, ref, deleteObject } from "firebase/storage";
import { firebaseStoragelocations } from "../../utils/constants";

export const filterOptions = (options : PollOption[]) => {

    let seen = new Set()
    let filtered = options.filter((eachOption) => {

        if(eachOption.value && !seen.has(eachOption.value)) {
            seen.add(eachOption.value)
            return true
        }
            
        return false

    })

    return filtered


}



const extractStoragePath = (imageUrl: string) => {
    const storageBaseUrl = "https://firebasestorage.googleapis.com/v0/b/harmonicdevapp.appspot.com/o/";
    return decodeURIComponent(imageUrl.replace(storageBaseUrl, "").split("?")[0]);
};


export const deleteImageFromFirebase = async (imageUrl: string) => {
    try {
        const storage = getStorage();
        const storagePath = extractStoragePath(imageUrl);
        const imageRef = ref(storage, storagePath);

        await deleteObject(imageRef);
        console.log("Image deleted successfully from Firebase Storage!");
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};
