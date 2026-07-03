import React, { useEffect, useState, useCallback } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { getGallery, getGalleryCats } from '../services/api';
import './Gallery.css';

export default function Gallery() {
  const [items, setItems]       = useState([]);
  const [cats, setCats]         = useState(['All']);
  const [filter, setFilter]     = useState('All');
  const [loading, setLoading]   = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => { getGalleryCats().then(r => setCats(r.data.data)); }, []);

  useEffect(() => {
    setLoading(true);
    getGallery(filter === 'All' ? undefined : filter)
      .then(r => setItems(r.data.data))
      .finally(() => setLoading(false));
  }, [filter]);

  const closeLB = useCallback(() => setLightbox(null), []);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeLB();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeLB]);

  return (
    <>
      <section className="gal-hero">
        <div className="section-eyebrow" style={{color:'var(--gold)',margin:'0 auto 16px'}}>Our Events & Moments</div>
        <h1>Photo Gallery</h1>
        <p>A look at our events, team culture, and product demonstrations.</p>
      </section>

      <section className="section" style={{background:'var(--cream-light)'}}>
        <div className="section-inner">
          <div className="filter-bar">
            {cats.map(c => (
              <button key={c} className={`filter-btn${filter===c?' active':''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="page-loading"><div className="spinner spinner-dark" /></div>
          ) : (
            <div className="gal-grid">
              {items.map(item => (
                <div key={item._id} className="gal-item" onClick={() => setLightbox(item)}>
                  {item.img
                    ? <img src={item.img} alt={item.title} loading="lazy" />
                    : <div className="gal-placeholder">🖼️</div>}
                  <div className="gal-overlay">
                    <div className="gal-overlay-cat">{item.category}</div>
                    <div className="gal-overlay-title">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={closeLB}>
          <button className="lb-close" onClick={closeLB}><FaXmark /></button>
          <div className="lb-content" onClick={e => e.stopPropagation()}>
            {lightbox.img
              ? <img src={lightbox.img} alt={lightbox.title} className="lb-img" />
              : <div className="lb-placeholder">🖼️</div>}
          </div>
          <div className="lb-caption">{lightbox.title} — {lightbox.category}</div>
        </div>
      )}
    </>
  );
}
