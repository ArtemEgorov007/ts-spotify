import { Outlet } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { TopBar } from '@/app/components/TopBar';
import { PlayerBar } from '@/modules/player/PlayerBar';
import { CreatePlaylistModal } from '@/app/components/CreatePlaylistModal';
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        playerStore.togglePlayback();
        break;
      case 'ArrowRight':
        if (e.shiftKey) {
          playerStore.next();
        } else if (playerStore.currentTrack) {
          playerStore.seekTo(
            Math.min(playerStore.currentTime + 10, playerStore.currentTrack.durationSec),
          );
        }
        break;
      case 'ArrowLeft':
        if (e.shiftKey) {
          playerStore.prev();
        } else {
          playerStore.seekTo(Math.max(playerStore.currentTime - 10, 0));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        playerStore.setVolume(playerStore.volume + 0.05);
        break;
      case 'ArrowDown':
        e.preventDefault();
        playerStore.setVolume(playerStore.volume - 0.05);
        break;
      case 'KeyM':
        playerStore.toggleMute();
        break;
      case 'KeyS':
        playerStore.toggleShuffle();
        break;
      case 'KeyR':
        playerStore.toggleRepeat();
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
      <CreatePlaylistModal />
    </div>
  );
}
