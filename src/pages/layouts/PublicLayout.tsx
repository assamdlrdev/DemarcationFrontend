import { Navigate, Outlet } from "react-router-dom";
import Banner from "../../components/Banner";
import StorageService from "../../services/StorageService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import './layout.scss';



export default function PublicLayout() {
    // StorageService.jwtRemove();
    const user = StorageService.getJwtCookie();

    if(user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Header />
            <main className="main-container">
                <Banner />
                <Outlet />
            </main>
            <Footer />
        </>
        
    );
};