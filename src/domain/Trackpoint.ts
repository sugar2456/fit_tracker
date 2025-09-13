import { Position, PositionImpl } from './Position';
import { HeartRate, HeartRateImpl } from './HeartRate';

export interface Trackpoint {
  time: Date;
  position?: Position;
  altitudeMeters?: number;
  distanceMeters?: number;
  heartRateBpm?: HeartRate;
}

export class TrackpointImpl implements Trackpoint {
  constructor(
    public readonly time: Date,
    public readonly position?: Position,
    public readonly altitudeMeters?: number,
    public readonly distanceMeters?: number,
    public readonly heartRateBpm?: HeartRate
  ) {}

  static fromXmlData(data: any): Trackpoint {
    const time = new Date(data.Time?.[0] || '');
    
    let position: Position | undefined;
    if (data.Position?.[0]) {
      position = PositionImpl.fromXmlData(data.Position[0]);
    }

    const altitudeMeters = data.AltitudeMeters?.[0] 
      ? parseFloat(data.AltitudeMeters[0]) 
      : undefined;

    const distanceMeters = data.DistanceMeters?.[0] 
      ? parseFloat(data.DistanceMeters[0]) 
      : undefined;

    let heartRateBpm: HeartRate | undefined;
    if (data.HeartRateBpm?.[0]) {
      heartRateBpm = HeartRateImpl.fromXmlData(data.HeartRateBpm[0]);
    }

    return new TrackpointImpl(
      time,
      position,
      altitudeMeters,
      distanceMeters,
      heartRateBpm
    );
  }
}
