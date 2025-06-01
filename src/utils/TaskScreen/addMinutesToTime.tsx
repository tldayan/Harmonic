export function addMinutesToTime(datetimeStr: string, minutesToAdd: number): string {
    const [date, time] = datetimeStr.split(' ');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const dateObj = new Date(`${date}T${time}`);
    dateObj.setMinutes(dateObj.getMinutes() + minutesToAdd);
    return dateObj.toTimeString().slice(0, 8); // "HH:MM:SS"
  }
  