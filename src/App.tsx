import './App.css';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';
import CitizenApplication from './pages/CitizenApplication';
import ApplicationDetails from './pages/CitizenApplication/ApplicationDetails';

function App() {
  return (
    <>
      <Header />

      <main className="main-container">
        <Banner />

        <Routes>
          <Route path="/" element={<CitizenApplication />} />
          <Route
            path="/application-details/:id"
            element={<ApplicationDetails />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
