export const formatTo12Hour = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12; // Convert to 12-hour format
    const paddedMinutes = minutes.toString().padStart(2, '0');
  
    return `${hours.toString().padStart(2, '0')}:${paddedMinutes} ${ampm}`;
  };