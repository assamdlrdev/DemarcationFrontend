import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import DataTable from "../../components/DataTable";

interface ApplicationType {
  serial_no: number;
  application_no: string;
  created_at: string;
  village: string;
  status: string;
  status_name: string;
  action: any;
}

const CODashboard: React.FC = () => {

    const location = useLocation();
    const [applicationData, setApplicationData] = useState<ApplicationType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(location.pathname == '/co-dashboard') {
            getApplicationData();
        }
    }, [location]);

    const getApplicationData = async () => {
        const data = {};

        const response = await ApiService.get('get_co_first_cases', JSON.stringify(data));

        if(response.status != 'y') {
            alert(response.msg);
            return;
        }

        setApplicationData(response.data);
        return;
    };

    const handleBtnClick = async(e: any) => {
        console.log(e.currentTarget.id);
        navigate(`/co-application-details?id=${e.currentTarget.id}`);
    };

    return (
        <>
            <DataTable info={applicationData} handleBtnClick={handleBtnClick} title="LRA passed Applications" />
        </>
    );
};

export default CODashboard;