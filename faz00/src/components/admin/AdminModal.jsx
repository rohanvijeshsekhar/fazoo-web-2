import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const AdminModal = ({ isOpen, onClose, title, children, footer, size = 'default' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`admin-modal${size === 'lg' ? ' admin-modal-lg' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{title}</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="admin-modal-body">
          {children}
        </div>
        {footer && (
          <div className="admin-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-modal" style={{ maxWidth: 420 }}>
        <div className="admin-modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div className="admin-confirm-icon danger">
            <AlertTriangle />
          </div>
          <div className="admin-confirm-title">{title || 'Are you sure?'}</div>
          <div className="admin-confirm-text">{message || 'This action cannot be undone.'}</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="admin-btn admin-btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="admin-btn admin-btn-danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Deleting...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
