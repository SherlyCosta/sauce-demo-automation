export class RandomUtils {
  static getRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static getRandomNumber(min: number = 10000, max: number = 99999): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomFirstName(): string {
    const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Casey', 'Riley'];
    return names[Math.floor(Math.random() * names.length)];
  }

  static getRandomLastName(): string {
    const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    return names[Math.floor(Math.random() * names.length)];
  }

  static getRandomPostalCode(): string {
    return this.getRandomNumber(10000, 99999).toString();
  }
}
