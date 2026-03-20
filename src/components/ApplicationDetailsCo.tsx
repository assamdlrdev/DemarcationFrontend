import { useState } from "react";

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

  .success-text {
    color: green;
  }

  .danger-text {
    color: red;
  }

  .form-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(184, 125, 85, 0.12);
  }

  .form-field { display: flex; flex-direction: column; }
`;

type ApplicantType = {
    address: string;
    cir_code: string;
    dag_no: string;
    dist_code: string;
    lot_no: string;
    mobile_no: string;
    mouza_pargona_code: string;
    patta_no: string;
    patta_type_code: string;
    patta_type_name: string;
    pdar_id: number;
    pdar_name: string;
    subdiv_code: string;
    vill_townprt_code: string;
};

type PattadarType = {
    address: string;
    cir_code: string;
    dag_no: string;
    dist_code: string;
    lot_no: string;
    mobile_no: string;
    mouza_pargona_code: string;
    patta_no: string;
    patta_type_code: string;
    patta_type_name: string;
    pdar_id: number;
    subdiv_code: string;
    vill_townprt_code: string;
    pdar_name: string;
};

export type ApplicationType = {
    app_dag_area_b: string;
    app_dag_area_k: string;
    app_dag_area_lc: string;
    app_dag_area_g: string | null;
    application_no: string;
    bhunaksha_available: number;
    cir_code: string;
    cir_name: string;
    dag_area_b: string;
    dag_area_g: string | null;
    dag_area_k: string;
    dag_area_lc: string;
    dag_no: string;
    dist_code: string;
    dist_name: string;
    lot_name: string;
    lot_no: string;
    mouza_pargona_code: string;
    mouza_pargona_name: string;
    patta_no: string;
    patta_type_code: string;
    patta_type_name: string;
    subdiv_code: string;
    subdiv_name: string;
    vill_townprt_code: string;
    vill_townprt_name: string;
    status: string;
    applicants: ApplicantType[];
    pattadars: PattadarType[];
} | null;

type ApplicationDetailsCoType = {
    application: ApplicationType;
    hearingDate: string;
    setHearingDate: (e: string) => void;
    handleSubmit: () => Promise<void>;
    handleVerification: () => Promise<void>;
};

const ApplicationDetailsCo: React.FC<ApplicationDetailsCoType> = ({application, hearingDate, setHearingDate, handleSubmit, handleVerification}) => {

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
                                    <tr>
                                        <td>{application?.dist_name}</td>
                                        <td>{application?.subdiv_name}</td>
                                        <td>{application?.cir_name}</td>
                                        <td>{application?.mouza_pargona_name}</td>
                                        <td>{application?.lot_name}</td>
                                        <td>{application?.vill_townprt_name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
        
                    <div className="card">
                        <div className="card-header">
                            <span className="card-header-dot" />
                            <h2 className="card-heading">Application Details</h2>
                        </div>
                        <div className="card-body">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Application No</th>
                                        <th>Dag No</th>
                                        <th>Dag Area</th>
                                        <th>Applied Dag Area</th>
                                        <th>Patta Type</th>
                                        <th>Patta No</th>
                                        <th>Bhunaksha Dag Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{application?.application_no}</td>
                                        <td>{application?.dag_no}</td>
                                        <td>{(application?.dist_code == '21' || application?.dist_code == '22' || application?.dist_code == '23') ? application?.dag_area_b + ' B - ' + application?.dag_area_k + ' K - ' + application?.dag_area_lc + ' LC - ' + application?.dag_area_g + ' G' : application?.dag_area_b + ' B - ' + application?.dag_area_k + ' K - ' + application?.dag_area_lc + ' LC'}</td>
                                        <td>{(application?.dist_code == '21' || application?.dist_code == '22' || application?.dist_code == '23') ? application?.app_dag_area_b + ' B - ' + application?.app_dag_area_k + ' K - ' + application?.app_dag_area_lc + ' LC - ' + application?.app_dag_area_g + ' G' : application?.app_dag_area_b + ' B - ' + application?.app_dag_area_k + ' K - ' + application?.app_dag_area_lc + ' LC'}</td>
                                        <td>{application?.patta_type_name}</td>
                                        <td>{application?.patta_no}</td>
                                        <td>{application?.bhunaksha_available == 1 ? (<p className="success-text">Available</p>) : (<p className="danger-text">Not Available</p>)}</td>
                                    </tr>
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
                                {application?.applicants && application?.applicants.map((applicant, index) => <tr key={index}>
                                    <td>{++index}</td>
                                    <td>{applicant.pdar_name}</td>
                                    <td>{applicant.mobile_no}</td>
                                    <td>{applicant.address}</td>
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
                                {application?.pattadars && application?.pattadars.map((pdar, index) => <tr key={index}>
                                    <td>{++index}</td>
                                    <td>{pdar.pdar_name}</td>
                                    <td>{pdar.mobile_no}</td>
                                    <td>{pdar.address}</td>
                                </tr>)}
                            </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-heading">Inputs</h2>
                        </div>
                        <div className="card-body">
                            <table>
                                {/* <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead> */}
                                <tbody>
                                    <tr>
                                        <td>Date of Hearing <span style={{color:'red'}}>*</span></td>
                                        <td>
                                            <input
                                            className="form-input"
                                            type="date"
                                            placeholder=""
                                            id="hearing_date"
                                            value={hearingDate}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHearingDate(e.currentTarget.value)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                        }}>
                            {(application?.bhunaksha_available == 1) ? (application?.status == 'A' ? (<button
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
                                Issue Notice
                            </button>) : (
                                <button style={{
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
                                onClick={handleVerification}>
                                    Send For Field Verification
                                </button>
                            )) : (<p style={{color: 'red'}}>Please Update in Bhunaksha and come back!</p>)}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ApplicationDetailsCo;