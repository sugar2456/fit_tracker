import { ActivityDataService, ActivitySummary, ActivityInfo, TrackpointSummary } from '../services';
import { ActivityDataRepository } from '../repository/interfaces';
import { TrainingCenterDatabase } from '../domain';
import { mockTrainingCenterDatabase } from './mocks/mockData';

describe('ActivityDataService', () => {
  let service: ActivityDataService;
  let mockRepository: jest.Mocked<ActivityDataRepository>;

  beforeEach(() => {
    mockRepository = {
      getActivityData: jest.fn(),
      getAvailableDataSources: jest.fn()
    };
    service = new ActivityDataService(mockRepository);
  });

  describe('getActivitySummary', () => {
    it('should process activity data and return summary', async () => {
      // Arrange
      const identifier = '/path/to/data.xml';
      mockRepository.getActivityData.mockResolvedValue(mockTrainingCenterDatabase);

      // Act
      const result = await service.getActivitySummary(identifier);

      // Assert
      expect(mockRepository.getActivityData).toHaveBeenCalledWith(identifier);
      expect(result).toEqual({
        totalActivities: 1,
        totalDistance: 5000,
        totalCalories: 300,
        totalTimeSeconds: 1800,
        averageHeartRate: 130, // (120 + 140) / 2
        activities: [
          {
            id: '2025-01-01T10:00:00.000Z',
            sport: 'Running',
            startTime: new Date('2025-01-01T10:00:00.000Z'),
            duration: 1800,
            distance: 5000,
            calories: 300,
            averageHeartRate: 130,
            maxHeartRate: 140,
            trackpointCount: 2
          }
        ]
      });
    });

    it('should handle multiple activities correctly', async () => {
      // Arrange
      const multiActivityData: TrainingCenterDatabase = {
        activities: [
          {
            id: 'activity1',
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
                  heartRateBpm: { value: 120 }
                },
                {
                  time: new Date('2025-01-01T10:15:00.000Z'),
                  heartRateBpm: { value: 140 }
                }
              ]
            }]
          },
          {
            id: 'activity2',
            sport: 'Cycling',
            laps: [{
              startTime: new Date('2025-01-02T10:00:00.000Z'),
              totalTimeSeconds: 3600,
              distanceMeters: 20000,
              calories: 600,
              intensity: 'Active',
              triggerMethod: 'Manual',
              trackpoints: [
                {
                  time: new Date('2025-01-02T10:00:00.000Z'),
                  heartRateBpm: { value: 100 }
                },
                {
                  time: new Date('2025-01-02T11:00:00.000Z'),
                  heartRateBpm: { value: 160 }
                }
              ]
            }]
          }
        ]
      };

      mockRepository.getActivityData.mockResolvedValue(multiActivityData);

      // Act
      const result = await service.getActivitySummary('/path/to/data.xml');

      // Assert
      expect(result.totalActivities).toBe(2);
      expect(result.totalDistance).toBe(25000);
      expect(result.totalCalories).toBe(900);
      expect(result.totalTimeSeconds).toBe(5400);
      expect(result.averageHeartRate).toBe(130); // (130 + 130) / 2
      expect(result.activities).toHaveLength(2);
    });

    it('should handle activities without heart rate data', async () => {
      // Arrange
      const dataWithoutHeartRate: TrainingCenterDatabase = {
        activities: [{
          id: 'activity-no-hr',
          sport: 'Walking',
          laps: [{
            startTime: new Date('2025-01-01T10:00:00.000Z'),
            totalTimeSeconds: 1800,
            distanceMeters: 3000,
            calories: 150,
            intensity: 'Active',
            triggerMethod: 'Manual',
            trackpoints: [
              {
                time: new Date('2025-01-01T10:00:00.000Z')
                // No heart rate data
              }
            ]
          }]
        }]
      };

      mockRepository.getActivityData.mockResolvedValue(dataWithoutHeartRate);

      // Act
      const result = await service.getActivitySummary('/path/to/data.xml');

      // Assert
      expect(result.averageHeartRate).toBeUndefined();
      expect(result.activities[0].averageHeartRate).toBeUndefined();
      expect(result.activities[0].maxHeartRate).toBeUndefined();
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const error = new Error('Repository error');
      mockRepository.getActivityData.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getActivitySummary('/path/to/data.xml')).rejects.toThrow('Repository error');
    });
  });

  describe('getAvailableDataSources', () => {
    it('should return available data sources from repository', async () => {
      // Arrange
      const mockSources = ['/path/to/file1.xml', '/path/to/file2.xml'];
      mockRepository.getAvailableDataSources.mockResolvedValue(mockSources);

      // Act
      const result = await service.getAvailableDataSources();

      // Assert
      expect(mockRepository.getAvailableDataSources).toHaveBeenCalled();
      expect(result).toEqual(mockSources);
    });
  });

  describe('getTrackpointsForActivity', () => {
    it('should return trackpoints for specified activity', async () => {
      // Arrange
      const identifier = '/path/to/data.xml';
      const activityId = '2025-01-01T10:00:00.000Z';
      mockRepository.getActivityData.mockResolvedValue(mockTrainingCenterDatabase);

      // Act
      const result = await service.getTrackpointsForActivity(identifier, activityId);

      // Assert
      expect(mockRepository.getActivityData).toHaveBeenCalledWith(identifier);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
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
      });
    });

    it('should throw error when activity not found', async () => {
      // Arrange
      const identifier = '/path/to/data.xml';
      const nonExistentActivityId = 'non-existent-id';
      mockRepository.getActivityData.mockResolvedValue(mockTrainingCenterDatabase);

      // Act & Assert
      await expect(
        service.getTrackpointsForActivity(identifier, nonExistentActivityId)
      ).rejects.toThrow('Activity with id non-existent-id not found');
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const identifier = '/path/to/data.xml';
      const activityId = '2025-01-01T10:00:00.000Z';
      const error = new Error('Repository error');
      mockRepository.getActivityData.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.getTrackpointsForActivity(identifier, activityId)
      ).rejects.toThrow('Repository error');
    });
  });

  describe('processActivityData (private method)', () => {
    it('should handle empty activities array', async () => {
      // Arrange
      const emptyData: TrainingCenterDatabase = { activities: [] };
      mockRepository.getActivityData.mockResolvedValue(emptyData);

      // Act
      const result = await service.getActivitySummary('/path/to/data.xml');

      // Assert
      expect(result).toEqual({
        totalActivities: 0,
        totalDistance: 0,
        totalCalories: 0,
        totalTimeSeconds: 0,
        averageHeartRate: undefined,
        activities: []
      });
    });
  });
});
