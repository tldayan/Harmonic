import uuid from 'react-native-uuid';
import storage from "@react-native-firebase/storage"
import { useEffect } from "react";
import { PasswordCheck } from "../types/password.types";
import Toast from "react-native-toast-message"
import { Keyboard } from "react-native";
import { Asset, launchImageLibrary } from "react-native-image-picker";
import { DocumentPickerResponse } from "@react-native-documents/picker";

  
//GET RECTANGLE COLOR FOR CREATE PASSWORD VALIDATION
  export const getRectangleColor = (index: number, password: string, passwordCheck: PasswordCheck) => {
    if (!password) return "#e5e7eb"; 
  
    if (passwordCheck.passedChecks >= index + 1) {
      if (passwordCheck.passedChecks === 4) return "#32de84"; 
      if (passwordCheck.passedChecks === 3) return "#FDBA8C"
      return "red"; 
    }
  
    return "#e5e7eb";
  };


  //APPLY DATE FORMAT 
  export const formatDate = (dateString: string, timeOnly?: boolean) => {
    if (!dateString) return "Invalid date"; 
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
  
    if (timeOnly) {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    }
  
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();
  
    if (timeDiff < 60000) {
      return "now";
    }
  
    if (timeDiff < 3600000) {
      const minutes = Math.floor(timeDiff / 60000);
      return `${minutes}m`; 
    }
  
    if (timeDiff < 86400000) {
      const hours = Math.floor(timeDiff / 3600000);
      return `${hours}h`; 
    }
  
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    } as const;
  
    return new Intl.DateTimeFormat("en-GB", options).format(date).replace(" at", ",");
  };
  
  

export const useKeyboardVisibility = (onShow: () => void, onHide: () => void) => {

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", onShow)
    const hideSubscription = Keyboard.addListener("keyboardDidHide", onHide)

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }

  }, [onShow, onHide])

}
  


export function timeAgo(dateString: string): string {
  const now = new Date();
  const pastDate = new Date(dateString);
  
  const diffInMs: number = now.getTime() - pastDate.getTime();

  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSec < 60) {
    return `now`;
  } else if (diffInMin < 60) {
    return `${diffInMin}min`;
  } else if (diffInHours < 24) {
    return `${diffInHours}hr`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}wk`;
  } else if (diffInYears < 1) {
    return `${Math.floor(diffInDays / 30)}mo`;
  } else {
    return `${diffInYears}y`;
  }
}


export function getTimeFromISO(isoString: string) {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatLongDate(isoString: string): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatProperDate(timestamp: string): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}





export const pickMedia = async (oneImage?: boolean) => {
  try {
    const result = await launchImageLibrary({
      mediaType: "mixed",
      selectionLimit: oneImage ? 1 : 0,
      quality: 1,
    });

    if (result.didCancel || result.errorCode) {
      console.log("Image Pick Error:", result.errorMessage || "Cancelled");
      return [];
    }

    return result.assets ?? [];
  } catch (error) {
    console.log("Unexpected error:", error);
    return [];
  }
};


export const uploadMedia = async (mediaFiles: Asset[], firebaseStoragelocation: string): Promise<{ url: string, type: 'image' | 'video' }[]> => {

  if (!mediaFiles.length) return [];

  try {
      const uploadPromises = mediaFiles.map(async (media: Asset) => {
          const { uri, fileName, type } = media;

          if (!uri || !fileName || !type) {
              console.log("Invalid media file:", media);
              return undefined;
          }

          const uniqueFileName = `${uuid.v4()}-${fileName}`

          let mediaType: 'image' | 'video';

          if (type.includes('image')) {
              mediaType = 'image';
          } else if (type.includes('video')) {
              mediaType = 'video';
          } else {
              console.log("Unknown media type:", type);
              return undefined;
          }

          const fileRef = storage().ref(`uploads/${firebaseStoragelocation}/${uniqueFileName}`);

          await fileRef.putFile(uri);
          const downloadUrl = await fileRef.getDownloadURL();

          return { url: downloadUrl, type: mediaType };
      });

      const mediaData = await Promise.all(uploadPromises);

      return mediaData.filter((data): data is { url: string, type: 'image' | 'video'} => data !== undefined);
  } catch (err) {
      console.error('Error uploading media files:', err);
      return [];
  }
};





export const uploadDocuments = async (documents: any, firebaseStoragelocation: string) => {

  if (!documents.length) return [];

  try {
      const uploadPromises = documents.map(async (document: any) => {
          const { localUri, name, type } = document;

          if (!localUri || !name || !type) {
              console.log("Invalid media file:", document);
              return undefined;
          }
          
          const uniqueFileName = `${uuid.v4()}-${name}`

          let documentType: 'image' | 'video' | 'pdf' | 'doc' | 'unknown';

          if (type.includes('image')) {
            documentType = 'image';
          } else if (type.includes('video')) {
            documentType = 'video';
          } else if (type === 'application/pdf') {
            documentType = 'pdf';
          } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            documentType = 'doc';
          } else {
            documentType = 'unknown';
            console.log("Unknown media type:", type);
          }

          const fileRef = storage().ref(`uploads/${firebaseStoragelocation}/${uniqueFileName}`);

          await fileRef.putFile(localUri);
          const downloadUrl = await fileRef.getDownloadURL();

          return { url: downloadUrl, type: documentType };
      });

      const documentData = await Promise.all(uploadPromises);

      return documentData.filter(
        (data): data is { url: string; type: 'image' | 'video' | 'pdf' | 'doc' | 'unknown' } => data !== undefined
      );
      
  } catch (err) {
      console.error('Error uploading document files:', err);
      return [];
  }
};






type ApiFunction<T extends unknown[]> = (...args: T) => Promise<any>;

export const fetchWithErrorHandling = async <T extends unknown[]>(apiFunction: ApiFunction<T>, ...args: T): Promise<any> => {
  
  try {
    const response = await apiFunction(...args)
    return response
  } catch (err: any) {

    Toast.show({
      type: "error",
      text1: "Opps...Something went wrong!",
      text2: err.message || "Please try agian",
      position: "bottom"
    })
    
    return null

  }
}