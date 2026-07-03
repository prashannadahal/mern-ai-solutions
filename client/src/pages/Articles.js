import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { getArticles, getArticleCats } from '../services/api';
import './Articles.css';

export default function Articles() {
  const [articles, setArticles]   = useState([]);
  const [cats, setCats]           = useState(['All']);
  const [filter, setFilter]       = useState('All');
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState({});

  useEffect(() => {
    getArticleCats().then(r => setCats(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getArticles(filter === 'All' ? undefined : filter)
      .then(r => setArticles(r.data.data))
      .finally(() => setLoading(false));
  }, [filter]);

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });

  return (
    <>
      <section className="art-hero">
        <div className="section-inner" style={{maxWidth:'1280px',margin:'0 auto'}}>
          <div className="section-eyebrow">Insights & Ideas</div>
          <h1 className="section-title" style={{fontSize:'3rem'}}>The AI-Solutions Blog</h1>
          <p className="section-subtitle">Expert commentary on AI, software engineering, and the future of work.</p>
        </div>
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
            <div className="grid-3">
              {articles.map(a => {
                const isOpen = expanded[a._id];
                return (
                  <div key={a._id} className="art-card">
                    <div className="art-thumb">
                      {a.thumb
                        ? <img src={a.thumb} alt={a.title} loading="lazy" />
                        : <div className="art-thumb-placeholder">📰</div>}
                    </div>
                    <div className="art-body">
                      <div className="art-meta">
                        <span className="tag tag-gold">{a.category}</span>
                        <span className="art-date">{fmt(a.createdAt)}</span>
                      </div>
                      <h3 className="art-title">{a.title}</h3>
                      <p className="art-excerpt">{a.excerpt}</p>

                      {isOpen && (
                        <div className="art-full">
                          {a.full.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                          {a.tags?.length > 0 && (
                            <div className="art-tags">
                              {a.tags.map(t => <span key={t} className="tag tag-indigo">{t}</span>)}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="art-footer">
                        <div className="art-author">
                          <div className="author-chip">{a.author.split(' ').map(n=>n[0]).join('')}</div>
                          <span className="author-name">{a.author}</span>
                        </div>
                        <button className={`btn-expand${isOpen?' open':''}`} onClick={() => toggle(a._id)}>
                          {isOpen ? 'Show Less' : 'Read More'}
                          <FaChevronDown className="expand-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && articles.length === 0 && (
            <div style={{textAlign:'center',padding:'64px',color:'var(--slate)'}}>No articles found in this category.</div>
          )}
        </div>
      </section>
    </>
  );
}
