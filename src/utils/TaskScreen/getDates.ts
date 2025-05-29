
export const getNextMonthDates = () => {
    const daysAbbreviated = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dates = [];
  
    for (let i = 0; i <= 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayAbbreviation = daysAbbreviated[date.getDay()];
      const fullDate = date.toISOString().split('T')[0];
  
      dates.push({
        key: i,
        date,
        label: dayAbbreviation,
        fullDate,
      });
    }
  
    return dates;
  };
  