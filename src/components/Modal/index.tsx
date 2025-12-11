import { ReactNode, useEffect } from 'react';
import './style.scss';
import closeIcon from '../../../public/svg/close-icon.svg';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText?: string;
}

const Modal = ({ open, onClose, title, children, onSubmit, submitButtonText = 'Proceed' }: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const content = onSubmit ? (
    <form onSubmit={onSubmit} className="modal-form">
      <div className="modal-content-inner">
        {children}
      </div>
      <div className="modal-actions">
        <button type="submit" className="modal-proceed-button">
          {submitButtonText}
        </button>
      </div>
    </form>
  ) : (
    <div className="modal-content-inner">
      {children}
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div className="modal-body">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;

