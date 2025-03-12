import { Asset } from "react-native-image-picker"
import { PollOption } from "../../types/post-types"
import storage from "@react-native-firebase/storage"
import { getStorage, ref, deleteObject } from "firebase/storage";

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


export const uploadMedia = async (mediaFiles: Asset[]): Promise<{ url: string, type: 'image' | 'video' }[]> => {

    if (!mediaFiles.length) return [];

    try {
        const uploadPromises = mediaFiles.map(async (media: Asset) => {
            const { uri, fileName, type } = media;

            if (!uri || !fileName || !type) {
                console.log("Invalid media file:", media);
                return undefined;
            }

            let mediaType: 'image' | 'video';

            if (type.includes('image')) {
                mediaType = 'image';
            } else if (type.includes('video')) {
                mediaType = 'video';
            } else {
                console.log("Unknown media type:", type);
                return undefined;
            }

            const fileRef = storage().ref(`uploads/attachmentMB/${fileName}`);

            await fileRef.putFile(uri);
            const downloadUrl = await fileRef.getDownloadURL();

            return { url: downloadUrl, type: mediaType };
        });

        const mediaData = await Promise.all(uploadPromises);

        return mediaData.filter((data): data is { url: string, type: 'image' | 'video', isDeleted: false} => data !== undefined);
    } catch (err) {
        console.error('Error uploading media files:', err);
        return [];
    }
};



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
