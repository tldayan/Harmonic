export const formatTo12Hour = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12; 
    const paddedMinutes = minutes.toString().padStart(2, '0');
  
    return `${hours}:${paddedMinutes}${ampm}`;
  };
  