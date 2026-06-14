import { observer } from 'mobx-react-lite';
import { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { playerStore } from '@/store/store';

export const CreatePlaylistModal = observer(function CreatePlaylistModal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const titleId = useId();
  const isOpen = playerStore.showCreatePlaylistModal;
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    playerStore.closeCreatePlaylistModal();
    setTitle('');
    setDescription('');
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    playerStore.createPlaylist(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>Создать плейлист</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Закрыть"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="playlist-title">Название</label>
            <input
              id="playlist-title"
              type="text"
              className="modal-input"
              placeholder="Мой плейлист"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="playlist-desc">Описание</label>
            <textarea
              id="playlist-desc"
              className="modal-input modal-textarea"
              placeholder="О чём этот плейлист?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
              Отмена
            </button>
            <button type="submit" className="modal-btn modal-btn-primary" disabled={!title.trim()}>
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
