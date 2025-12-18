import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';
import CitizenApplication from './pages/CitizenApplication';
import ApplicationDetails from './pages/CitizenApplication/ApplicationDetails';

function App() {


  return (
    <>
      <Header />
      <main  className='main-container'>
        <Banner />
        <CitizenApplication />
        <ApplicationDetails />
      </main>
      <Footer />
    </>
  )
}

export default App
