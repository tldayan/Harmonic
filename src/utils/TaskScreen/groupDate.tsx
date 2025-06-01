import { formatTo12Hour } from "./formatTo12Hr";

type ScheduleEntry = {
    PersonnelUUID: string;
    ScheduledDateTimeFrom: string;
    ScheduledDateTimeTo: string;
  };

  type BlockedCrewTiming = {
    date: string;
    blockedTimings: string[];
  };

  export const groupByDate = (schedule: ScheduleEntry[]): BlockedCrewTiming[] => {
    console.log(schedule)
    const map: Record<string, Set<string>> = {};

  
    for (const entry of schedule) {
      const localDateTime = new Date(entry.ScheduledDateTimeFrom);
      const dateStr = localDateTime.toISOString().split('T')[0]; 
  
      const localTime = formatTo12Hour(localDateTime.toISOString());

  
      if (!map[dateStr]) {
        map[dateStr] = new Set();
      }
  
      map[dateStr].add(localTime);
    }
  
    return Object.entries(map).map(([date, timeSet]) => ({
      date,
      blockedTimings: Array.from(timeSet).sort((a: string, b: string) => {
        const parse = (str: string): number => {
          const [time, modifier] = str.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (modifier === 'PM' && hours !== 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          return hours * 60 + minutes;
        };
        return parse(a) - parse(b);
      }),      
    }));
  };