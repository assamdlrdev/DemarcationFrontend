import { useEffect, useState } from "react";
import TabbedView, { type TabInterface } from "../../components/TabbedView";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import MapCo from "../../components/MapCo";
import ApplicationDetailsCo from "../../components/ApplicationDetailsCo";

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
};

type ApplicationType = {
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
    subdiv_code: string;
    subdiv_name: string;
    vill_townprt_code: string;
    vill_townprt_name: string;
    applicants: ApplicantType[];
    pattadars: PattadarType[];
};

const COApplicationDetails: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [application, setApplication] = useState<ApplicationType | null>(null);
    const [mapGeoJson, setMapGeoJson] = useState<string>('');
    const [dagNo, setDagNo] = useState<string>('');

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

        setApplication(response.data);
        setDagNo(response.data?.dag_no);

        console.log(response);
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

    return (
        <>
            <TabbedView tabbedView={[
                {
                    id: "application_details",
                    label: "Application Details",
                    content: (
                    <ApplicationDetailsCo />
                    )
                },
                {
                    id: "map",
                    label: "Map",
                    content: (<MapCo mapdata={mapGeoJson} dag_no={dagNo} />)
                }
            ]} />
        </>
    );
};

export default COApplicationDetails;