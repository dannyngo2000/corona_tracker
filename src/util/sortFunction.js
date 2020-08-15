//Sorting function in order to sort cases from country from largest to least
export const sortFunction = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};
