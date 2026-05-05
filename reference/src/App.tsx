import { useState, useEffect } from 'react';
import { Shield, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Admin floating button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        {isAdmin && (
          <button
            onClick={handleLogout}
            className="p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => setShowLogin(true)}
          className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
            isAdmin
              ? 'bg-green-600 text-white'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
          title={isAdmin ? 'Admin Mode Active' : 'Admin Login'}
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>

      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <AdminLogin open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}

export default App;
