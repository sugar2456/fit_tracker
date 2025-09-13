import { TrainingCenterDatabase } from '../../domain';

export const mockXmlData = {
  TrainingCenterDatabase: {
    Activities: [{
      Activity: [{
        $: { Sport: 'Running' },
        Id: ['2025-01-01T10:00:00.000Z'],
        Lap: [{
          $: { StartTime: '2025-01-01T10:00:00.000Z' },
          TotalTimeSeconds: ['1800'], // 30 minutes
          DistanceMeters: ['5000'], // 5km
          Calories: ['300'],
          Intensity: ['Active'],
          TriggerMethod: ['Manual'],
          Track: [{
            Trackpoint: [
              {
                Time: ['2025-01-01T10:00:00.000Z'],
                Position: [{
                  LatitudeDegrees: ['35.6762'],
                  LongitudeDegrees: ['139.6503']
                }],
                AltitudeMeters: ['10.0'],
                DistanceMeters: ['0.0'],
                HeartRateBpm: [{
                  Value: ['120']
                }]
              },
              {
                Time: ['2025-01-01T10:15:00.000Z'],
                Position: [{
                  LatitudeDegrees: ['35.6862'],
                  LongitudeDegrees: ['139.6603']
                }],
                AltitudeMeters: ['15.0'],
                DistanceMeters: ['5000.0'],
                HeartRateBpm: [{
                  Value: ['140']
                }]
              }
            ]
          }]
        }]
      }]
    }]
  }
};

export const mockTrainingCenterDatabase: TrainingCenterDatabase = {
  activities: [{
    id: '2025-01-01T10:00:00.000Z',
    sport: 'Running',
    laps: [{
      startTime: new Date('2025-01-01T10:00:00.000Z'),
      totalTimeSeconds: 1800,
      distanceMeters: 5000,
      calories: 300,
      intensity: 'Active',
      triggerMethod: 'Manual',
      trackpoints: [
        {
          time: new Date('2025-01-01T10:00:00.000Z'),
          position: {
            latitudeDegrees: 35.6762,
            longitudeDegrees: 139.6503
          },
          altitudeMeters: 10.0,
          distanceMeters: 0.0,
          heartRateBpm: {
            value: 120
          }
        },
        {
          time: new Date('2025-01-01T10:15:00.000Z'),
          position: {
            latitudeDegrees: 35.6862,
            longitudeDegrees: 139.6603
          },
          altitudeMeters: 15.0,
          distanceMeters: 5000.0,
          heartRateBpm: {
            value: 140
          }
        }
      ]
    }]
  }]
};
