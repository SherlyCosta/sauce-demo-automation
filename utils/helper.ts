export class StringHelpers {
  static cleanPrice(priceString: string): number {
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
  }

  static formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
}
