export const createArray = (length: number, startNumber: number = 0) => {
  return Array.from({ length: length }, (_, i) => i + startNumber);
};
