import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import WhatsAppButton from './components/WhatsAppButton';
import MobileQuoteBar from './components/MobileQuoteBar';
import NotFound from './components/NotFound';

const isKnownPath = window.location.pathname === '/';

function App() {
  if (!isKnownPath) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Projects />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
      <WhatsAppButton />
      <MobileQuoteBar />
      <CookieConsent />
    </div>
  );
}

export default App;
