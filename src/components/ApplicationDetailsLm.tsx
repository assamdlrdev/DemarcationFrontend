import React, { useState } from "react";
import type { ReactNode } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #f8ede3;
    --cream-dark: #f0e0d0;
    --cream-border: #e2c9b5;
    --brown-light: #c4a882;
    --brown: #9a7358;
    --brown-dark: #6b4f38;
    --text: #3d2b1f;
    --text-muted: #8a6f5e;
    --card-bg: #fdf6f0;
    --white: #fff9f5;
    --accent: #b87d55;
  }

  body {
    background: var(--cream);
    min-height: 100vh;
  }

  .dashboard {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    padding: 40px 32px;
    color: var(--text);
  }

  .dashboard-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 600;
    color: var(--brown-dark);
    margin-bottom: 32px;
    letter-spacing: 0.02em;
    border-bottom: 1.5px solid var(--cream-border);
    padding-bottom: 16px;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .card {
    background: var(--card-bg);
    border: 1px solid var(--cream-border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(154, 115, 88, 0.08);
    transition: box-shadow 0.2s ease;
  }

  .card:hover {
    box-shadow: 0 6px 24px rgba(154, 115, 88, 0.14);
  }

  .card-header {
    background: linear-gradient(135deg, #f0dfd0 0%, #e8d0bc 100%);
    padding: 14px 22px;
    border-bottom: 1px solid var(--cream-border);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .card-header-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  .card-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--brown-dark);
    letter-spacing: 0.03em;
  }

  .card-body {
    padding: 0;
    overflow-x: auto;
  }

  .card-body.form-body {
    padding: 24px 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
  }

  thead tr {
    background: linear-gradient(135deg, #ead8c8 0%, #dfc9b4 100%);
  }

  th {
    padding: 11px 16px;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brown-dark);
    border-bottom: 1px solid var(--cream-border);
    white-space: nowrap;
  }

  td {
    padding: 10px 16px;
    color: var(--text);
    border-bottom: 1px solid #eddfd3;
    font-size: 0.83rem;
    font-weight: 300;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: #faeee4;
  }

  .badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  .badge-green { background: #d8edd4; color: #3a6e36; }
  .badge-orange { background: #fde8d0; color: #a0572a; }
  .badge-blue { background: #d4e4f4; color: #2a5a8a; }
  .badge-red { background: #fdd8d8; color: #8a2a2a; }

  .form-label {
    font-size: 0.78rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-muted);
    margin-bottom: 6px;
    display: block;
  }

  .form-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--cream-border);
    border-radius: 8px;
    background: var(--white);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 300;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(184, 125, 85, 0.12);
  }

  .form-textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--cream-border);
    border-radius: 8px;
    background: var(--white);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 300;
    outline: none;
    resize: vertical;
    min-height: 90px;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .form-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(184, 125, 85, 0.12);
  }

  .form-field { display: flex; flex-direction: column; }
