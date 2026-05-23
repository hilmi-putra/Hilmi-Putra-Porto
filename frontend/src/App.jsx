import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

// Scroll to top helper on route transitions
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if not an anchor link
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const AppLayout = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col bg-blue-500 font-sans text-slate-950 selection:bg-lime-300 selection:text-slate-950">
      {!isAdminRoute && <Header />}

      <main className="flex-grow">
        <AppRoutes />
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
