import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { TopBar } from '@/app/components/TopBar';
import { PlayerBar } from '@/modules/player/PlayerBar';
import { playerStore } from '@/store/store';
import { mockTracks } from '@/shared/mock/media';

export function AppShellLayout() {
  useEffect(() => {
    if (playerStore.queue.length === 0) {
      playerStore.setQueue(mockTracks);
    }
  }, []);

  return (
    <div className="app-shell-layout">
      <Sidebar />
      <div className="app-main">
        <TopBar />
        <section className="app-content-area">
          <Outlet />
        </section>
      </div>
      <PlayerBar />
    </div>
  );
}
