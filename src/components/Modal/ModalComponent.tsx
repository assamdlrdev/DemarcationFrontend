import React, { useEffect, type ReactNode } from "react";
import "./modal.scss";

interface ModalComponentType {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}



const ModalComponent: React.FC<ModalComponentType> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: any) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
        <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>
                ✕
            </button>
            </div>

            <div className="modal-body">
                {children}
            </div>
        </div>
    </div>
  );
};

export default ModalComponent;
