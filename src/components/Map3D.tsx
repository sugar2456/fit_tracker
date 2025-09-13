'use client';

import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

interface Map3DProps {
  trackpoints?: Array<{
    time: Date;
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

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // CesiumJSビューアーを初期化
    const viewer = new Cesium.Viewer(cesiumContainer.current, {
      terrainProvider: Cesium.createWorldTerrain(),
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

    // トラックポイントがある場合、それらを地図上に表示
    if (trackpoints.length > 0) {
      // トラックポイントの配列を作成
      const positions = trackpoints
        .filter(tp => tp.position)
        .map(tp => 
          Cesium.Cartesian3.fromDegrees(
            tp.position!.longitudeDegrees,
            tp.position!.latitudeDegrees,
            tp.altitudeMeters || 0
          )
        );

      if (positions.length > 0) {
        // ポリラインでルートを表示
        viewer.entities.add({
          polyline: {
            positions: positions,
            width: 4,
            material: Cesium.Color.YELLOW,
            clampToGround: true,
          },
        });

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
        viewer.flyToBoundingSphere(
          Cesium.BoundingSphere.fromPoints(positions),
          {
            duration: 2.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 1000),
          }
        );
      }
    } else {
      // デフォルトの位置（東京）に設定
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895, 10000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0.0,
        },
      });
    }

    // クリーンアップ
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [trackpoints]);

  return (
    <div
      ref={cesiumContainer}
      className="w-full h-screen"
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
