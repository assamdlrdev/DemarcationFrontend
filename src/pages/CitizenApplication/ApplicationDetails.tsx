import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from "../../api/axios";
import ModalComponent from '../../components/Modal/modalComponent';



const Page = styled.div`
  background: #f4f6f8;
  min-height: 100vh;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  width: 100%;
  max-width: 1000px;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
`;

const Value = styled.input`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #111827;
  cursor: default;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

/* ---------- Modal ---------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
`;

const ModalImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const CloseBtn = styled.button`
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  background: #e5e7eb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

interface DataType {
  dist_code: string;
  district: string;
  subDivision: string;
  circle: string;
  mouza: string;
  lot: string,
  village: string,
  application_no: string,

  pattaType: string,
  pattaNumber: string,
  dagNumber: string,
  pattadarName: string,
  ekhajana: string,

  app_dag_area_b: string,
  app_dag_area_k: string,
  app_dag_area_lc: string,

  final_submit: number,

  existingArea: string,
  newArea: string,

  photoUrl: string
}

/* ---------- Component ---------- */

const ApplicationDetails = () => {

  const navigate = useNavigate();

  const [openPhoto, setOpenPhoto] = useState(false);
  const [data, setData] = useState<DataType>({
    dist_code: '00',
    district: '',
    subDivision: '',
    circle: '',
    mouza: '',
    lot: '',
    village: '',
    application_no: '',

    pattaType: '',
    pattaNumber: '',
    dagNumber: '',
    pattadarName: '',
    ekhajana: '',

    app_dag_area_b: '',
    app_dag_area_k: '',
    app_dag_area_lc: '',

    final_submit: 0,

    existingArea: '',
    newArea: '',

    photoUrl: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  // const [edit, setEdit] = useState<boolean>(false);
  const [appliedB, setAppliedB] = useState<string>('0');
  const [appliedK, setAppliedK] = useState<string>('0');
  const [appliedLc, setAppliedLc] = useState<string>('0');
  const [appliedG, setAppliedG] = useState<string>('0');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  /* ---------- API CALL ---------- */
  const { id: applicationNo } = useParams();

  useEffect(() => {
    // console.log("application No: ", applicationNo);
    if (applicationNo) {
      getApplicationDetails();
    }
  }, [applicationNo]);

  useEffect(() => {
    if(modalOpen) {
      setAppliedB(data ? (data.app_dag_area_b ? data.app_dag_area_b : '0') : '0');
      setAppliedK(data ? (data.app_dag_area_k ? data.app_dag_area_k : '0') : '0');
      setAppliedLc(data ? (data.app_dag_area_lc ? data.app_dag_area_lc : '0') : '0');

    }
    else {
      setAppliedB('0');
      setAppliedK('0');
      setAppliedLc('0');
    }
  }, [modalOpen]);


  const getApplicationDetails = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);

      const postData = {
        application_no: String(applicationNo),
      };

      console.log("postData: ", postData);

      const response = await api.post(
        'get-application-details',
        postData,
        { signal: controller.signal }
      );

      const app = response?.data?.data?.application;
      const area = app?.demarcationdagareas;

      console.log('Response: ', response?.data);

      if (!app) {
        throw new Error('Application not found');
      }

      console.log('File: ', 'http://127.0.0.1:8000/api/storage/' + app?.attachment?.file_path);

      setData({
        dist_code: app.dist_code,
        district: app.dist_name,
        subDivision: app.subdiv_name,
        circle: app.cir_name,
        mouza: app.mouza_name,
        lot: app.lot_name,
        village: app.vill_name,
        application_no: app.application_no,

        pattaType: area?.patta_type_code ?? '—',
        pattaNumber: area?.patta_no ?? '—',
        dagNumber: area?.dag_no ?? '—',
        pattadarName: area.pattadar_name,
        ekhajana: '—',

        app_dag_area_b: area?.app_dag_area_b,
        app_dag_area_k: area?.app_dag_area_k,
        app_dag_area_lc: area?.app_dag_area_lc,

        existingArea: `${area?.dag_area_b || 0} Bigha ${area?.dag_area_k || 0} Katha ${area?.dag_area_lc || 0} Lessa`,
        newArea: `${area?.app_dag_area_b || 0} Bigha ${area?.app_dag_area_k || 0} Katha ${area?.app_dag_area_lc || 0} Lessa`,

        final_submit: app.final_submit,

        photoUrl: 'http://127.0.0.1:8000/storage/' + app?.attachment?.file_path,
      });
    } catch (err: any) {
      if (axios.isCancel(err) || err.code === 'ERR_CANCELED') return;
      setError(true);
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };


  const submitEditInfo = async() => {
    // console.log(appliedB, appliedK, appliedLc, data);
    const controller = new AbortController();
    try {
      setLoading(true);
      const payload = {
        application_no: data?.application_no,
        dag_area_b: appliedB,
        dag_area_k: appliedK,
        dag_area_lc: appliedLc
      };

      const response = await api.post(
        'edit-application',
        payload,
        { signal: controller.signal }
      );

      console.log('Response: ', response);
      if(response.status != 200) {
        throw new Error('Update Failed!');
      }
      const resp = response.data.data;
      if(resp.status != 200) {
        throw new Error(resp.message);
      }

      
      setModalOpen(false);
    }
    catch (err: any) {
      setError(true);
      if (axios.isCancel(err) || err.code === 'ERR_CANCELED') return;
    }
    finally {
      setLoading(false);
      getApplicationDetails();
    }
  };

  const finalSubmit = async() => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const payload = {
        application_no: data?.application_no,
      };
      const response = await api.post(
        'final-submit-application',
        payload,
        { signal: controller.signal }
      );

      console.log('Response: ', response);
      if(response.status != 200) {
        throw new Error('Submission Failed!');
      }
      const resp = response.data.data;
      if(resp.status != 200) {
        throw new Error(resp.message);
      }
    }
    catch(err: any) {
      setError(true);
      if (axios.isCancel(err) || err.code === 'ERR_CANCELED') return;
    }
    finally{
      setLoading(false);
      getApplicationDetails();
    }
  };



  /* ---------- UI STATES ---------- */
  if (loading) {
    return <Page>Loading application details…</Page>;
  }

  if (error) {
    return <Page>{error}</Page>;
  }

  return (
    <Page>
      <Card>
        <Title>Land Application Details - Preview</Title>

        {/* Location */}
        <Section>
          <SectionTitle>Location Details</SectionTitle>
          <Grid>
            <Field><Label>District</Label><Value value={data?.district} readOnly /></Field>
            <Field><Label>Sub Division</Label><Value value={data?.subDivision} readOnly /></Field>
            <Field><Label>Circle</Label><Value value={data?.circle} readOnly /></Field>
            <Field><Label>Mouza</Label><Value value={data?.mouza} readOnly /></Field>
            <Field><Label>Lot</Label><Value value={data?.lot} readOnly /></Field>
            <Field><Label>Village Name (Code)</Label><Value value={data?.village} readOnly /></Field>
          </Grid>
        </Section>

        {/* Land Record */}
        <Section>
          <SectionTitle>Land Record Details</SectionTitle>
          <Grid>
            <Field><Label>Patta Type</Label><Value value={'খেৰাজ ম্যাদী'} readOnly /></Field>
            <Field><Label>Patta Number</Label><Value value={data?.pattaNumber} readOnly /></Field>
            <Field><Label>Dag Number</Label><Value value={data?.dagNumber} readOnly /></Field>
            <Field><Label>Pattadar Name</Label><Value value={data?.pattadarName} readOnly /></Field>
            {/* <Field><Label>Ekhajana Amount</Label><Value value={data.ekhajana} readOnly /></Field> */}
          </Grid>
        </Section>

        {/* Area */}
        <Section>
          <SectionTitle>Area Information</SectionTitle>
          <Grid>
            <Field><Label>Existing Area Info</Label><Value value={data?.existingArea} readOnly /></Field>
            <Field><Label>New Area</Label><Value value={data?.newArea} readOnly /></Field>
          </Grid>
        </Section>

        {/* Documents */}
        <Section>
          <SectionTitle>Documents</SectionTitle>
          <Button style={{background: 'gray'}} onClick={() => setOpenPhoto(true)}>View Land Photo</Button>{' '}
          {!modalOpen && (data.final_submit == 0) && <><Button style={{ background: 'blue' }} onClick={() => setModalOpen(true)}>Edit</Button>{' '}</>}
          {data.final_submit == 0 && <><Button style={{background: 'green'}} onClick={finalSubmit}>Final Submit</Button>{' '}</>}

          <Button
            style={{ background: 'red' }}
            onClick={() => navigate('/')}
          >
            Go Back
          </Button>
        </Section>
      </Card>

      {/* Photo Modal */}
      {openPhoto && (
        <Overlay>
          <Modal>
            <ModalImage src={data?.photoUrl} alt="Land Document" />
            <CloseBtn onClick={() => setOpenPhoto(false)}>Close</CloseBtn>
          </Modal>
        </Overlay>
      )}

      
      <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)} title='Edit'>
        <Section>
          <Grid>
            <Field>
              <Label>Edit Bigha</Label>
              <Value value={appliedB} onInput={(e: any) => setAppliedB(e.currentTarget.value)} />
            </Field>
            <Field>
              <Label>Edit Katha</Label>
              <Value value={appliedK} onInput={(e: any) => setAppliedK(e.currentTarget.value)} />
            </Field>
            <Field>
              <Label>{(data?.dist_code == '21' || data?.dist_code == '22' || data?.dist_code == '23') ? 'Edit Chatak' : 'Edit Lessa'}</Label>
              <Value value={appliedLc} onInput={(e: any) => setAppliedLc(e.currentTarget.value)} />
            </Field>
            {/* {(data?.dist_code == '21' || data?.dist_code == '22' || data?.dist_code == '23') ? (<Field><Label>Edit Ganda</Label><Value value={appliedG} onInput={(e: any) => setAppliedG(e.currentTarget.value)} /></Field>) : ''} */}
          </Grid>
        </Section>
        <Section>
          {(data.final_submit == 0) && <Button
            style={{ background: 'gray' }}
            onClick={submitEditInfo}
          >
            Submit
          </Button>}
        </Section>
      </ModalComponent>
      
      
    </Page>
  );
};

export default ApplicationDetails;


// <Modal
      //   open={modalOpen}
      //   onClose={handleCloseModal}
      //   title="Edit Land Area"
      //   onSubmit={undefined}
      //   customFooter={<Button>

      //   </Button>}
      // >

      // </Modal>
