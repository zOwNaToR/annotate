declare interface Array<T> {
  removeItems(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
}
