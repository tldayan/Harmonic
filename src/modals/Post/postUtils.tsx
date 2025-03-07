import { Asset } from "react-native-image-picker"
import { PollOption } from "../../types/post-types"
import storage from "@react-native-firebase/storage"

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

        return mediaData.filter((data): data is { url: string, type: 'image' | 'video' } => data !== undefined);
    } catch (err) {
        console.error('Error uploading media files:', err);
        return [];
    }
};
