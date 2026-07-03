import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../services/api';
import './Testimonials.css';

export default function Testimonials() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then(r => setItems(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="tes-hero">
        <div className="section-eyebrow" style={{margin:'0 auto 16px'}}>Client Stories</div>
        <h1 className="section-title" style={{fontSize:'3rem',color:'var(--indigo-dark)'}}>What Our Clients Say</h1>
        <p className="section-subtitle" style={{margin:'0 auto'}}>Real results from real businesses. Here's why over 500 companies choose AI-Solutions.</p>
      </section>

      <section className="section" style={{background:'var(--cream-light)'}}>
        <div className="section-inner">
          {/* Stats strip */}
          <div className="rating-strip">
            {[['500+','Happy Clients'],['4.9/5','Average Rating'],['98%','Would Recommend'],['40+','Active Projects']].map(([n,l]) => (
              <div key={l} className="rating-stat">
                <div className="rating-stat-num">{n}</div>
                <div className="rating-stat-label">{l}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="page-loading"><div className="spinner spinner-dark" /></div>
          ) : (
            <div className="grid-3">
              {items.map(t => (
                <div key={t._id} className="tes-card">
                  <div className="tes-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}</div>
                  <div className="tes-quote">"</div>
                  <p className="tes-text">{t.text}</p>
                  <div className="tes-author">
                    <div className="tes-avatar">{t.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div>
                      <div className="tes-name">{t.name}</div>
                      <div className="tes-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
