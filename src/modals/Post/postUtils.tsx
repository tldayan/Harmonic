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


export const uploadImages = async (images: Asset[]): Promise<string[] | undefined> => {

    console.log("REQUEST FOR GENERATING FIREBASE IMAGE URLS CAME")

    if(!images.length) return

    try {
        const uploadPromises = images.map(async (image: Asset) => {

            const {uri, fileName} = image

            const fileRef = storage().ref(`uploads/attachmentMB/${fileName}`)
            
            if(uri) {
               await fileRef.putFile(uri) 
            }

            return fileRef.getDownloadURL()
        })

        const imageUrls = await Promise.all(uploadPromises)

        return imageUrls

    } catch (err) {
        console.error('Error uploading images:', err);
    }
    
}