export function addMinutesToTime(datetimeStr: string, minutesToAdd: number): string {
    const date = new Date(datetimeStr.replace(/-/g, '/'));
  
    date.setMinutes(date.getMinutes() + minutesToAdd);
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return `${formattedDate} ${hours}:${minutes}:${seconds}`;
  }
  