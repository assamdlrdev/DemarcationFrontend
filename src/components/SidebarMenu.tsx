import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StorageService from "../services/StorageService";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: { label: string; icon: string }[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "⊞", route: "/lm-dashboard" },
  // {
  //   label: "Land Records",
  //   icon: "📋",
  //   children: [
  //     { label: "Jamabandi", icon: "📄" },
  //     { label: "Mutation Records", icon: "✏️" },
  //     { label: "Patta Records", icon: "📑" },
  //     { label: "Dag Records", icon: "🗂️" },
  //   ],
  // },
  // {
  //   label: "Demarcation",
  //   icon: "📐",
  //   children: [
  //     { label: "New Survey", icon: "🔍" },
  //     { label: "Boundary Disputes", icon: "⚠️" },
  //     { label: "Cadastral Maps", icon: "🗺️" },
  //   ],
  // },
  // {
  //   label: "Encroachment",
  //   icon: "🚧",
  //   children: [
  //     { label: "File Complaint", icon: "📝" },
  //     { label: "View Cases", icon: "👁️" },
  //   ],
  // },
  // {
  //   label: "Revenue Circle",
  //   icon: "🏛️",
  //   children: [
  //     { label: "Circle Offices", icon: "🏢" },
  //     { label: "Officers List", icon: "👤" },
  //   ],
  // },
  // {
  //   label: "Reports",
  //   icon: "📊",
  //   children: [
  //     { label: "Statistical Reports", icon: "📈" },
  //     { label: "Audit Logs", icon: "🔒" },
  //   ],
  // },
  // { label: "Settings", icon: "⚙️" },
];

