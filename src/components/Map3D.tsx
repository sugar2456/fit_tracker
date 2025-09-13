'use client';

import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

interface Map3DProps {
  trackpoints?: Array<{
    time: string | Date;
    position?: {
      latitudeDegrees: number;
      longitudeDegrees: number;
    };
    altitudeMeters?: number;
    distanceMeters?: number;
    heartRateBpm?: {
      value: number;
    };
  }>;
}

export default function Map3D({ trackpoints = [] }: Map3DProps) {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const initializingRef = useRef<boolean>(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // trackpoints処理を関数として分離
  const processTrackpoints = (viewer: Cesium.Viewer, trackpointsData: typeof trackpoints) => {
    console.log('Map3D: Processing trackpoints:', trackpointsData.length, trackpointsData.slice(0, 3));

    // 既存のエンティティを削除
    viewer.entities.removeAll();

    // トラックポイントがある場合、それらを地図上に表示
    if (trackpointsData.length > 0) {
      // トラックポイントの配列を作成
      const validTrackpoints = trackpointsData.filter(tp => tp.position);
      console.log('Map3D: Valid trackpoints with position:', validTrackpoints.length);
      console.log('Map3D: First trackpoint:', validTrackpoints[0]);

      const positions = validTrackpoints.map(tp =>
        Cesium.Cartesian3.fromDegrees(
          tp.position!.longitudeDegrees,
          tp.position!.latitudeDegrees,
          tp.altitudeMeters || 0
        )
      );

      console.log('Map3D: Generated positions:', positions.length);

      if (positions.length > 0) {
        console.log('Map3D: Creating route with', positions.length, 'positions');

        // まずは単色のルートを表示してテスト
        viewer.entities.add({
          polyline: {
            positions: positions,
            width: 6,
            material: Cesium.Color.YELLOW,
            clampToGround: true,
          },
        });
        console.log('Map3D: Added main route polyline');

        // 心拍数データがある場合は色分けしたポリラインも追加
        const hasHeartRate = trackpointsData.some(tp => tp.heartRateBpm?.value);
        console.log('Map3D: Has heart rate data:', hasHeartRate);

        if (hasHeartRate && positions.length > 1) {
          console.log('Map3D: Adding colored segments for heart rate visualization');
          // 心拍数に基づいて色分けしたセグメントを作成
          for (let i = 0; i < positions.length - 1; i++) {
            const currentHR = validTrackpoints[i]?.heartRateBpm?.value;
            let color = Cesium.Color.GRAY; // デフォルト

            if (currentHR) {
              // 心拍数に基づいて色を決定 (60-200bpmを想定)
              if (currentHR < 100) color = Cesium.Color.BLUE; // 低心拍数
              else if (currentHR < 130) color = Cesium.Color.GREEN; // 中程度
              else if (currentHR < 160) color = Cesium.Color.YELLOW; // 高め
              else color = Cesium.Color.RED; // 高心拍数
            }

            viewer.entities.add({
              polyline: {
                positions: [positions[i], positions[i + 1]],
                width: 8,
                material: color,
                clampToGround: true,
              },
            });
          }
          console.log('Map3D: Added', positions.length - 1, 'colored segments');
        }

        // スタートポイント
        viewer.entities.add({
          position: positions[0],
          point: {
            pixelSize: 10,
            color: Cesium.Color.GREEN,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: 'Start',
            font: '12pt sans-serif',
            pixelOffset: new Cesium.Cartesian2(0, -40),
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
          },
        });

        // エンドポイント
        if (positions.length > 1) {
          viewer.entities.add({
            position: positions[positions.length - 1],
            point: {
              pixelSize: 10,
              color: Cesium.Color.RED,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
            },
            label: {
              text: 'End',
              font: '12pt sans-serif',
              pixelOffset: new Cesium.Cartesian2(0, -40),
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
            },
          });
        }

        // カメラをルート全体が見えるように設定
        viewer.camera.flyToBoundingSphere(
          Cesium.BoundingSphere.fromPoints(positions),
          {
            duration: 2.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 1000),
          }
        );
      }
    }
  };

  useEffect(() => {
    if (!cesiumContainer.current || viewerRef.current || initializingRef.current) return;

    initializingRef.current = true;

    const initializeViewer = async () => {
      try {
        // 地形プロバイダーを非同期で作成
        const terrainProvider = await Cesium.createWorldTerrainAsync();

        // 再度チェック（非同期処理中に他のインスタンスが作成されていないか）
        if (viewerRef.current) {
          initializingRef.current = false;
          return;
        }

        // CesiumJSビューアーを初期化
        const viewer = new Cesium.Viewer(cesiumContainer.current!, {
          terrainProvider: terrainProvider,
          timeline: false,
          animation: false,
          baseLayerPicker: false,
          fullscreenButton: false,
          vrButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          navigationHelpButton: false,
          navigationInstructionsInitiallyVisible: false,
        });

        viewerRef.current = viewer;

        // 少し待ってからリサイズを実行
        setTimeout(() => {
          if (viewerRef.current) {
            viewerRef.current.resize();
          }
        }, 100);

        // ResizeObserverでコンテナサイズ変更を監視
        resizeObserverRef.current = new ResizeObserver(() => {
          if (viewerRef.current) {
            viewerRef.current.resize();
          }
        });
        resizeObserverRef.current.observe(cesiumContainer.current!);

        // デフォルトの位置（東京）に設定
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895, 10000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0.0,
          },
        });

        console.log('Map3D: Viewer initialized, current trackpoints length:', trackpoints.length);

        // ビューアー初期化完了時にtrackpointsが既にある場合は処理する
        if (trackpoints.length > 0) {
          console.log('Map3D: Processing existing trackpoints after viewer initialization');
          processTrackpoints(viewer, trackpoints);
        }
      } finally {
        initializingRef.current = false;
      }
    };

    initializeViewer();

    // クリーンアップ
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      initializingRef.current = false;
    };
  }, []);

  // trackpointsが変更されたときの処理を別のuseEffectで行う
  useEffect(() => {
    console.log('Map3D useEffect triggered with trackpoints:', trackpoints.length);

    const viewer = viewerRef.current;
    if (!viewer) {
      console.log('Map3D: Viewer not ready, skipping trackpoints update');
      return;
    }

    processTrackpoints(viewer, trackpoints);
  }, [trackpoints]);


  return (
    <div
      ref={cesiumContainer}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
