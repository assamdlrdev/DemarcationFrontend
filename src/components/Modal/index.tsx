import { useEffect, cloneElement, isValidElement } from 'react';
import type { ReactNode } from 'react';
import './style.scss';
import closeIcon from '../../../public/svg/close-icon.svg';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText?: string;
  customFooter?: ReactNode;
}

const Modal = ({ open, onClose, title, children, onSubmit, submitButtonText = 'Proceed', customFooter }: ModalProps) => {
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

  const formId = onSubmit ? 'modal-form' : undefined;

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
          {onSubmit ? (
            <form id={formId} onSubmit={onSubmit} className="modal-form">
              <div className="modal-content-inner">
                {children}
              </div>
            </form>
          ) : (
            <div className="modal-content-inner">
              {children}
            </div>
          )}
        </div>
        {onSubmit && (
          <div className="modal-actions">
            {customFooter ? (
              <div style={{ width: '100%' }}>
                {isValidElement(customFooter) && 
                 (customFooter as React.ReactElement<any>).props?.type === 'submit'
                  ? cloneElement(customFooter as React.ReactElement<any>, { form: formId })
                  : customFooter
                }
              </div>
            ) : (
              <button type="submit" form={formId} className="modal-proceed-button">
                {submitButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;