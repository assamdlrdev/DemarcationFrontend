import { useEffect, useState } from "react";
import TabbedView, { type TabInterface } from "../../components/TabbedView";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import MapCo from "../../components/MapCo";
import ApplicationDetailsCo, { type ApplicationType } from "../../components/ApplicationDetailsCo";
import Loader from "../../components/Loader";

const COApplicationDetails: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [application, setApplication] = useState<ApplicationType>(null);
    const [mapGeoJson, setMapGeoJson] = useState<string>('');
    const [dagNo, setDagNo] = useState<string>('');
    const [hearingDate, setHearingDate] = useState<string>('');

    useEffect(() => {
        if(location.pathname === '/co-application-details') {
            initialize();
        }
    }, [location]);

    const initialize = () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if(!id) {
            navigate('/co-dashboard');
            return;
        }
        getApplicationData(id);
        getMap(id);
    };

    const getApplicationData = async (id: string) => {
        const data = {
            id: id
        };
        setLoading(true);
        const response = await ApiService.get('get_co_specified_application', JSON.stringify(data));
        setLoading(false);

        if(response.status != 'y') {
            alert(response.msg);
            return;
        }

        setApplication(response.data[0]);
        setDagNo(response.data?.dag_no);

        // console.log(response);
    };

    const getMap = async (id: string) => {
        const data = {
            id: id
        };
        setLoading(true);
        const response = await ApiService.get('get_map', JSON.stringify(data));
        setLoading(false);

        if(response.status != 'y') {
            alert(response.msg);
            return;
        }
        console.log(response);
        setMapGeoJson(response.data);
    };

    const handleSubmit = async () => {
        console.log(hearingDate);
        if(!hearingDate) {
            alert("Imputs not set!");
            return;
        }
        if(application?.bhunaksha_available != 1) {
            alert("Please update Bhunaksha dag first and come back!");
            return;
        }

        const data = {
            application_no: application.application_no,
            hearing_date: hearingDate
        };

        setLoading(true);
        const response = await ApiService.get('issue_notice', JSON.stringify(data));
        setLoading(false);
        
        if(response.status != 'y') {
            alert(response.msg);
            return;
        }
        console.log(response);
        navigate('/dashboard');
        return;
    };

    const handleVerification = async () => {
        console.log('field verification');
    };

    return (
        <>
            {!loading && <TabbedView tabbedView={[
                {
                    id: "application_details",
                    label: "Application Details",
                    content: (
                    <ApplicationDetailsCo application={application} hearingDate={hearingDate} setHearingDate={setHearingDate} handleSubmit={handleSubmit} handleVerification={handleVerification} />
                    )
                },
                {
                    id: "map",
                    label: "Map",
                    content: (<MapCo mapdata={mapGeoJson} dag_no={dagNo} />)
                }
            ]} />}
            {loading && <Loader type="fullPage" />}
        </>
    );
};

export default COApplicationDetails;