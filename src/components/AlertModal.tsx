import ModalComponent from "./Modal/modalComponent";


type AlertModalType = {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    message: string;
    handleSubmit: () => Promise<void>

};


const AlertModal: React.FC<AlertModalType> = ({modalOpen, setModalOpen, title, message, handleSubmit}) => {
    return (
        <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)} title={title}>
            <div style={{ padding: "16px 0", fontFamily: "sans-serif" }}>
                <p style={{ color: "#5a4a3f", fontSize: "15px", marginBottom: "24px" }}>
                    {message}
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                {/* Cancel Button */}
                <button
                    onClick={() => setModalOpen(false)}
                    style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1.5px solid #d6b8a3",
                    backgroundColor: "transparent",
                    color: "#7a5c4e",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    }}
                >
                    Cancel
                </button>

                {/* Submit Button */}
                <button
                    onClick={
                    // your submit logic here
                    // setModalOpen(false);
                    handleSubmit
                    }
                    style={{
                    padding: "10px 24px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#e8c9b0",
                    color: "#5a3e2b",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    boxShadow: "0 2px 6px rgba(200, 150, 110, 0.3)",
                    transition: "background-color 0.2s ease",
                    }}
                    
                >
                    Submit
                </button>
                </div>
            </div>
        </ModalComponent>
    );
};

export default AlertModal;