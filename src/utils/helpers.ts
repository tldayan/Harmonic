import { PasswordCheck } from "../types/password.types";

//UNICODE TO COUNTRY FLAG EMOJIS
export const convertUnicodeToEmoji = (unicodeStr: string) => {
    return unicodeStr
      .split(' ')
      .map(code => String.fromCodePoint(parseInt(code.replace('U+', ''), 16)))
      .join('');
  };
  


  
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