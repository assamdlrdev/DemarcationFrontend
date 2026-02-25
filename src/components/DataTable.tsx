import { Button } from "@mui/material";
import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ApplicationType {
  serial_no: number;
  application_no: string;
  created_at: string;
  village: string;
  status: "Active" | "Inactive" | "On Leave";
  action: any;
}

interface Column {
  key: keyof ApplicationType;
  label: string;
  sortable: boolean;
}

type SortDir = "asc" | "desc";

type StatusKey = ApplicationType["status"];

interface StatusStyle {
  bg: string;
  text: string;
  dot: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

// const initialData: ApplicationType[] = [
  // { serial_no: 1, application_no: "Aria Chen",      created_at: "Product Designer",    village: "Design",       status: "Active",   action: "Jan 2022" },
  // { serial_no: 2, application_no: "Marcus Webb",    created_at: "Senior Engineer",     village: "Engineering",  status: "Active",   action: "Mar 2021" },
  // { serial_no: 3, application_no: "Priya Nair",     created_at: "Data Analyst",        village: "Analytics",    status: "On Leave", action: "Jul 2023" },
  // { serial_no: 4, application_no: "Leon Fischer",   created_at: "UX Researcher",       village: "Design",       status: "Active",   action: "Nov 2020" },
  // { serial_no: 5, application_no: "Sofia Reyes",    created_at: "Engineering Manager", village: "Engineering",  status: "Active",   action: "Feb 2019" },
  // { serial_no: 6, application_no: "Jin Park",       created_at: "Frontend Developer",  village: "Engineering",  status: "Inactive", action: "Sep 2022" },
  // { serial_no: 7, application_no: "Amara Osei",     created_at: "Brand Strategist",    village: "Marketing",    status: "Active",   action: "May 2023" },
  // { serial_no: 8, application_no: "Oliver Hunt",    created_at: "Data Scientist",      village: "Analytics",    status: "Active",   action: "Aug 2021" },
// ];

const columns: Column[] = [
  { key: "serial_no",       label: "Serial No",       sortable: true  },
  { key: "application_no",       label: "Application No",       sortable: true  },
  { key: "created_at", label: "Created at", sortable: true  },
  { key: "village",     label: "Village",     sortable: true  },
  {key: "status", label: "Status", sortable: true},
  { key: "action",     label: "Action",     sortable: false },
];

const statusStyles: Record<StatusKey, StatusStyle> = {
  Active:   { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  Inactive: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  "On Leave": { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
};

const avatarPalette = ["#fde68a","#a7f3d0","#bfdbfe","#fecdd3","#ddd6fe","#fed7aa","#cffafe"];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("");
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SortIconProps {
  active: boolean;
  dir: SortDir;
}

function SortIcon({ active, dir }: SortIconProps) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 1L8 4H2L5 1Z" fill={active && dir === "asc"  ? "#c2410c" : "#ccc"} />
      <path d="M5 9L2 6H8L5 9Z" fill={active && dir === "desc" ? "#c2410c" : "#ccc"} />
    </svg>
  );
}

interface StatusBadgeProps {
  status: StatusKey;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const c = statusStyles[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: c.bg, color: c.text,
      borderRadius: 20, padding: "3px 10px",
      fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

type DatatableType = {
  info: ApplicationType[];
  handleBtnClick: (e: any) => void
};

// ─── Main Component ──────────────────────────────────────────────────────────

const DataTable: React.FC<DatatableType> = ({info, handleBtnClick}) => {
  const [data, setData]                 = useState<ApplicationType[]>(info);
  const [sortKey, setSortKey]           = useState<keyof ApplicationType | null>(null);
  const [sortDir, setSortDir]           = useState<SortDir>("asc");
  const [search, setSearch]             = useState<string>("");

  useEffect(() => {
    if(info.length > 0) {
      console.log(info);
      setData(info);
    }
  }, [info]);

  

  const handleSort = (key: keyof ApplicationType): void => {
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered: ApplicationType[] = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted: ApplicationType[] = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortKey]).toLowerCase();
        const bv = String(b[sortKey]).toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dt-row { transition: background 0.15s ease; }
        .dt-row:hover { background: #fafaf8 !important; }

        .dt-sort-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #6b6561; padding: 0;
          transition: color 0.15s;
        }
        .dt-sort-btn:hover  { color: #1a1614; }
        .dt-sort-btn.active { color: #c2410c; }

        .dt-search {
          border: none; outline: none; background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #1a1614; width: 220px;
        }
        .dt-search::placeholder { color: #b5afa9; }
      `}</style>

      <div style={styles.wrapper}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Submitted Applications</h1>
            <p style={styles.subtitle}>{sorted.length} applications</p>
          </div>
          <div style={styles.searchBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b5afa9" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="dt-search"
              placeholder="Search people, roles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                {columns.map((col) => (
                  <th key={col.key} style={styles.th}>
                    {col.sortable ? (
                      <button
                        className={`dt-sort-btn${sortKey === col.key ? " active" : ""}`}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        <SortIcon active={sortKey === col.key} dir={sortDir} />
                      </button>
                    ) : (
                      <span style={styles.thLabel}>{col.label}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.empty}>No results found</td>
                </tr>
              ) : (
                sorted.map((row, i) => (
                  <tr
                    key={i}
                    className="dt-row"
                    style={{
                      background: i % 2 === 0 ? "#ffffff" : "#faf9f7",
                      borderBottom: i === sorted.length - 1 ? "none" : "1px solid #ede8e3",
                    }}
                  >
                    <td style={styles.td}>
                      <span style={{ color: "#5a5450", fontSize: 13 }}>{row.serial_no}</span>
                    </td>
                    {/* Name */}
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ ...styles.avatar, background: getAvatarColor(row.application_no) }}>
                          {getInitials(row.application_no)}
                        </div>
                        <span style={{ fontWeight: 500, color: "#1a1614" }}>{row.application_no}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={styles.td}>
                      <span style={{ color: "#5a5450", fontSize: 13 }}>{row.created_at}</span>
                    </td>

                    {/* Department */}
                    <td style={styles.td}>
                      <span style={styles.deptBadge}>{row.village}</span>
                    </td>

                    {/* Status */}
                    <td style={styles.td}>
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Joined */}
                    <td style={{ ...styles.td, color: "#9e9590", fontSize: 13 }}>
                      <Button style={styles.btn} id={row.action} onClick={handleBtnClick}><label style={styles.btnLabel}>Go to Application</label></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div style={styles.footer}>
          Showing {sorted.length} of {data.length} entries
        </div>

      </div>
    </div>
  );
};

export default DataTable;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    // minHeight: "100vh",
    width: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
  },
  wrapper: {
    width: "90%",
    // maxWidth: 900,
    borderRadius: 16,
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 32px 24px",
    borderBottom: "1px solid #ede8e3",
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 26,
    fontWeight: 400,
    color: "#1a1614",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 13,
    color: "#9e9590",
    marginTop: 2,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f7f5f2",
    border: "1px solid #ede8e3",
    borderRadius: 10,
    padding: "9px 14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  theadRow: {
    background: "#faf9f7",
    borderBottom: "2px solid #ede8e3",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
  },
  thLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#6b6561",
  },
  td: {
    padding: "14px 20px",
    fontSize: 14,
    color: "#2c2420",
    verticalAlign: "middle",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#44403c",
    flexShrink: 0,
  },
  deptBadge: {
    background: "#f0ede8",
    color: "#6b6561",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 500,
  },
  empty: {
    textAlign: "center",
    padding: "48px",
    color: "#b5afa9",
    fontSize: 14,
  },
  footer: {
    borderTop: "1px solid #ede8e3",
    padding: "14px 32px",
    fontSize: 12,
    color: "#b5afa9",
    display: "flex",
    justifyContent: "flex-end",
  },
  btn: {
    backgroundColor: "#0d42f0",
    cursor: "pointer"
  },
  btnLabel: {
    color: "white"
  }
};
