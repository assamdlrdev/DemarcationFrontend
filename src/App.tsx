import './App.css';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
// import Banner from './components/Banner';
import CitizenApplication from './pages/CitizenApplication';
import ApplicationDetails from './pages/CitizenApplication/ApplicationDetails';
import MainDash from './pages/MainDash';
import LMLayout from './pages/layouts/LMLayout';
import LMDashboard from './pages/lm/LMDashboard';
import COLayout from './pages/layouts/COLayout';
import CODashboard from './pages/co/CODashboard';
import PublicLayout from './pages/layouts/PublicLayout';
import LMApplicationDetails from './pages/lm/LMApplicationDetails';
import COApplicationDetails from './pages/co/COApplicationDetails';
import Notice from './pages/Notice';

function App() {
  return (
    <>
      
        {/* <SidebarMenu /> */}
        
          

          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<CitizenApplication />} />
              <Route
                path="/application-details/:id"
                element={<ApplicationDetails />}
              />
            </Route>
            
            
            <Route path="/dashboard" element={<MainDash />} />
            <Route element={<LMLayout />}>
              <Route path="/lm-dashboard" element={<LMDashboard />} />
              <Route path="/lm-application-details" element={<LMApplicationDetails />} />
            </Route>
            <Route element={<COLayout />}>
              <Route path="/co-dashboard" element={<CODashboard />} />
              <Route path="/co-application-details" element={<COApplicationDetails />}  />
              <Route path="/notice" element={<Notice />} />
            </Route>
          </Routes>

      
    </>
  );
}

export default App;
