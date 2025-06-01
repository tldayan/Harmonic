export const localToUTC = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().replace('T', ' ').substring(0, 19); 
  };