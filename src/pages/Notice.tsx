import { useEffect, useState } from "react";
import NoticeComponent from "../components/NoticeComponent";
import type { ApplicationType } from "../components/ApplicationDetailsCo";
import { useLocation } from "react-router-dom";


const Notice: React.FC = () => {
    const [application, setApplication] = useState<ApplicationType>(null);
    const location = useLocation();

    useEffect(() => {
        if(location.pathname == '/notice') {
            console.log('ok tested');
        }
    }, [location]);

    return (
        <>
            <NoticeComponent application={application} />
        </>
    );
};

export default Notice;