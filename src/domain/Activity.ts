import { Lap, LapImpl } from './Lap';

export interface Activity {
  id: string;
  sport: string;
  laps: Lap[];
}

export class ActivityImpl implements Activity {
  constructor(
    public readonly id: string,
    public readonly sport: string,
    public readonly laps: Lap[]
  ) {}

  static fromXmlData(data: any): Activity {
    const id = data.Id?.[0] || '';
    const sport = data.$.Sport || '';
    
    const laps = data.Lap?.map((lapData: any) =>
      LapImpl.fromXmlData(lapData)
    ) || [];

    return new ActivityImpl(id, sport, laps);
  }
}
