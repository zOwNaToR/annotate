Array.prototype.removeItems = function <T>(predicate: (value: T, index: number, array: T[]) => unknown): T[] {
  return this.filter((value, index, array) => !predicate(value, index, array));
};

export default 1;
