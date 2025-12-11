import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';
import CitizenApplication from './pages/CitizenApplication';

function App() {


  return (
    <>
      <Header />
      <main  className='main-container'>
        <Banner />
        <CitizenApplication />
      </main>
      <Footer />
    </>
  )
}

export default App
