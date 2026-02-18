import { Navigate, Outlet } from "react-router-dom";
import Banner from "../../components/Banner";
import StorageService from "../../services/StorageService";



export default function PublicLayout() {
    // StorageService.jwtRemove();
    const user = StorageService.getJwtCookie();

    if(user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Banner />
            <Outlet />
        </>
        
    );
};