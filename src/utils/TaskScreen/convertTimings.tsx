export function convertTo24HourWithSeconds(timeStr: string): string {
    const [time, modifier] = timeStr.match(/(\d+:\d+)(AM|PM)/)!.slice(1, 3);
    let [hours, minutes] = time.split(':').map(Number);
  
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  }
  