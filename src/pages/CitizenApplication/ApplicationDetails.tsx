import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from "../../api/axios";

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

/* ---------- Component ---------- */

const ApplicationDetails = () => {

  const navigate = useNavigate();

  const [openPhoto, setOpenPhoto] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---------- API CALL ---------- */
  const { id: applicationNo } = useParams();

  useEffect(() => {
    // console.log("application No: ", applicationNo);
    if (applicationNo) {
      getApplicationDetails();
    }
  }, [applicationNo]);


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
        district: app.dist_name,
        subDivision: app.subdiv_name,
        circle: app.cir_name,
        mouza: app.mouza_name,
        lot: app.lot_name,
        village: app.vill_name,

        pattaType: area?.patta_type_code ?? '—',
        pattaNumber: area?.patta_no ?? '—',
        dagNumber: area?.dag_no ?? '—',
        pattadarName: area.pattadar_name,
        ekhajana: '—',

        existingArea: `${area?.dag_area_b || 0} Bigha ${area?.dag_area_k || 0} Katha ${area?.dag_area_lc || 0} Lessa`,
        newArea: `${area?.app_dag_area_b || 0} Bigha ${area?.app_dag_area_k || 0} Katha ${area?.app_dag_area_lc || 0} Lessa`,

        photoUrl: 'http://127.0.0.1:8000/storage/' + app?.attachment?.file_path,
      });
    } catch (err) {
      if (axios.isCancel(err) || err.code === 'ERR_CANCELED') return;
      setError(true);
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
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
        <Title>Land Application Details</Title>

        {/* Location */}
        <Section>
          <SectionTitle>Location Details</SectionTitle>
          <Grid>
            <Field><Label>District</Label><Value value={data.district} readOnly /></Field>
            <Field><Label>Sub Division</Label><Value value={data.subDivision} readOnly /></Field>
            <Field><Label>Circle</Label><Value value={data.circle} readOnly /></Field>
            <Field><Label>Mouza</Label><Value value={data.mouza} readOnly /></Field>
            <Field><Label>Lot</Label><Value value={data.lot} readOnly /></Field>
            <Field><Label>Village Name (Code)</Label><Value value={data.village} readOnly /></Field>
          </Grid>
        </Section>

        {/* Land Record */}
        <Section>
          <SectionTitle>Land Record Details</SectionTitle>
          <Grid>
            <Field><Label>Patta Type</Label><Value value={'খেৰাজ ম্যাদী'} readOnly /></Field>
            <Field><Label>Patta Number</Label><Value value={data.pattaNumber} readOnly /></Field>
            <Field><Label>Dag Number</Label><Value value={data.dagNumber} readOnly /></Field>
            <Field><Label>Pattadar Name</Label><Value value={data.pattadarName} readOnly /></Field>
            {/* <Field><Label>Ekhajana Amount</Label><Value value={data.ekhajana} readOnly /></Field> */}
          </Grid>
        </Section>

        {/* Area */}
        <Section>
          <SectionTitle>Area Information</SectionTitle>
          <Grid>
            <Field><Label>Existing Area Info</Label><Value value={data.existingArea} readOnly /></Field>
            <Field><Label>New Area</Label><Value value={data.newArea} readOnly /></Field>
          </Grid>
        </Section>

        {/* Documents */}
        <Section>
          <SectionTitle>Documents</SectionTitle>
          <Button onClick={() => setOpenPhoto(true)}>View Photo</Button>{' '}
          <Button
            style={{ background: 'gray' }}
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
            <ModalImage src={data.photoUrl} alt="Land Document" />
            <CloseBtn onClick={() => setOpenPhoto(false)}>Close</CloseBtn>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
};

export default ApplicationDetails;
