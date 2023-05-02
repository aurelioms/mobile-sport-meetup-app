export const getDateRange = (start: Date, to: Date) => {
  var dateArray = new Array();
  var currentDate = new Date(start);

  while (currentDate <= to) {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);
    dateArray.push(date);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};
