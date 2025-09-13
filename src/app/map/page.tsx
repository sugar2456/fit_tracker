'use client';

import { useEffect, useState } from 'react';
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
        console.log('Page: Starting data load...');

        // 利用可能なデータソースを取得
        const sourcesResponse = await fetch('/api/activity-data?action=sources');
        if (!sourcesResponse.ok) {
          throw new Error(`Failed to fetch sources: ${sourcesResponse.statusText}`);
        }
        const { sources } = await sourcesResponse.json();
        console.log('Page: Found sources:', sources);

        if (sources.length > 0) {
          // 最初のデータソースから活動データを取得
          const summaryResponse = await fetch(`/api/activity-data?action=summary&source=${encodeURIComponent(sources[0])}`);
          if (!summaryResponse.ok) {
            throw new Error(`Failed to fetch summary: ${summaryResponse.statusText}`);
          }
          const summary = await summaryResponse.json();
          console.log('Page: Got summary:', summary);

          if (summary.activities.length > 0) {
            const firstActivity = summary.activities[0];
            setSelectedActivityId(firstActivity.id);
            console.log('Page: Selected activity:', firstActivity.id);

            // トラックポイントを取得
            const trackpointsUrl = `/api/activity-data?action=trackpoints&source=${encodeURIComponent(sources[0])}&activityId=${encodeURIComponent(firstActivity.id)}`;
            console.log('Page: Fetching trackpoints from:', trackpointsUrl);

            const trackpointsResponse = await fetch(trackpointsUrl);
            if (!trackpointsResponse.ok) {
              throw new Error(`Failed to fetch trackpoints: ${trackpointsResponse.statusText}`);
            }
            const trackpointsData = await trackpointsResponse.json();
            console.log('Page: Received trackpoints data:', trackpointsData);
            console.log('Page: Trackpoints array length:', trackpointsData.trackpoints?.length);

            setTrackpoints(trackpointsData.trackpoints || []);
          }
        }
      } catch (err) {
        console.error('Page: Error loading data:', err);
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

  console.log('Page render: trackpoints state:', trackpoints.length, trackpoints.slice(0, 2));

  return (
    <>
      <CesiumConfig />
      <div className="fixed inset-0">
        <Map3D trackpoints={trackpoints} />

        {/* 情報パネル */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-w-sm z-10">
          <h2 className="text-xl font-bold mb-2">Fitbit Activity Map</h2>
          {trackpoints.length > 0 ? (
            <div className="space-y-2">
              <p><strong>Trackpoints:</strong> {trackpoints.length.toLocaleString()}</p>
              <p><strong>Activity ID:</strong> {selectedActivityId}</p>

              {/* 心拍数情報 */}
              {(() => {
                const heartRates = trackpoints
                  .map(tp => tp.heartRateBpm?.value)
                  .filter((hr): hr is number => hr !== undefined);

                if (heartRates.length > 0) {
                  const avgHR = Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length);
                  const maxHR = Math.max(...heartRates);
                  const minHR = Math.min(...heartRates);

                  return (
                    <div>
                      <p><strong>Avg Heart Rate:</strong> {avgHR} bpm</p>
                      <p><strong>Max Heart Rate:</strong> {maxHR} bpm</p>
                      <p><strong>Min Heart Rate:</strong> {minHR} bpm</p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* 色の説明 */}
              <div className="mt-3 text-sm">
                <p><strong>Route Colors:</strong></p>
                <div className="space-y-1">
                  <p>🔵 Blue: &lt;100 bpm</p>
                  <p>🟢 Green: 100-130 bpm</p>
                  <p>🟡 Yellow: 130-160 bpm</p>
                  <p>🔴 Red: &gt;160 bpm</p>
                </div>
              </div>

              <p className="text-sm"><strong>Start:</strong> Green marker</p>
              <p className="text-sm"><strong>End:</strong> Red marker</p>
            </div>
          ) : (
            <p>No activity data available</p>
          )}
        </div>
      </div>
    </>
  );
}
