export const filterIt = (arr: any, searchKey: string) => {
  return arr.filter((obj: any) => {
    return Object.keys(obj).some(key => {
      return obj[key].includes(searchKey);
    });
  });
};
