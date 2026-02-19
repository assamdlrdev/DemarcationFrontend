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
            </Route>
            <Route element={<COLayout />}>
              <Route path="/co-dashboard" element={<CODashboard />} />
            </Route>
          </Routes>

      
    </>
  );
}

export default App;
