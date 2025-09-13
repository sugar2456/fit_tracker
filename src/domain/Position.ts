export interface Position {
  latitudeDegrees: number;
  longitudeDegrees: number;
}

export class PositionImpl implements Position {
  constructor(
    public readonly latitudeDegrees: number,
    public readonly longitudeDegrees: number
  ) {}

  static fromXmlData(data: any): Position {
    return new PositionImpl(
      parseFloat(data.LatitudeDegrees?.[0] || '0'),
      parseFloat(data.LongitudeDegrees?.[0] || '0')
    );
  }
}
