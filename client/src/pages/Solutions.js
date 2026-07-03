import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaRobot } from 'react-icons/fa6';
import { getSolutions } from '../services/api';
import './Solutions.css';

export default function Solutions() {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState({});

  useEffect(() => {
    getSolutions()
      .then(r => setSolutions(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  if (loading) return (
    <div>
      <div className="sol-hero" />
      <div className="page-loading"><div className="spinner spinner-dark" /></div>
    </div>
  );

  return (
    <>
      <section className="sol-hero">
        <div className="section-eyebrow" style={{color:'var(--gold)',margin:'0 auto 16px'}}>Our Portfolio</div>
        <h1>AI-Powered Software Solutions</h1>
        <p>Purpose-built tools that automate, accelerate, and amplify your team's capabilities — without the enterprise price tag.</p>
      </section>

      <section className="section" style={{background:'var(--cream-light)'}}>
        <div className="section-inner">
          <div className="grid-3">
            {solutions.map(s => {
              const isOpen = expanded[s._id];
              return (
                <div key={s._id} className="sol-card">
                  <div className="sol-card-img">
                    <span style={{fontSize:'3rem'}}>{s.icon}</span>
                  </div>
                  <div className="sol-card-body">
                    <span className="tag tag-gold" style={{marginBottom:'12px',display:'inline-block'}}>{s.category}</span>
                    <h3 className="sol-card-title">{s.title}</h3>
                    <p className="sol-card-desc">{s.desc}</p>
                    <div className="sol-card-tags">
                      {s.tags.map(t => <span key={t} className="tag tag-indigo">{t}</span>)}
                    </div>

                    {isOpen && (
                      <div className="sol-expanded">
                        {s.full.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                        {s.features?.length > 0 && (
                          <ul className="sol-features-list">
                            {s.features.map(f => <li key={f}>{f}</li>)}
                          </ul>
                        )}
                      </div>
                    )}

                    <button className={`btn-expand${isOpen ? ' open' : ''}`} onClick={() => toggle(s._id)}>
                      {isOpen ? 'Show Less' : 'Read More'}
                      <FaChevronDown className="expand-icon" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="cta-strip">
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <h2>Not Sure Which Solution Fits?</h2>
          <p>Our AI advisor Aria can suggest the right package based on your industry and team size.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/contact')} style={{background:'var(--indigo-dark)'}}>
            <FaRobot /> Chat with Aria
          </button>
        </div>
      </div>
    </>
  );
}
