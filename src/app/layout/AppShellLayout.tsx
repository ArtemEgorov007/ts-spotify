import { Outlet } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { TopBar } from '@/app/components/TopBar';
import { PlayerBar } from '@/modules/player/PlayerBar';
import { CreatePlaylistModal } from '@/app/components/CreatePlaylistModal';
import { DeletePlaylistModal } from '@/app/components/DeletePlaylistModal';
import { playerStore } from '@/store/store';
import { STORAGE_KEYS } from '@/app/config/storage';

function readInitialSidebarCollapsed() {
  return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    return true;
  }

  return Boolean(target.closest('button, a[href], [role="button"], [contenteditable="true"]'));
}

export function AppShellLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readInitialSidebarCollapsed);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      playerStore.showCreatePlaylistModal ||
      playerStore.deletePlaylistTargetId ||
      isEditableTarget(e.target)
    ) {
      return;
    }

    const durationMax =
      playerStore.duration > 0
        ? playerStore.duration
        : (playerStore.currentTrack?.durationSec ?? 0);

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        playerStore.togglePlayback();
        break;
      case 'ArrowRight':
        if (e.shiftKey) {
          playerStore.next();
        } else if (playerStore.currentTrack) {
          playerStore.seekTo(Math.min(playerStore.currentTime + 10, durationMax));
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
      <a href="#main-content" className="skip-link">
        Перейти к содержимому
      </a>
      <Sidebar collapsed={sidebarCollapsed} onToggleMode={toggleSidebarMode} />
      <div className="app-main">
        <TopBar />
        <main id="main-content" className="app-content-area" tabIndex={-1}>
          <div className="app-page">
            <Outlet />
          </div>
        </main>
      </div>
      <PlayerBar />
      <CreatePlaylistModal />
      <DeletePlaylistModal />
    </div>
  );
}
