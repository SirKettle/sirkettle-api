export const intOr = (stringInt: any, or: number = 0): number => {
  const int = parseInt(stringInt);
  if (isNaN(int)) {
    return or;
  }
  return int;
};
