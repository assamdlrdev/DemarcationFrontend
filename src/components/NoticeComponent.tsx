import React from "react";
import type { ApplicationType } from "./ApplicationDetailsCo";

type NoticeType = {
  application: ApplicationType
};

const NoticeComponent: React.FC<NoticeType> = ({application}) => {
  const handleDownload = () => {
    const printContents = document.getElementById("letter-content")!.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notice Letter</title>
          <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'EB Garamond', Georgia, serif;
              background: #fff;
              color: #1a1a1a;
            }
            .letter-page {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              padding: 22mm 25mm 20mm 25mm;
              background: #fff;
            }
            .top-bar {
              height: 4px;
              background: linear-gradient(90deg, #1a1a2e 60%, #b8962e 100%);
              margin-bottom: 28px;
            }
            .org-name {
              font-family: 'Cormorant Garamond', serif;
              font-size: 11px;
              font-weight: 300;
              letter-spacing: 0.3em;
              text-transform: uppercase;
              color: #1a1a2e;
              margin-bottom: 4px;
            }
            .org-address {
              font-size: 11px;
              color: #888;
              margin-bottom: 24px;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              color: #555;
              border-bottom: 0.5px solid #ccc;
              padding-bottom: 10px;
              margin-bottom: 32px;
            }
            .heading-wrap {
              text-align: center;
              margin-bottom: 32px;
            }
            .notice-label {
              font-family: 'Cormorant Garamond', serif;
              font-size: 10px;
              letter-spacing: 0.4em;
              text-transform: uppercase;
              color: #b8962e;
              margin-bottom: 6px;
            }
            .heading-title {
              font-family: 'Cormorant Garamond', serif;
              font-size: 26px;
              font-weight: 600;
              color: #1a1a2e;
              letter-spacing: 0.02em;
              line-height: 1.2;
              margin: 0;
            }
            .heading-rule {
              width: 80px;
              height: 1px;
              background: linear-gradient(90deg, transparent, #b8962e, transparent);
              margin: 12px auto 0;
            }
            .salutation {
              font-size: 14px;
              margin-bottom: 16px;
              line-height: 1.8;
            }
            .body-para {
              font-size: 14px;
              line-height: 1.9;
              color: #2a2a2a;
              text-align: justify;
              margin-bottom: 14px;
            }
            .closing {
              font-size: 14px;
              margin-top: 24px;
              margin-bottom: 48px;
            }
            .sig-block {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              text-align: right;
            }
            .sig-name {
              font-family: 'Cormorant Garamond', serif;
              font-size: 17px;
              font-weight: 600;
              color: #1a1a2e;
              letter-spacing: 0.03em;
            }
            .sig-rule {
              width: 64px;
              height: 0.5px;
              background: #1a1a2e;
              margin: 6px 0;
            }
            .sig-designation {
              font-size: 11px;
              color: #555;
              letter-spacing: 0.1em;
              text-transform: uppercase;
            }
            .sig-org {
              font-size: 11px;
              color: #999;
              margin-top: 3px;
            }
            .letter-footer {
              margin-top: 52px;
              border-top: 0.5px solid #ddd;
              padding-top: 10px;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #bbb;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 600);
  };

  const bodyParagraphs: string[] = [
    `This notice is to inform all students, faculty, and administrative staff that the Annual Academic Review and Assessment for the academic year 2024–2025 will be conducted from 10th April 2025 to 25th April 2025. All departments are required to ensure that their respective records, attendance registers, and academic portfolios are updated and submitted to the Academic Affairs Office no later than 5th April 2025.`,
    `Department Heads are hereby instructed to schedule internal review meetings with their respective faculty panels before 31st March 2025. Any discrepancies found in the academic records must be rectified and resubmitted with a written explanation addressed to the Dean of Academic Affairs within the stipulated deadline.`,
    `Students who have pending assignments, project submissions, or incomplete assessments are advised to contact their respective faculty coordinators at the earliest. No extensions will be granted beyond the dates specified in the academic calendar. Strict compliance with the above instructions is expected from all concerned parties.`,
    `For queries and further clarifications, please contact the Academic Affairs Office during working hours (9:00 AM – 5:00 PM, Monday to Friday) or write to academics@nit.edu.in.`,
  ];

  /* ── inline styles (kept as const objects for reuse) ── */
  const S = {
    wrapper: {
      minHeight: "100vh",
      background: "#e8e4dc",
      fontFamily: "'EB Garamond', Georgia, serif",
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      padding: "40px 20px",
    } as React.CSSProperties,

    toolbar: {
      width: "100%",
      maxWidth: "820px",
      display: "flex" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: "20px",
    } as React.CSSProperties,

    toolbarLabel: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "13px",
      letterSpacing: "0.3em",
      textTransform: "uppercase" as const,
      color: "#555",
    } as React.CSSProperties,

    paper: {
      width: "100%",
      maxWidth: "820px",
      background: "#fffef9",
      boxShadow: "0 4px 40px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.08)",
    } as React.CSSProperties,

    page: {
      padding: "52px 72px 56px 72px",
      fontFamily: "'EB Garamond', Georgia, serif",
      color: "#1a1a1a",
    } as React.CSSProperties,
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      <div style={S.wrapper}>
        {/* ── Toolbar ── */}
        <div style={S.toolbar}>
          <span style={S.toolbarLabel}>Notice Preview</span>

          <button
            onClick={handleDownload}
            style={{
              background: "#1a1a2e",
              color: "#e8e4dc",
              border: "none",
              padding: "10px 28px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "13px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#b8962e")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a2e")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* ── Letter Paper ── */}
        <div style={S.paper}>
          <div id="letter-content">
            <div className="letter-page" style={S.page}>

              {/* Top accent bar */}
              <div
                style={{
                  height: "4px",
                  background: "linear-gradient(90deg, #1a1a2e 60%, #b8962e 100%)",
                  marginBottom: "28px",
                }}
              />

              {/* Organisation header */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "11px",
                    fontWeight: 300,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#1a1a2e",
                    marginBottom: "4px",
                  }}
                >
                  Northgate Institute of Technology
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  12 University Avenue, Innovation District · New Delhi – 110001
                </div>
              </div>

              {/* Ref + Date row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#555",
                  borderBottom: "0.5px solid #ccc",
                  paddingBottom: "10px",
                  marginBottom: "32px",
                }}
              >
                <span>Ref No: NIT/DIR/2025/042</span>
                <span>Date: 15 March 2025</span>
              </div>

              {/* ── Centered Heading ── */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "10px",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: "#b8962e",
                    marginBottom: "6px",
                  }}
                >
                  Official Notice
                </div>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "26px",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    letterSpacing: "0.02em",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Annual Academic Review &amp; Assessment
                </h1>
                <div
                  style={{
                    width: "80px",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, #b8962e, transparent)",
                    margin: "12px auto 0",
                  }}
                />
              </div>

              {/* Salutation */}
              <p style={{ fontSize: "14px", marginBottom: "16px", lineHeight: 1.8 }}>
                Dear Students and Faculty Members,
              </p>

              {/* Body paragraphs */}
              {bodyParagraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.9",
                    color: "#2a2a2a",
                    textAlign: "justify",
                    marginBottom: "14px",
                  }}
                >
                  {para}
                </p>
              ))}

              {/* Closing */}
              <p style={{ fontSize: "14px", marginTop: "24px", marginBottom: "48px" }}>
                Yours sincerely,
              </p>

              {/* ── Right-aligned Signature Block ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "17px",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    letterSpacing: "0.03em",
                  }}
                >
                  Dr. Arjun Mehta
                </div>
                <div
                  style={{
                    width: "64px",
                    height: "0.5px",
                    background: "#1a1a2e",
                    margin: "6px 0",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Director of Academic Affairs
                </div>
                <div style={{ fontSize: "11px", color: "#999", marginTop: "3px" }}>
                  Northgate Institute of Technology
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: "52px",
                  borderTop: "0.5px solid #ddd",
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "#bbb",
                }}
              >
                <span>Northgate Institute of Technology — Confidential</span>
                <span>Page 1 of 1</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeComponent;
