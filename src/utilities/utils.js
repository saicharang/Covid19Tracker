export const sortedData = (data) => {
  const sortData = [...data];
  return sortData.sort((a,b) => (a.cases > b.cases) ? -1 : 1);
}