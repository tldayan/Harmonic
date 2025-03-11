import { PasswordCheck } from "../types/password.types";
import Toast from "react-native-toast-message"

  
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
  export const formatDate = (dateString: string) => {
    if (!dateString) return "Invalid date"; 
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
  
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
  
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
    return formattedDate.replace(" at", ",");
  };
  
  
  


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
    
    return

  }


}