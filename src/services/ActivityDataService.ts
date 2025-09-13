import { ActivityDataRepository } from '../repository/interfaces';
import { 
  TrainingCenterDatabase, 
  Activity, 
  Lap, 
  Trackpoint,
  Position,
  HeartRate 
} from '../domain';

export interface ActivitySummary {
  totalActivities: number;
  totalDistance: number;
  totalCalories: number;
  totalTimeSeconds: number;
  averageHeartRate?: number;
  activities: ActivityInfo[];
}

export interface ActivityInfo {
  id: string;
  sport: string;
  startTime: Date;
  duration: number;
  distance: number;
  calories: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  trackpointCount: number;
}

export interface TrackpointSummary {
  time: Date;
  position?: Position;
  altitudeMeters?: number;
  distanceMeters?: number;
  heartRateBpm?: HeartRate;
}

export class ActivityDataService {
  constructor(private readonly repository: ActivityDataRepository) {}

  /**
   * 指定された識別子から活動データを取得し、画面表示用に加工する
   */
  async getActivitySummary(identifier: string): Promise<ActivitySummary> {
    const data = await this.repository.getActivityData(identifier);
    return this.processActivityData(data);
  }

  /**
   * 利用可能な活動データソースの一覧を取得する
   */
  async getAvailableDataSources(): Promise<string[]> {
    return this.repository.getAvailableDataSources();
  }

  /**
   * 活動データを画面表示用に加工する
   */
  private processActivityData(data: TrainingCenterDatabase): ActivitySummary {
    const activities = data.activities.map(activity => this.processActivity(activity));
    
    const totalActivities = activities.length;
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
    const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
    const totalTimeSeconds = activities.reduce((sum, activity) => sum + activity.duration, 0);
    
    // 平均心拍数を計算
    const heartRates = activities
      .map(activity => activity.averageHeartRate)
      .filter((hr): hr is number => hr !== undefined);
    
    const averageHeartRate = heartRates.length > 0 
      ? heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length 
      : undefined;

    return {
      totalActivities,
      totalDistance,
      totalCalories,
      totalTimeSeconds,
      averageHeartRate,
      activities
    };
  }

  /**
   * 個別の活動データを加工する
   */
  private processActivity(activity: Activity): ActivityInfo {
    const laps = activity.laps;
    const totalDistance = laps.reduce((sum, lap) => sum + lap.distanceMeters, 0);
    const totalCalories = laps.reduce((sum, lap) => sum + lap.calories, 0);
    const totalTimeSeconds = laps.reduce((sum, lap) => sum + lap.totalTimeSeconds, 0);
    
    // 全トラックポイントから心拍数データを収集
    const allHeartRates = laps
      .flatMap(lap => lap.trackpoints)
      .map(trackpoint => trackpoint.heartRateBpm?.value)
      .filter((hr): hr is number => hr !== undefined);

    const averageHeartRate = allHeartRates.length > 0 
      ? allHeartRates.reduce((sum, hr) => sum + hr, 0) / allHeartRates.length 
      : undefined;

    const maxHeartRate = allHeartRates.length > 0 
      ? Math.max(...allHeartRates) 
      : undefined;

    const trackpointCount = laps.reduce((sum, lap) => sum + lap.trackpoints.length, 0);

    return {
      id: activity.id,
      sport: activity.sport,
      startTime: laps[0]?.startTime || new Date(),
      duration: totalTimeSeconds,
      distance: totalDistance,
      calories: totalCalories,
      averageHeartRate,
      maxHeartRate,
      trackpointCount
    };
  }

  /**
   * 指定された活動のトラックポイントを取得する
   */
  async getTrackpointsForActivity(identifier: string, activityId: string): Promise<TrackpointSummary[]> {
    const data = await this.repository.getActivityData(identifier);
    const activity = data.activities.find(a => a.id === activityId);
    
    if (!activity) {
      throw new Error(`Activity with id ${activityId} not found`);
    }

    return activity.laps
      .flatMap(lap => lap.trackpoints)
      .map(trackpoint => ({
        time: trackpoint.time,
        position: trackpoint.position,
        altitudeMeters: trackpoint.altitudeMeters,
        distanceMeters: trackpoint.distanceMeters,
        heartRateBpm: trackpoint.heartRateBpm
      }));
  }
}
