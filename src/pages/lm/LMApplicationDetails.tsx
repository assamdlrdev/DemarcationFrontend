import type React from "react";
import ApplicationDetailsLm, { type AddressType, type ContactType } from "../../components/ApplicationDetailsLm";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import Loader from "../../components/Loader";

// type AddressType = {
//     id: string;
//     value: string;
// };

// type ContactType = {
//     id: string;
//     value: string;
// };

const LMApplicationDetails: React.FC = () => {
    const [remarks, setRemarks] = useState<string>('');
    const [applicantDetails, setApplicantDetails] = useState<any[]>([]);
    const [pattadarDetails, setPattadarDetails] = useState<any[]>([]);
    const [dagDetails, setDagDetails] = useState<any[]>([]);
    const [applicationDetails, setApplicationDetails] = useState<any[]>([]);
    const [locationDetails, setLocationDetails] = useState<any[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const [appAddress, setAppAddress] = useState<AddressType[]>([]);
    const [appContactNo, setAppContactNo] = useState<ContactType[]>([]);
    const [pdarContactNo, setPdarContactNo] = useState<ContactType[]>([]);
    const [pdarAddress, setPdarAddress] = useState<AddressType[]>([]);


    useEffect(() => {
        if(location.pathname == '/lm-application-details') {
            getApplicationDetails();
        }
    }, [location]);

    const getApplicationDetails = async () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if(!id) {
            navigate('/lm-dashboard');
            return;
        }
        const data = {
            id: id
        };
        setLoading(true);
        const response = await ApiService.get('get_specified_application', JSON.stringify(data));
        setLoading(false);

        if(response.status != 'y') {
            alert(response.msg);
            return;
        }

        const responseData = response.data;
        // console.log(responseData);
        setLocationDetails([responseData.location_data]);
        setApplicationDetails([responseData.application_data]);
        setDagDetails(responseData.dag_data);
        setApplicantDetails(responseData.applicant_data);
        setPattadarDetails(responseData.pattadar_data);
    };

    const handleApplicantAddr = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const id = e.currentTarget.id;
        const value = e.currentTarget.value;
        setAppAddress((prev) => {
            const index = prev.findIndex(item => item.id === id);
            if (index !== -1) {
                // Update existing
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    value: value
                };
                return updated;
            }
            // Insert new
            return [...prev, { id: id, value: value }];
        });
    };

    const handleApplicantContact = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.currentTarget.id;
        const value = (e.currentTarget.value.length <= 10) ? e.currentTarget.value : e.currentTarget.value.slice(0, 10);
        setAppContactNo((prev) => {
            const index = prev.findIndex(item => item.id === id);
            if (index !== -1) {
                // Update existing
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    value: value
                };
                return updated;
            }
            // Insert new
            return [...prev, { id: id, value: value }];
        });
    };

    const handlePattadarAddr = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const id = e.currentTarget.id;
        const value = e.currentTarget.value;
        setPdarAddress((prev) => {
            const index = prev.findIndex(item => item.id === id);
            if (index !== -1) {
                // Update existing
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    value: value
                };
                return updated;
            }
            // Insert new
            return [...prev, { id: id, value: value }];
        });
    };

    const handlePattadarContact = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.currentTarget.id;
        const value = (e.currentTarget.value.length <= 10) ? e.currentTarget.value : e.currentTarget.value.slice(0, 10);
        setPdarContactNo((prev) => {
            const index = prev.findIndex(item => item.id === id);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    value: value
                };
                return updated;
            }
            return [...prev, { id: id, value: value }];
        });
    };

    const handleSubmit = async () => {
        // console.log(remarks, appAddress, appContactNo, pdarContactNo, pdarAddress, applicationDetails, applicantDetails, dagDetails, pattadarDetails, locationDetails);
        const data = {
            application_details: JSON.stringify(applicationDetails),
            applicant_contact: JSON.stringify(appContactNo),
            applicant_address: JSON.stringify(appAddress),
            pdar_contact: JSON.stringify(pdarContactNo),
            pdar_address: JSON.stringify(pdarAddress),
            remarks: remarks
        };

        setLoading(true);
        const response = await ApiService.get('submit_lm_first', JSON.stringify(data));
        setLoading(false);

        console.log(response);

        if(response.status != 'y') {
            alert(response.msg);
            return;
        }


        navigate('/dashboard');
        return;


        

    };



    return (
        <>
            {!loading && <ApplicationDetailsLm applicantDetails={applicantDetails} pattadarDetails={pattadarDetails} dagDetails={dagDetails} applicationDetails={applicationDetails} locationDetails={locationDetails} handleApplicantAddr={handleApplicantAddr} handleApplicantContact={handleApplicantContact} handlePattadarAddr={handlePattadarAddr} handlePattadarContact={handlePattadarContact} appAddress={appAddress} appContactNo={appContactNo} pdarContactNo={pdarContactNo} pdarAddress={pdarAddress} remarks={remarks} setRemarks={setRemarks} handleSubmit={handleSubmit} />}
            {loading && <Loader type="fullPage" />}
        </>
    );
};

export default LMApplicationDetails;