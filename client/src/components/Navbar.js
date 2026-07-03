import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaMicrochip, FaBars, FaXmark, FaLock } from 'react-icons/fa6';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/services', label: 'Services' },
  { to: '/articles', label: 'Articles' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact' },
  { to: '/analytics', label: 'Analytics' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon"><FaMicrochip /></span>
          AI-<span className="logo-gold">Solutions</span>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`nav-link${location.pathname === l.to ? ' active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <button className="btn-nav" onClick={() => navigate('/admin')}>
            <FaLock style={{ fontSize: '0.75rem' }} /> Admin
          </button>
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`mobile-link${location.pathname === l.to ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/admin" className="mobile-link">Admin Panel</Link>
        </div>
      )}
    </nav>
  );
}
