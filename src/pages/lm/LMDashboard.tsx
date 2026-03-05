import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

interface ApplicationType {
  serial_no: number;
  application_no: string;
  created_at: string;
  village: string;
  status: "Active" | "Inactive" | "On Leave";
  action: any;
}


const LMDashboard: React.FC = () => {
    const location = useLocation();
    const [applicationData, setApplicationData] = useState<ApplicationType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(location.pathname == '/lm-dashboard') {
            getApplicationData();
        }
    }, [location]);

    const getApplicationData = async () => {
        const data = {};

        const response = await ApiService.get('get_final_applications', JSON.stringify(data));

        if(response.status != 'y') {
            alert(response.msg);
            return;
        }

        setApplicationData(response.data);
        return;
    };

    const handleBtnClick = (e: any) => {
        console.log(e.currentTarget.id);
        navigate(`/lm-application-details?id=${e.currentTarget.id}`);
    };


    return (
        <>
            <DataTable info={applicationData} handleBtnClick={handleBtnClick} />
        </>
    );
}

export default LMDashboard;