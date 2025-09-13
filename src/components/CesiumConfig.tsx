'use client';

import { useEffect } from 'react';

export default function CesiumConfig() {
  useEffect(() => {
    // CesiumJSの設定
    if (typeof window !== 'undefined') {
      (window as any).CESIUM_BASE_URL = '/cesium/';
    }
  }, []);

  return null;
}
