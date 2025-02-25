import { PasswordCheck } from "../types/password.types";

  
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
  const date = new Date(dateString);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, 
    timeZone: "UTC", 
  } as const;

  return new Intl.DateTimeFormat("en-GB", options).format(date);
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