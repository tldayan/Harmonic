import { formatTo12Hour } from "./formatTo12Hr";

type ScheduleEntry = {
  PersonnelUUID: string;
  ScheduledDateTimeFrom: string;
  ScheduledDateTimeTo: string;
};

type BlockedCrewTiming = {
  OrganizationPersonnelUUID: string;
  date: string;
  blockedTimings: string[];
};

type BookedCrewTiming = {
  OrganizationPersonnelUUID: string;
  date: string;
  bookedTimings: string[];
};

export const groupByDate = (
  schedule: ScheduleEntry[]
): { blocked: BlockedCrewTiming[]; booked: BookedCrewTiming[] } => {
  const map: Record<string, Set<string>> = {};

  for (const entry of schedule) {
    const start = new Date(entry.ScheduledDateTimeFrom);
    const end = new Date(entry.ScheduledDateTimeTo);

    const dateStr = start.toISOString().split("T")[0];
    const key = `${entry.PersonnelUUID}_${dateStr}`;

    if (!map[key]) {
      map[key] = new Set();
    }

    const slot = new Date(start);
    while (slot < end) {
      const formattedTime = formatTo12Hour(slot.toISOString());
      map[key].add(formattedTime);
      slot.setMinutes(slot.getMinutes() + 15);
    }
  }

  const blocked: BlockedCrewTiming[] = [];
  const booked: BookedCrewTiming[] = [];

  for (const [combinedKey, timeSet] of Object.entries(map)) {
    const [OrganizationPersonnelUUID, date] = combinedKey.split("_");
    const sortedTimes = Array.from(timeSet).sort((a: string, b: string) => {
      const parse = (str: string): number => {
        const [time, modifier] = str.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return parse(a) - parse(b);
    });

    blocked.push({
      OrganizationPersonnelUUID,
      date,
      blockedTimings: sortedTimes,
    });

    booked.push({
      OrganizationPersonnelUUID,
      date,
      bookedTimings: sortedTimes,
    });
  }

  return { blocked, booked };
};
