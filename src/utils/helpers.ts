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
      day: 'numeric',    
      month: 'long',   
      year: 'numeric',    
      hour: '2-digit',    
      minute: '2-digit', 
    } as const;
  

    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
  

    const [dayMonthYear, time] = formattedDate.split(', ');
  
    // Format: "7 September 2024 • 12:32"
    return `${dayMonthYear} • ${time}`;
  };
  