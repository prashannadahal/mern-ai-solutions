import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaCalendarCheck, FaArrowRight, FaStar } from 'react-icons/fa6';
import { getSolutions, getArticles, getTestimonials } from '../services/api';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [solutions, setSolutions]     = useState([]);
  const [articles, setArticles]       = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getSolutions().then(r => setSolutions(r.data.data.slice(0,3)));
    getArticles().then(r => setArticles(r.data.data.slice(0,3)));
    getTestimonials().then(r => setTestimonials(r.data.data.slice(0,3)));
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb-1" />
        <div className="hero-bg-orb hero-orb-2" />
        <div className="hero-inner">
          <div className="hero-content fade-up">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Sunderland's #1 AI Start-up
            </div>
            <h1 className="hero-title">
              Intelligent Software for the{' '}
              <em className="hero-em">Modern Workforce</em>
            </h1>
            <p className="hero-desc">
              AI-Solutions builds AI-powered tools that streamline digital employee experiences —
              from virtual assistants to rapid prototyping — so your teams can focus on what matters.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/contact')}>
                 Contact Us
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/solutions')}>
                Explore Solutions
              </button>
            </div>
            <div className="hero-stats">
              {[['500+','Customers Worldwide'], ['98%','Client Satisfaction'], ['40+','AI Solutions Delivered']].map(([n,l]) => (
                <div key={l}>
                  <div className="hero-stat-num">{n}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual fade-up fade-up-2">
            <div className="hero-float hero-float-1">
              <div className="float-label">Response Time</div>
              <div className="float-value" style={{color:'var(--success)'}}>↑ 3× Faster</div>
            </div>
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-avatar"><FaRobot /></div>
                <div>
                  <div className="hero-card-title">Aria — AI Virtual Assistant</div>
                  <div className="hero-card-sub">ai-solutions.co.uk · Active</div>
                </div>
              </div>
              <div className="chat-bubble ai">Hello! I'm Aria. How can I help you today? I can assist with software queries, schedule demos, or connect you with our team. 🤖</div>
              <div className="chat-bubble user">We need a custom AI solution for 200+ employees across three sites.</div>
              <div className="chat-bubble ai">Great choice. Based on your scale, I'd recommend our Enterprise AI Suite. Shall I walk you through the features or book a personalised demo?</div>
            </div>
            <div className="hero-float hero-float-2">
              <div className="float-label">Active Projects</div>
              <div className="float-value">24 this month</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <div className="trusted-bar">
        <div className="trusted-inner">
          <span className="trusted-label">Trusted by</span>
          <div className="trusted-logos">
            {['TechNova','Meridian Labs','Orbis Group','Synapse Co.','QuantumEdge'].map(n => (
              <span key={n} className="trusted-logo">{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOLUTIONS PREVIEW ── */}
      <section className="section" style={{background:'var(--cream-light)'}}>
        <div className="section-inner">
          <div className="section-header centered">
            <div className="section-eyebrow">What We Build</div>
            <h2 className="section-title">Solutions Designed for Scale</h2>
            <p className="section-subtitle">From AI virtual assistants to full enterprise software suites, every product is built around your workflow.</p>
          </div>
          <div className="grid-3">
            {solutions.map(s => (
              <div key={s._id} className="sol-preview-card">
                <div className="sol-preview-icon">{s.icon}</div>
                <h3 className="sol-preview-title">{s.title}</h3>
                <p className="sol-preview-desc">{s.desc}</p>
                <div className="sol-preview-tags">
                  {s.tags.map(t => <span key={t} className="tag tag-indigo">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'40px'}}>
            <button className="btn btn-outline" onClick={() => navigate('/solutions')}>
              View All Solutions <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section process-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-eyebrow" style={{color:'var(--gold)'}}>How We Work</div>
            <h2 className="section-title" style={{color:'var(--white)'}}>From Brief to Deployment in 4 Steps</h2>
          </div>
          <div className="process-steps">
            {[
              ['01','💬','Discovery Call','We listen deeply to understand your workflow pain points and business goals before writing a line of code.'],
              ['02','🎨','Solution Design','Our architects design a bespoke AI-powered solution with clear milestones and a fixed-price proposal.'],
              ['03','⚡','Rapid Build','Agile sprints with weekly demos keep you in the loop. Average time from contract to prototype: 3 weeks.'],
              ['04','🚀','Deploy & Support','We handle production deployment and provide ongoing 24/7 monitoring, updates, and dedicated support.'],
            ].map(([n,ic,t,d]) => (
              <div key={n} className="process-step">
                <div className="process-num">STEP {n}</div>
                <div className="process-icon">{ic}</div>
                <h4 className="process-title">{t}</h4>
                <p className="process-desc">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES PREVIEW ── */}
      <section className="section" style={{background:'var(--white)'}}>
        <div className="section-inner">
          <div className="section-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'20px'}}>
            <div>
              <div className="section-eyebrow">Latest Thinking</div>
              <h2 className="section-title">From Our Blog</h2>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/articles')} style={{alignSelf:'flex-end'}}>
              All Articles <FaArrowRight />
            </button>
          </div>
          <div className="grid-3">
            {articles.map(a => (
              <div key={a._id} className="article-preview-card">
                <div className="article-preview-thumb">
                  {a.thumb ? <img src={a.thumb} alt={a.title} loading="lazy" /> : <div className="article-thumb-placeholder">📰</div>}
                </div>
                <div className="article-preview-body">
                  <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
                    <span className="tag tag-gold">{a.category}</span>
                  </div>
                  <h4 className="article-preview-title">{a.title}</h4>
                  <p className="article-preview-excerpt">{a.excerpt}</p>
                  <div className="article-preview-footer">
                    <span className="article-author-chip">{a.author.split(' ').map(n=>n[0]).join('')}</span>
                    <span style={{fontSize:'0.78rem',fontWeight:600,color:'var(--slate-dark)'}}>{a.author}</span>
                    <button className="btn-text-link" onClick={() => navigate('/articles')}>Read More →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS PREVIEW ── */}
      <section className="section" style={{background:'var(--cream-light)'}}>
        <div className="section-inner">
          <div className="section-header centered">
            <div className="section-eyebrow">Social Proof</div>
            <h2 className="section-title">Clients Who Trust Us</h2>
          </div>
          <div className="grid-3">
            {testimonials.map(t => (
              <div key={t._id} className="testi-card">
                <div className="testi-stars">{'★'.repeat(t.rating)}</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.name.split(' ').map(n=>n[0]).join('')}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'40px'}}>
            <button className="btn btn-gold" onClick={() => navigate('/testimonials')}>
              Read All Reviews <FaStar />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-strip">
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <h2>Ready to Accelerate Your Digital Workforce?</h2>
          <p>Book a free 30-minute consultation and see how AI-Solutions can transform your operations.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/contact')} style={{background:'var(--indigo-dark)'}}>
            Get in Touch <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}