// ─── Sidebar Component ────────────────────────────────────────────────────────
export default function SidebarMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [user, setUser] = useState<string>('');
  const [userDesigCode, setUserDesigCode] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const cookie = StorageService.getJwtCookie();
    const userProfile: any = StorageService.getJwtCookieData(cookie);
    setUser(userProfile.usercode);
    setUserDesigCode((userProfile.user_desig_code && userProfile.user_desig_code == 'LM') ? 'LRA' : ((userProfile.user_desig_code && userProfile.user_desig_code == 'CO') ? 'Circle Officer' : ''));
    // console.log(userProfile);

  };

  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      setExpandedItem(expandedItem === item.label ? null : item.label);
    } else {
      setActiveItem(item.label);
      setExpandedItem(null);
      console.log(item.route);
      navigate(item.route);
    }
    
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

        :root {
          --sb-top:    #c96040;
          --sb-mid:    #bc5535;
          --sb-deep:   #a84528;

          --sidebar-width: 272px;
          --sidebar-collapsed-width: 66px;
          --transition: 0.28s cubic-bezier(0.4, 0, 0.2, 1);

          --text-bright: #ffffff;
          --text-cream:  #ffeee6;
          --text-muted:  rgba(255, 220, 200, 0.62);
          --border-line: rgba(255, 190, 160, 0.24);
          --hover-bg:    rgba(255, 255, 255, 0.13);
          --active-bg:   rgba(255, 255, 255, 0.22);
          --sub-bg:      rgba(0, 0, 0, 0.10);
        }

        /* ── Wrapper: overflow visible so toggle is never clipped ── */
        .sidebar-wrapper {
          position: relative;
          display: flex;
          flex-shrink: 0;
          /* stretch to fill whatever height .content-wrapper provides */
          align-self: stretch;
        }

        .sidebar {
          width: var(--sidebar-width);
          /* fill the full height of the wrapper — which is driven by the tallest
             sibling (main content), so sidebar always reaches the footer */
          height: 100%;
          min-height: 100%;
          background: linear-gradient(
            180deg,
            var(--sb-top)  0%,
            var(--sb-mid)  52%,
            var(--sb-deep) 100%
          );
          display: flex;
          flex-direction: column;
          font-family: 'Source Sans 3', sans-serif;
          border-right: 1px solid rgba(140, 55, 25, 0.40);
          position: relative;
          transition: width var(--transition);
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 3px 0 16px rgba(0, 0, 0, 0.18);
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,200,170,0.55), transparent);
        }

        /* ── Toggle — sibling of <aside>, never clipped ── */
        .sidebar-toggle {
          position: absolute;
          top: 50%;
          /* flush against the sidebar's right edge, half overlapping */
          right: -14px;
          transform: translateY(-50%);
          width: 28px;
          height: 56px;
          background: var(--sb-mid);
          border: none;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 15px;
          z-index: 200;
          box-shadow: 3px 0 10px rgba(0,0,0,0.25);
          transition: background 0.2s;
          /* keep wrapper overflow visible */
        }

        .sidebar-toggle:hover { background: var(--sb-deep); }

        .sidebar-toggle .t-arrow {
          display: inline-block;
          transition: transform var(--transition);
          line-height: 1;
        }

        /* when collapsed, flip arrow to point right */
        .sidebar-wrapper.collapsed .sidebar-toggle .t-arrow {
          transform: rotate(180deg);
        }

        /* ── Branding strip ── */
        .sidebar-brand {
          padding: 16px 15px 14px;
          border-bottom: 1px solid var(--border-line);
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 64px;
          background: rgba(0, 0, 0, 0.12);
        }

        .brand-seal {
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.40);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #ffeee6;
        }

        .brand-text {
          overflow: hidden;
          white-space: nowrap;
          transition: opacity var(--transition), max-width var(--transition);
          opacity: 1;
          max-width: 200px;
        }

        .sidebar.collapsed .brand-text {
          opacity: 0;
          max-width: 0;
        }

        .brand-title {
          font-family: 'Noto Serif', serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.07em;
          line-height: 1.2;
        }

        .brand-sub {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* ── Section label ── */
        .nav-section-label {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 18px 19px 6px;
          overflow: hidden;
          white-space: nowrap;
          transition: opacity var(--transition);
        }

        .sidebar.collapsed .nav-section-label { opacity: 0; }

        /* ── Nav list ── */
        .nav-list {
          list-style: none;
          margin: 0;
          padding: 4px 9px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,190,160,0.35) transparent;
        }

        .nav-list::-webkit-scrollbar { width: 4px; }
        .nav-list::-webkit-scrollbar-thumb {
          background: rgba(255,190,160,0.35);
          border-radius: 2px;
        }

        .nav-item { margin-bottom: 2px; }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 11px;
          border-radius: 7px;
          cursor: pointer;
          color: var(--text-cream);
          white-space: nowrap;
          transition: background 0.18s, color 0.18s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover {
          background: var(--hover-bg);
          color: var(--text-bright);
        }

        .nav-link.active {
          background: var(--active-bg);
          color: var(--text-bright);
          font-weight: 600;
          box-shadow: inset 3px 0 0 rgba(255,255,255,0.78);
        }

        .nav-link.expanded {
          background: rgba(255,255,255,0.09);
          color: var(--text-bright);
        }

        .nav-icon {
          font-size: 17px;
          flex-shrink: 0;
          width: 23px;
          text-align: center;
          display: inline-block;
          opacity: 0.90;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
          overflow: hidden;
          flex: 1;
          letter-spacing: 0.015em;
          transition: opacity var(--transition), max-width var(--transition);
          max-width: 200px;
        }

        .sidebar.collapsed .nav-label {
          opacity: 0;
          max-width: 0;
        }

        .nav-arrow {
          font-size: 11px;
          color: rgba(255,210,185,0.55);
          transition: transform 0.22s, opacity var(--transition);
          flex-shrink: 0;
        }

        .sidebar.collapsed .nav-arrow { opacity: 0; }

        .nav-link.expanded .nav-arrow {
          transform: rotate(90deg);
          color: rgba(255,255,255,0.88);
        }

        /* ── Submenu ── */
        .sub-menu {
          list-style: none;
          margin: 3px 0 3px 13px;
          padding: 4px 0;
          background: var(--sub-bg);
          border-radius: 6px;
          border-left: 2px solid rgba(255,190,160,0.36);
          overflow: hidden;
        }

        .sidebar.collapsed .sub-menu { display: none; }

        .sub-link {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 13px;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 5px;
          transition: color 0.15s, background 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          white-space: nowrap;
        }

        .sub-link:hover {
          color: var(--text-bright);
          background: rgba(255,255,255,0.10);
        }

        .sub-link.active {
          color: var(--text-bright);
          font-weight: 600;
        }

        .sub-icon { font-size: 12px; opacity: 0.82; }

        /* ── Footer user area ── */
        .sidebar-footer {
          border-top: 1px solid var(--border-line);
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 11px;
          overflow: hidden;
          background: rgba(0,0,0,0.14);
        }

        .user-avatar {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.20);
          border: 1.5px solid rgba(255,200,170,0.52);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #ffffff;
          font-weight: 700;
          font-family: 'Noto Serif', serif;
        }

        .user-info {
          overflow: hidden;
          transition: opacity var(--transition), max-width var(--transition);
          max-width: 200px;
        }

        .sidebar.collapsed .user-info { opacity: 0; max-width: 0; }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
        }

        .user-role {
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
        }

        /* ── Main content companion ── */
        .main-container {
          background: #fdf4f0;
          color: #2c1208;
        }
      `}</style>

      {/*
        .sidebar-wrapper has NO overflow restriction,
        so the toggle pill is always fully visible
      */}
      <div className={`sidebar-wrapper${collapsed ? " collapsed" : ""}`}>
        <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
          {/* Brand */}
          <div className="sidebar-brand">
            <div className="brand-seal">⚖</div>
            <div className="brand-text">
              <div className="brand-title">Demarcation</div>
              <div className="brand-sub">Assam Revenue Dept.</div>
            </div>
          </div>

          {/* Nav */}
          <div className="nav-section-label">Navigation</div>
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => {
              const isExpanded = expandedItem === item.label;
              const isActive   = activeItem === item.label;
              return (
                <li key={item.label} className="nav-item">
                  <button
                    className={`nav-link${isActive ? " active" : ""}${isExpanded ? " expanded" : ""}`}
                    onClick={() => handleNavClick(item)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.children && <span className="nav-arrow">›</span>}
                  </button>

                  {item.children && isExpanded && (
                    <ul className="sub-menu">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <button
                            className={`sub-link${activeItem === child.label ? " active" : ""}`}
                            onClick={() => setActiveItem(child.label)}
                          >
                            <span className="sub-icon">{child.icon}</span>
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="user-avatar">RA</div>
            <div className="user-info">
              <div className="user-name">{userDesigCode}</div>
              <div className="user-role">{user}</div>
            </div>
          </div>
        </aside>

        {/* Toggle lives OUTSIDE <aside> — never clipped by overflow:hidden */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand menu" : "Collapse menu"}
        >
          <span className="t-arrow">‹</span>
        </button>
      </div>
    </>
  );
}
