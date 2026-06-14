import { observer } from 'mobx-react-lite';
import { useEffect, useId, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { APP_ROUTES, getPlaylistRoute } from '@/app/config/routes';
import { playerStore } from '@/store/store';

export const DeletePlaylistModal = observer(function DeletePlaylistModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const titleId = useId();
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const target = playerStore.deletePlaylistTarget;
  const isOpen = Boolean(target);

  const handleClose = () => {
    playerStore.cancelDeletePlaylist();
  };

  const handleConfirm = () => {
    const deletedId = playerStore.confirmDeletePlaylist();
    if (!deletedId) {
      return;
    }

    if (location.pathname === getPlaylistRoute(deletedId)) {
      navigate(APP_ROUTES.library, { replace: true });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    deleteButtonRef.current?.focus();

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

  if (!target) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content modal-content-confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>Удалить плейлист?</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Закрыть"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <p className="modal-confirm-text">
          Плейлист «{target.title}» будет удалён без возможности восстановления.
        </p>

        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
            Отмена
          </button>
          <button
            ref={deleteButtonRef}
            type="button"
            className="modal-btn modal-btn-danger"
            onClick={handleConfirm}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
});
