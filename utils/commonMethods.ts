export class CommonMethods {
  static isSortedAscending(arr: string[]): boolean {
    const sorted = [...arr].sort((a, b) => a.localeCompare(b));
    return JSON.stringify(arr) === JSON.stringify(sorted);
  }

  static isSortedDescending(arr: string[]): boolean {
    const sorted = [...arr].sort((a, b) => b.localeCompare(a));
    return JSON.stringify(arr) === JSON.stringify(sorted);
  }

  static isNumericSortedLowToHigh(arr: number[]): boolean {
    const sorted = [...arr].sort((a, b) => a - b);
    return JSON.stringify(arr) === JSON.stringify(sorted);
  }

  static isNumericSortedHighToLow(arr: number[]): boolean {
    const sorted = [...arr].sort((a, b) => b - a);
    return JSON.stringify(arr) === JSON.stringify(sorted);
  }
}
