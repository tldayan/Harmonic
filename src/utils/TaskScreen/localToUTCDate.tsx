export const localToUTCDateOnly = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().substring(0, 10); // returns 'YYYY-MM-DD'
  };
  