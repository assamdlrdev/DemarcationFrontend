import { useState, type ReactNode } from "react";

export interface TabInterface {
  id: string;
  label: string;
  content: ReactNode;
}

type TabbedViewType = {
  tabbedView: TabInterface[]
};



const TabbedView: React.FC<TabbedViewType> = ({tabbedView}) => {
  const [activeTab, setActiveTab] = useState("application_details");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lora:wght@400;500;600&display=swap');
        .tab-btn { transition: all 0.22s ease; cursor: pointer; border: none; background: none; outline: none; }
        .tab-btn:hover { color: #b85c38 !important; }
        .tab-content-enter { animation: fadeSlide 0.28s ease forwards; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        width: "100%",
        minHeight: 420,
        background: "linear-gradient(160deg, #fdf4ee 0%, #faf0e8 100%)",
        borderRadius: 0,
        overflow: "hidden",
        fontFamily: "'Lora', serif",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Tab Bar */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          padding: "0 36px",
          borderBottom: "2px solid #deb99a",
          gap: 4,
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(4px)"
        }}>
          {tabbedView.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className="tab-btn"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "14px 28px 12px",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#b85c38" : "#c49070",
                  borderBottom: isActive ? "3px solid #b85c38" : "3px solid transparent",
                  marginBottom: -2,
                  borderRadius: "6px 6px 0 0",
                  background: isActive ? "rgba(222,185,154,0.18)" : "transparent",
                  letterSpacing: "0.02em"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div key={activeTab} className="tab-content-enter" style={{ flex: 1 }}>
          {tabbedView.find(t => t.id === activeTab)?.content}
        </div>
      </div>
    </>
  );
}

export default TabbedView;
