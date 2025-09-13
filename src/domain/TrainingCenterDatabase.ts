import { Activity, ActivityImpl } from './Activity';

export interface TrainingCenterDatabase {
  activities: Activity[];
}

export class TrainingCenterDatabaseImpl implements TrainingCenterDatabase {
  constructor(public readonly activities: Activity[]) {}

  static fromXmlData(data: any): TrainingCenterDatabase {
    const activities = data.TrainingCenterDatabase?.Activities?.[0]?.Activity?.map((activityData: any) =>
      ActivityImpl.fromXmlData(activityData)
    ) || [];

    return new TrainingCenterDatabaseImpl(activities);
  }
}
