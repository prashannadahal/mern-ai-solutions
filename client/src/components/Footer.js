import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicrochip, FaLinkedinIn, FaXTwitter, FaGithub, FaYoutube } from 'react-icons/fa6';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon"><FaMicrochip /></span>
              AI-<span>Solutions</span>
            </div>
            <p>Innovating, promoting and delivering the future of the digital employee experience from Sunderland to the world.</p>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              {[['/', 'About'], ['/solutions', 'Solutions'], ['/services', 'Services'], ['/articles', 'Blog']].map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Connect</div>
            <ul className="footer-links">
              {[['/contact', 'Contact Us'], ['/gallery', 'Gallery'], ['/testimonials', 'Testimonials'], ['/analytics', 'Analytics']].map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:hello@ai-solutions.co.uk">hello@ai-solutions.co.uk</a></li>
              <li><a href="tel:+441910001234">+44 191 000 1234</a></li>
              <li><span>Sunderland, SR1 1PP</span></li>
              <li><span>Mon–Fri, 9–5 GMT</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} AI-Solutions Ltd. All rights reserved.</span>
          <div className="footer-socials">
            {[FaLinkedinIn, FaXTwitter, FaGithub, FaYoutube].map((Icon, i) => (
              <a key={i} href="https://x.com" target="_blank" rel="noreferrer" className="social-icon"><Icon /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
