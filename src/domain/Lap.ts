import { Trackpoint, TrackpointImpl } from './Trackpoint';

export interface Lap {
  startTime: Date;
  totalTimeSeconds: number;
  distanceMeters: number;
  calories: number;
  intensity: string;
  triggerMethod: string;
  trackpoints: Trackpoint[];
}

export class LapImpl implements Lap {
  constructor(
    public readonly startTime: Date,
    public readonly totalTimeSeconds: number,
    public readonly distanceMeters: number,
    public readonly calories: number,
    public readonly intensity: string,
    public readonly triggerMethod: string,
    public readonly trackpoints: Trackpoint[]
  ) {}

  static fromXmlData(data: any): Lap {
    const startTime = new Date(data.$.StartTime || '');
    const totalTimeSeconds = parseFloat(data.TotalTimeSeconds?.[0] || '0');
    const distanceMeters = parseFloat(data.DistanceMeters?.[0] || '0');
    const calories = parseInt(data.Calories?.[0] || '0', 10);
    const intensity = data.Intensity?.[0] || '';
    const triggerMethod = data.TriggerMethod?.[0] || '';

    const trackpoints = data.Track?.[0]?.Trackpoint?.map((trackpointData: any) =>
      TrackpointImpl.fromXmlData(trackpointData)
    ) || [];

    return new LapImpl(
      startTime,
      totalTimeSeconds,
      distanceMeters,
      calories,
      intensity,
      triggerMethod,
      trackpoints
    );
  }
}