`;

// ─── Types ────────────────────────────────────────────────────────────────────



type LocationType = {
  dist_name: string;
  subdiv_name: string;
  cir_name: string;
  mouza_pargona_name: string;
  lot_name: string;
  vill_townprt_name: string;
  dist_code: string;
  subdiv_code: string;
  cir_code: string;
  mouza_pargona_code: string;
  lot_no: string;
  vill_townprt_code: string;
};

type ApplicationType = {
  aadhaar_verified: string;
  application_no: string;
  status: string;
};

export type AddressType = {
    id: string;
    value: string;
};

export type ContactType = {
    id: string;
    value: string;
};



type ApplicationDetailsType = {
  applicantDetails: any[];
  pattadarDetails: any[];
  dagDetails: any[];
  applicationDetails: ApplicationType[];
  locationDetails: LocationType[];
  handlePattadarContact: (value: React.ChangeEvent<HTMLInputElement>) => void;
  handlePattadarAddr: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleApplicantContact: (value: React.ChangeEvent<HTMLInputElement>) => void;
  handleApplicantAddr: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
  appContactNo: ContactType[];
  appAddress: AddressType[];
  pdarContactNo: ContactType[];
  pdarAddress: AddressType[];
  remarks: string;
  setRemarks: (value: string) => void;
  handleSubmit: () => void;
};


// ─── Reusable Card Component ─────────────────────────────────────────────────



// ─── Main Component ──────────────────────────────────────────────────────────

const ApplicationDetailsLm: React.FC<ApplicationDetailsType> = ({applicantDetails, pattadarDetails, dagDetails, applicationDetails, locationDetails, handlePattadarContact, handlePattadarAddr, handleApplicantContact, handleApplicantAddr, appContactNo, appAddress, pdarContactNo, pdarAddress, remarks, setRemarks, handleSubmit}) => {



  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">
        <div className="dashboard-title">Application Details</div>
        <div className="cards-grid">

          {/* Card 1 — 6 columns */}
          {/* <DataCard {...card1Data} /> */}
          <div className="card">
            <div className="card-header">
              <span className="card-header-dot" />
              <h2 className="card-heading">Location</h2>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Subdivision</th>
                    <th>Circle</th>
                    <th>Mouza</th>
                    <th>Lot</th>
                    <th>Village</th>
                  </tr>
                </thead>
                <tbody>
                  {locationDetails && locationDetails.map((location, index) => <tr key={index}>
                    <td>{location.dist_name}</td>
                    <td>{location.subdiv_name}</td>
                    <td>{location.cir_name}</td>
                    <td>{location.mouza_pargona_name}</td>
                    <td>{location.lot_name}</td>
                    <td>{location.vill_townprt_name}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-header-dot" />
              <h2 className="card-heading">Application</h2>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Application No</th>
                    <th>Aadhaar Verified</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationDetails && applicationDetails.map((app, index) => <tr key={index}>
                    <td>{app.application_no}</td>
                    <td>{app.aadhaar_verified}</td>
                    <td>{app.status}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-header-dot" />
              <h2 className="card-heading">Dag Details</h2>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Dag No</th>
                    <th>Dag Area</th>
                    <th>Applied Dag Area</th>
                    <th>Patta Type</th>
                    <th>Patta No</th>
                  </tr>
                </thead>
                <tbody>
                  {dagDetails && dagDetails.map((dag, index) => <tr key={index}>
                    <td>{dag.dag_no}</td>
                    <td>{dag.dag_area}</td>
                    <td>{dag.app_dag_area}</td>
                    <td>{dag.patta_type_name}</td>
                    <td>{dag.patta_no}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-header-dot" />
              <h2 className="card-heading">Applicant Details (Pattadar)</h2>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Name</th>
                    <th>Contact No</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {applicantDetails && applicantDetails.map((applicant, index) => <tr key={index}>
                    <td>{++index}</td>
                    <td>{applicant.pattadar_name}</td>
                    <td>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Contact No..."
                        id={applicant.dist_code + '-' + applicant.subdiv_code + '-' + applicant.cir_code + '-' + applicant.mouza_pargona_code + '-' + applicant.lot_no + '-' + applicant.vill_townprt_code + '-' + applicant.patta_type_code + '-' + applicant.patta_no + '-' + applicant.pattadar_id}
                        value={appContactNo.find((state) => state.id === applicant.dist_code + '-' + applicant.subdiv_code + '-' + applicant.cir_code + '-' + applicant.mouza_pargona_code + '-' + applicant.lot_no + '-' + applicant.vill_townprt_code + '-' + applicant.patta_type_code + '-' + applicant.patta_no + '-' + applicant.pattadar_id)?.value || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleApplicantContact(e)}
                      />
                    </td>
                    <td>
                      <textarea
                        className="form-textarea"
                        placeholder="Address…"
                        id={applicant.dist_code + '-' + applicant.subdiv_code + '-' + applicant.cir_code + '-' + applicant.mouza_pargona_code + '-' + applicant.lot_no + '-' + applicant.vill_townprt_code + '-' + applicant.patta_type_code + '-' + applicant.patta_no + '-' + applicant.pattadar_id}
                        value={appAddress.find((state) => state.id === applicant.dist_code + '-' + applicant.subdiv_code + '-' + applicant.cir_code + '-' + applicant.mouza_pargona_code + '-' + applicant.lot_no + '-' + applicant.vill_townprt_code + '-' + applicant.patta_type_code + '-' + applicant.patta_no + '-' + applicant.pattadar_id)?.value || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleApplicantAddr(e)}
                      />
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-header-dot" />
              <h2 className="card-heading">All Pattadar Details</h2>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Name</th>
                    <th>Contact No</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {pattadarDetails && pattadarDetails.map((pdar, index) => <tr key={index}>
                    <td>{++index}</td>
                    <td>{pdar.pdar_name}</td>
                    <td>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Contact No..."
                        id={pdar.dist_code + '-' + pdar.subdiv_code + '-' + pdar.cir_code + '-' + pdar.mouza_pargona_code + '-' + pdar.lot_no + '-' + pdar.vill_townprt_code + '-' + pdar.patta_type_code + '-' + pdar.patta_no + '-' + pdar.pdar_id}
                        value={pdarContactNo.find((state) => state.id === pdar.dist_code + '-' + pdar.subdiv_code + '-' + pdar.cir_code + '-' + pdar.mouza_pargona_code + '-' + pdar.lot_no + '-' + pdar.vill_townprt_code + '-' + pdar.patta_type_code + '-' + pdar.patta_no + '-' + pdar.pdar_id)?.value || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePattadarContact(e)}
                      />
                    </td>
                    <td>
                      <textarea
                        className="form-textarea"
                        placeholder="Address…"
                        id={pdar.dist_code + '-' + pdar.subdiv_code + '-' + pdar.cir_code + '-' + pdar.mouza_pargona_code + '-' + pdar.lot_no + '-' + pdar.vill_townprt_code + '-' + pdar.patta_type_code + '-' + pdar.patta_no + '-' + pdar.pdar_id}
                        value={pdarAddress.find((state) => state.id === pdar.dist_code + '-' + pdar.subdiv_code + '-' + pdar.cir_code + '-' + pdar.mouza_pargona_code + '-' + pdar.lot_no + '-' + pdar.vill_townprt_code + '-' + pdar.patta_type_code + '-' + pdar.patta_no + '-' + pdar.pdar_id)?.value || ''}
                        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => handlePattadarAddr(e)}

                      />
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 6 — Form */}
          <div className="card">
            <div className="card-header">
              <span className="card-header-dot" />
              <h2 className="card-heading">Remarks</h2>
            </div>
            <div className="card-body form-body">
              <div className="form-field">
                {/* <label className="form-label">Remarks</label> */}
                <textarea
                  className="form-textarea"
                  placeholder="Remarks…"
                  value={remarks}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarks(e.currentTarget.value)}
                />
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'

            }}>
              <button
                style={{
                  alignSelf: 'center',
                  padding: '12px 48px',
                  marginTop: '8px',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #b87d55 0%, #9a6040 100%)',
                  color: '#fff9f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(154, 96, 64, 0.22)',
                  transition: 'opacity 0.18s',
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationDetailsLm;
