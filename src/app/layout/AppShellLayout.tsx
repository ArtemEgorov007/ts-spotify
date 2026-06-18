import { Outlet } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Sidebar } from '@/app/components/Sidebar';
import { TopBar } from '@/app/components/TopBar';
import { PlayerBar } from '@/modules/player/PlayerBar';
import { CreatePlaylistModal } from '@/app/components/CreatePlaylistModal';
import { DeletePlaylistModal } from '@/app/components/DeletePlaylistModal';
import { playerStore } from '@/store/store';
import { STORAGE_KEYS } from '@/app/config/storage';
import { AmbientBackdrop } from '@/shared/ui/AmbientBackdrop';
import { useMoodAmbient } from '@/shared/hooks/useMoodAmbient';
import type { MoodKey } from '@/shared/api/jamendo';

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

export const AppShellLayout = observer(function AppShellLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readInitialSidebarCollapsed);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const moodKey = (playerStore.selectedHomeMoodKey ?? 'energy') as MoodKey;
  useMoodAmbient(moodKey, shellRef);

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

  useEffect(() => {
    const content = document.querySelector<HTMLElement>('.app-content-area');
    if (!content) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const horizontalStrip = target.closest<HTMLElement>('.track-row, .mood-chips');
      if (!horizontalStrip) {
        return;
      }

      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      content.scrollTop += event.deltaY;
      event.preventDefault();
    };

    content.addEventListener('wheel', onWheel, { passive: false });
    return () => content.removeEventListener('wheel', onWheel);
  }, []);

  const toggleSidebarMode = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`app-shell-layout${sidebarCollapsed ? ' app-shell-layout-collapsed' : ''}`}
      ref={shellRef}
    >
      <AmbientBackdrop />
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
});
