import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa6';
import { getServices } from '../services/api';
import './Services.css';

const TECH = ['Python','React','Node.js','TensorFlow','PyTorch','LangChain','AWS','Azure','GCP','Kubernetes','Docker','FastAPI','PostgreSQL','MongoDB','Redis','Elasticsearch','HuggingFace','OpenAI','Groq','LLaMA'];

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [openId, setOpenId]     = useState(null);

  useEffect(() => {
    getServices()
      .then(r => setServices(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setOpenId(o => o === id ? null : id);

  if (loading) return (
    <div>
      <div className="svc-hero" />
      <div className="page-loading"><div className="spinner spinner-dark" /></div>
    </div>
  );

  return (
    <>
      <section className="svc-hero">
        <div className="section-eyebrow" style={{margin:'0 auto 16px'}}>What We Do</div>
        <h1 className="section-title" style={{fontSize:'3rem',color:'var(--indigo-dark)'}}>Expert Services,<br/>Delivered Fast</h1>
        <p className="section-subtitle" style={{margin:'0 auto'}}>From initial consultation to post-launch support, we cover every phase of your project lifecycle.</p>
      </section>

      <section className="section" style={{background:'var(--cream-light)'}}>
        <div className="section-inner" style={{maxWidth:'860px'}}>
          {services.map(s => {
            const isOpen = openId === s._id;
            return (
              <div key={s._id} className={`svc-item${isOpen ? ' open' : ''}`}>
                <div className="svc-item-header" onClick={() => toggle(s._id)}>
                  <div className="svc-item-icon">
                    <i className={`fa-solid ${s.icon}`} />
                  </div>
                  <div className="svc-item-info">
                    <div className="svc-item-title">{s.title}</div>
                    <span className={`tag ${s.tagType}`}>{s.tag}</span>
                  </div>
                  <FaChevronDown className={`svc-chevron${isOpen ? ' rotated' : ''}`} />
                </div>
                {isOpen && (
                  <div className="svc-item-body">
                    <p>{s.desc}</p>
                    {s.features?.length > 0 && (
                      <div className="svc-features-grid">
                        {s.features.map((f, i) => (
                          <div key={i} className="svc-feature">
                            <i className={`fa-solid ${f[1] || 'fa-check'}`} style={{color:'var(--gold)',marginTop:'2px',fontSize:'.85rem'}} />
                            <span className="svc-feature-text">{f[0]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="btn btn-outline btn-sm" style={{marginTop:'20px'}} onClick={() => navigate('/contact')}>
                      Enquire About This Service
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" style={{background:'var(--white)'}}>
        <div className="section-inner">
          <div className="section-header centered">
            <div className="section-eyebrow">Technologies We Use</div>
            <h2 className="section-title">Our Tech Stack</h2>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'12px',justifyContent:'center'}}>
            {TECH.map(t => (
              <span key={t} className="tag tag-indigo" style={{fontSize:'.82rem',padding:'8px 16px'}}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
