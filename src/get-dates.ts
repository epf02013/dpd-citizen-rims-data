export const getDates = (start: string, end: string, endDateOffset: number) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dateArray = [];
  const currentDate = startDate;
  while (currentDate < endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + endDateOffset);
  }
  return dateArray;
};
