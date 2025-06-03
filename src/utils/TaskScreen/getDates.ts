export const getNextMonthDates = () => {
    const daysAbbreviated = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dates = [];
  
    for (let i = 0; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayAbbreviation = daysAbbreviated[date.getDay()];
  
      const fullDate = date.toLocaleDateString('en-CA'); 
  
      dates.push({
        key: i,
        date,
        label: dayAbbreviation,
        fullDate,
      });
    }
  
    return dates;
  };
  