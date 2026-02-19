import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { TopBar } from '@/app/components/TopBar';
import { PlayerBar } from '@/modules/player/PlayerBar';
import { playerStore } from '@/store/store';
import { mockTracks } from '@/shared/mock/media';
import { STORAGE_KEYS } from '@/app/config/storage';

function readInitialSidebarCollapsed() {
  return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
}

export function AppShellLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readInitialSidebarCollapsed);

  useEffect(() => {
    if (playerStore.queue.length === 0) {
      playerStore.setQueue(mockTracks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebarMode = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className={`app-shell-layout${sidebarCollapsed ? ' app-shell-layout-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggleMode={toggleSidebarMode} />
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
