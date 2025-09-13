export interface HeartRate {
  value: number;
}

export class HeartRateImpl implements HeartRate {
  constructor(public readonly value: number) {}

  static fromXmlData(data: any): HeartRate | null {
    const value = data.Value?.[0];
    if (value === undefined || value === null) {
      return null;
    }
    return new HeartRateImpl(parseInt(value, 10));
  }
}
