'use client';

import { useEffect, useState } from 'react';
import { FileActivityDataRepository } from '../../repository/file';
import { ActivityDataService } from '../../services';
import Map3D from '../../components/Map3D';
import CesiumConfig from '../../components/CesiumConfig';

export default function MapPage() {
  const [trackpoints, setTrackpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        const repository = new FileActivityDataRepository();
        const service = new ActivityDataService(repository);

        // 利用可能なデータソースを取得
        const availableSources = await service.getAvailableDataSources();
        
        if (availableSources.length > 0) {
          // 最初のデータソースから活動データを取得
          const summary = await service.getActivitySummary(availableSources[0]);
          
          if (summary.activities.length > 0) {
            const firstActivity = summary.activities[0];
            setSelectedActivityId(firstActivity.id);
            
            // トラックポイントを取得
            const trackpoints = await service.getTrackpointsForActivity(
              availableSources[0],
              firstActivity.id
            );
            setTrackpoints(trackpoints);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadActivityData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading 3D Map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CesiumConfig />
      <div className="relative">
        <Map3D trackpoints={trackpoints} />
        
        {/* 情報パネル */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-w-sm">
          <h2 className="text-xl font-bold mb-2">Activity Map</h2>
          {trackpoints.length > 0 ? (
            <div className="space-y-2">
              <p><strong>Trackpoints:</strong> {trackpoints.length}</p>
              <p><strong>Activity ID:</strong> {selectedActivityId}</p>
              <p><strong>Route:</strong> Yellow line</p>
              <p><strong>Start:</strong> Green marker</p>
              <p><strong>End:</strong> Red marker</p>
            </div>
          ) : (
            <p>No activity data available</p>
          )}
        </div>
      </div>
    </>
  );
}
