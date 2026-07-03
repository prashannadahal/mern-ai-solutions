import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Services from './pages/Services';
import Articles from './pages/Articles';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import './pages/Home.css';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ paddingTop: '72px' }}>{children}</main>
    <Footer />
    <AIAssistant />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2A2460',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '8px',
            },
          }}
        />
        <Routes>
          <Route path="/"             element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/solutions"    element={<PublicLayout><Solutions /></PublicLayout>} />
          <Route path="/services"     element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/articles"     element={<PublicLayout><Articles /></PublicLayout>} />
          <Route path="/gallery"      element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/testimonials" element={<PublicLayout><Testimonials /></PublicLayout>} />
          <Route path="/contact"      element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/analytics"    element={<PublicLayout><Analytics /></PublicLayout>} />
          <Route path="/admin/*"      element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
