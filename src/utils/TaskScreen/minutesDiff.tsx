export function getTimeDiffInMinutes(start: string, end: string): number {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    return Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
  }