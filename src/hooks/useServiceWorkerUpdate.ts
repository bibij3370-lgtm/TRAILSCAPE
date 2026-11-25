import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateFn, setUpdateFn] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        // Offline shell precached cleanly
      },
    });

    setUpdateFn(() => updateSW);
  }, []);

  const applyUpdate = async () => {
    if (updateFn) {
      await updateFn(true);
    }
    setNeedRefresh(false);
  };

  const dismissUpdate = () => setNeedRefresh(false);

  return {
    needRefresh,
    applyUpdate,
    dismissUpdate,
  };
}
