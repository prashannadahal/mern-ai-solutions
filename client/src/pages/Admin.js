import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaRobot, FaChartPie, FaInbox, FaNewspaper, FaImages, FaStar,
  FaPuzzlePiece, FaGears, FaSliders, FaRightFromBracket, FaPlus,
  FaPen, FaTrash, FaDownload, FaShield
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import {
  login as apiLogin,
  getInquiries, updateInquiry, deleteInquiry,
  getArticles, createArticle, updateArticle, deleteArticle,
  getGallery, createGallery, updateGallery, deleteGallery,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getSolutions, createSolution, updateSolution, deleteSolution,
  getServices, createService, updateService, deleteService,
  getAnalytics,
} from '../services/api';
import './Admin.css';

/* ── Reusable Modal ──────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">{title}</h3>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Stat Widget ─────────────────────────────────── */
function StatCard({ icon: Icon, num, label, color }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-icon" style={{ color }}><Icon /></div>
      <div className="adm-stat-num">{num}</div>
      <div className="adm-stat-label">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   LOGIN SCREEN
───────────────────────────────────────────────── */
function AdminLogin() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]     = useState('admin@ai-solutions.co.uk');
  const [password, setPass]   = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      loginUser(res.data.token, res.data.user);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid credentials. Try admin@ai-solutions.co.uk / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="adm-login-logo"><FaShield /></div>
        <h2 className="adm-login-title">Admin Access</h2>
        <p className="adm-login-sub">Sign in to manage your AI-Solutions content and data.</p>
        <div className="form-group" style={{textAlign:'left'}}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        </div>
        <div className="form-group" style={{textAlign:'left'}}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        </div>
        <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'8px'}} onClick={handleLogin} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Sign In →'}
        </button>
        {/* <p style={{fontSize:'.75rem',color:'var(--slate)',marginTop:'16px'}}>Demo: admin@ai-solutions.co.uk / admin123</p> */}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key:'dashboard',          label:'Dashboard',    icon:FaChartPie,    group:'Overview' },
  { key:'inquiries',          label:'Inquiries',    icon:FaInbox,       group:'Overview' },
  { key:'articles',           label:'Articles',     icon:FaNewspaper,   group:'Content'  },
  { key:'gallery',            label:'Gallery',      icon:FaImages,      group:'Content'  },
  { key:'testimonials',       label:'Testimonials', icon:FaStar,        group:'Content'  },
  { key:'solutions',          label:'Solutions',    icon:FaPuzzlePiece, group:'Content'  },
  { key:'services',           label:'Services',     icon:FaGears,       group:'Content'  },
  { key:'settings',           label:'Settings',     icon:FaSliders,     group:'Settings' },
];

function Sidebar({ active, onNav, onLogout }) {
  const groups = [...new Set(NAV_ITEMS.map(i => i.group))];
  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-header">
  <button
    className="adm-sidebar-logo adm-logo-btn"
    onClick={() => window.location.href = '/'}
    title="Go to main website"
  >
    <FaRobot className="adm-logo-icon" />
    AI-Solutions
  </button>
</div>
      <nav className="adm-nav">
        {groups.map(g => (
          <div key={g}>
            <div className="adm-nav-group">{g}</div>
            {NAV_ITEMS.filter(i=>i.group===g).map(item => (
              <button key={item.key} className={`adm-nav-item${active===item.key?' active':''}`} onClick={()=>onNav(item.key)}>
                <item.icon /> {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="adm-sidebar-footer">
        <button className="adm-nav-item" onClick={onLogout}><FaRightFromBracket /> Sign Out</button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────── */
function Dashboard({ onNav }) {
  const [data, setData] = useState(null);

  useEffect(() => { getAnalytics().then(r=>setData(r.data.data)).catch(()=>{}); }, []);

  const c = data?.counts || {};
  return (
    <div>
      <div className="adm-stats-grid">
        <StatCard icon={FaInbox}     num={c.inquiries||0}    label="Inquiries"    color="var(--indigo)" />
        <StatCard icon={FaNewspaper} num={c.articles||0}     label="Articles"     color="var(--gold)" />
        <StatCard icon={FaImages}    num={c.gallery||0}      label="Gallery Items" color="#5A52A8" />
        <StatCard icon={FaStar}      num={c.testimonials||0} label="Testimonials"  color="var(--gold-dark)" />
      </div>
      <div className="adm-table-wrap" style={{marginTop:'8px'}}>
        <div className="adm-table-toolbar">
          <h3 className="adm-section-title" style={{margin:0}}>Recent Inquiries</h3>
          <button className="btn btn-outline btn-sm" onClick={()=>onNav('inquiries')}>View All</button>
        </div>
        <RecentInquiries />
      </div>
    </div>
  );
}

function RecentInquiries() {
  const [items, setItems] = useState([]);
  useEffect(() => { getInquiries({limit:5}).then(r=>setItems(r.data.data)).catch(()=>{}); }, []);
  return (
    <table className="adm-table">
      <thead><tr><th>Name</th><th>Company</th><th>Country</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>
        {items.map(i=>(
          <tr key={i._id}>
            <td><strong>{i.name}</strong><br/><small style={{color:'var(--slate)'}}>{i.email}</small></td>
            <td>{i.company}</td><td>{i.country}</td>
            <td>{new Date(i.createdAt).toLocaleDateString()}</td>
            <td><StatusBadge status={i.status} /></td>
          </tr>
        ))}
        {items.length===0 && <tr><td colSpan={5} style={{textAlign:'center',padding:'32px',color:'var(--slate)'}}>No inquiries yet</td></tr>}
      </tbody>
    </table>
  );
}

/* ─────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = { New:'tag-gold', 'In Progress':'tag-indigo', Completed:'tag-green', Closed:'tag-red' };
  return <span className={`tag ${map[status]||'tag-indigo'}`}>{status}</span>;
}

/* ─────────────────────────────────────────────────
   INQUIRIES
───────────────────────────────────────────────── */
function Inquiries() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => { setLoading(true); getInquiries().then(r=>setItems(r.data.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const del = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    await deleteInquiry(id); toast.success('Deleted'); load();
  };

  const save = async (id, status) => {
    await updateInquiry(id, { status }); toast.success('Status updated'); setEditing(null); load();
  };

  const exportCSV = () => {
    const headers = ['Name','Email','Phone','Company','Country','Job Title','Details','Date','Status'];
    const rows = items.map(i=>[i.name,i.email,i.phone||'',i.company,i.country,i.jobTitle||'',i.jobDetails||'',new Date(i.createdAt).toLocaleDateString(),i.status].map(v=>`"${v||''}"`).join(','));
    const csv = [headers.join(','),...rows].join('\n');
    const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='inquiries.csv'; a.click();
    toast.success('CSV exported!');
  };

  return (
    <div>
      <div className="adm-toolbar">
        <h2 className="adm-section-title">Customer Inquiries</h2>
        <button className="btn btn-outline btn-sm" onClick={exportCSV}><FaDownload /> Export CSV</button>
      </div>
      {loading ? <div className="page-loading"><div className="spinner spinner-dark"/></div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Country</th><th>Interest</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(i=>(
                <tr key={i._id}>
                  <td><strong>{i.name}</strong></td>
                  <td>{i.email}</td><td>{i.company}</td><td>{i.country}</td>
                  <td className="adm-td-truncate">{i.interest||'—'}</td>
                  <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={i.status} /></td>
                  <td>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="adm-action-btn adm-btn-edit" onClick={()=>setEditing(i)} title="Edit"><FaPen /></button>
                      <button className="adm-action-btn adm-btn-del"  onClick={()=>del(i._id)} title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length===0 && <tr><td colSpan={8} style={{textAlign:'center',padding:'32px',color:'var(--slate)'}}>No inquiries yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <Modal title="Update Inquiry Status" onClose={()=>setEditing(null)}>
          <p style={{marginBottom:'16px',fontSize:'.9rem',color:'var(--slate)'}}><strong>{editing.name}</strong> — {editing.company}</p>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" defaultValue={editing.status} id="inqStatus">
              {['New','In Progress','Completed','Closed'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>save(editing._id, document.getElementById('inqStatus').value)}>Save</button>
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   ARTICLES ADMIN
───────────────────────────────────────────────── */
function ArticlesAdmin() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null); // null | 'new' | item

  const load = () => { setLoading(true); getArticles().then(r=>setItems(r.data.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const del = async (id) => { if (!window.confirm('Delete?')) return; await deleteArticle(id); toast.success('Deleted'); load(); };
  const save = async (data, id) => {
    if (id) await updateArticle(id, data); else await createArticle(data);
    toast.success(id ? 'Article updated!' : 'Article created!'); setModal(null); load();
  };

  return (
    <div>
      <div className="adm-toolbar">
        <h2 className="adm-section-title">Articles</h2>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')}><FaPlus /> New Article</button>
      </div>
      {loading ? <div className="page-loading"><div className="spinner spinner-dark"/></div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Thumb</th><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(a=>(
                <tr key={a._id}>
                  <td><div className="adm-thumb">{a.thumb?<img src={a.thumb} alt=""/>:'📰'}</div></td>
                  <td><strong>{a.title}</strong></td>
                  <td><span className="tag tag-gold">{a.category}</span></td>
                  <td>{a.author}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><div style={{display:'flex',gap:'6px'}}>
                    <button className="adm-action-btn adm-btn-edit" onClick={()=>setModal(a)}><FaPen /></button>
                    <button className="adm-action-btn adm-btn-del"  onClick={()=>del(a._id)}><FaTrash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && <ArticleModal item={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  );
}

function ArticleModal({ item, onClose, onSave }) {
  const [f, setF] = useState({ title:item?.title||'', author:item?.author||'', category:item?.category||'', thumb:item?.thumb||'', excerpt:item?.excerpt||'', full:item?.full||'', tags:(item?.tags||[]).join(', ') });
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const submit = () => {
    if (!f.title||!f.excerpt) { toast.error('Title and excerpt required'); return; }
    onSave({ ...f, tags: f.tags.split(',').map(t=>t.trim()).filter(Boolean) }, item?._id);
  };
  return (
    <Modal title={item ? 'Edit Article' : 'New Article'} onClose={onClose}>
      <div className="form-row"><div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={f.title} onChange={e=>set('title',e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Author</label><input className="form-input" value={f.author} onChange={e=>set('author',e.target.value)} /></div></div>
      <div className="form-row"><div className="form-group"><label className="form-label">Category</label><input className="form-input" value={f.category} onChange={e=>set('category',e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Tags (comma-sep)</label><input className="form-input" value={f.tags} onChange={e=>set('tags',e.target.value)} /></div></div>
      <div className="form-group"><label className="form-label">Thumbnail URL</label><input className="form-input" value={f.thumb} onChange={e=>set('thumb',e.target.value)} placeholder="https://images.unsplash.com/..." /></div>
      {f.thumb && <img src={f.thumb} alt="" style={{width:'100%',height:'140px',objectFit:'cover',borderRadius:'8px',marginBottom:'16px'}} />}
      <div className="form-group"><label className="form-label">Excerpt *</label><textarea className="form-textarea" style={{minHeight:'80px'}} value={f.excerpt} onChange={e=>set('excerpt',e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Full Content</label><textarea className="form-textarea" style={{minHeight:'120px'}} value={f.full} onChange={e=>set('full',e.target.value)} /></div>
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={submit}>Save Article</button>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────
   GALLERY ADMIN
───────────────────────────────────────────────── */
function GalleryAdmin() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);

  const load = () => { setLoading(true); getGallery().then(r=>setItems(r.data.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);
  const del = async (id) => { if (!window.confirm('Delete?')) return; await deleteGallery(id); toast.success('Deleted'); load(); };
  const save = async (data, id) => {
    if (id) await updateGallery(id, data); else await createGallery(data);
    toast.success(id ? 'Updated!' : 'Created!'); setModal(null); load();
  };

  return (
    <div>
      <div className="adm-toolbar">
        <h2 className="adm-section-title">Gallery</h2>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')}><FaPlus /> Add Photo</button>
      </div>
      {loading ? <div className="page-loading"><div className="spinner spinner-dark"/></div> : (
        <div className="adm-gallery-grid">
          {items.map(g=>(
            <div key={g._id} className="adm-gallery-item">
              <div className="adm-gallery-img">
                {g.img ? <img src={g.img} alt={g.title} /> : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:'2rem',color:'var(--gold)'}}>🖼️</div>}
              </div>
              <div className="adm-gallery-info">
                <div className="adm-gallery-title">{g.title}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span className="tag tag-indigo" style={{fontSize:'.65rem'}}>{g.category}</span>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="adm-action-btn adm-btn-edit" onClick={()=>setModal(g)}><FaPen /></button>
                    <button className="adm-action-btn adm-btn-del"  onClick={()=>del(g._id)}><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <GalleryModal item={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  );
}

function GalleryModal({ item, onClose, onSave }) {
  const [f, setF] = useState({ title:item?.title||'', category:item?.category||'', img:item?.img||'' });
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const submit = () => { if (!f.title) { toast.error('Title required'); return; } onSave(f, item?._id); };
  return (
    <Modal title={item ? 'Edit Photo' : 'Add Photo'} onClose={onClose}>
      <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={f.title} onChange={e=>set('title',e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={f.category} onChange={e=>set('category',e.target.value)} placeholder="Events, Team, Demo Days…" /></div>
      <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" value={f.img} onChange={e=>set('img',e.target.value)} placeholder="https://images.unsplash.com/..." /></div>
      {f.img && <img src={f.img} alt="" style={{width:'100%',height:'160px',objectFit:'cover',borderRadius:'8px',marginBottom:'16px'}} onError={e=>e.target.style.display='none'} />}
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={submit}>Save Photo</button>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────
   TESTIMONIALS ADMIN
───────────────────────────────────────────────── */
function TestimonialsAdmin() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);

  const load = () => { setLoading(true); getTestimonials().then(r=>setItems(r.data.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);
  const del = async (id) => { if (!window.confirm('Delete?')) return; await deleteTestimonial(id); toast.success('Deleted'); load(); };
  const save = async (data, id) => {
    if (id) await updateTestimonial(id, data); else await createTestimonial(data);
    toast.success(id ? 'Updated!' : 'Created!'); setModal(null); load();
  };

  return (
    <div>
      <div className="adm-toolbar">
        <h2 className="adm-section-title">Testimonials</h2>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')}><FaPlus /> Add Testimonial</button>
      </div>
      {loading ? <div className="page-loading"><div className="spinner spinner-dark"/></div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Role</th><th>Company</th><th>Rating</th><th>Review</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(t=>(
                <tr key={t._id}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.role}</td><td>{t.company}</td>
                  <td>{'★'.repeat(t.rating)}</td>
                  <td className="adm-td-truncate">{t.text.substring(0,60)}…</td>
                  <td><div style={{display:'flex',gap:'6px'}}>
                    <button className="adm-action-btn adm-btn-edit" onClick={()=>setModal(t)}><FaPen /></button>
                    <button className="adm-action-btn adm-btn-del"  onClick={()=>del(t._id)}><FaTrash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && <TestimonialModal item={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  );
}

function TestimonialModal({ item, onClose, onSave }) {
  const [f, setF] = useState({ name:item?.name||'', role:item?.role||'', company:item?.company||'', rating:item?.rating||5, text:item?.text||'' });
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const submit = () => { if (!f.name||!f.text) { toast.error('Name and review required'); return; } onSave(f, item?._id); };
  return (
    <Modal title={item ? 'Edit Testimonial' : 'Add Testimonial'} onClose={onClose}>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={f.name} onChange={e=>set('name',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Role</label><input className="form-input" value={f.role} onChange={e=>set('role',e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={f.company} onChange={e=>set('company',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Rating</label><select className="form-select" value={f.rating} onChange={e=>set('rating',Number(e.target.value))}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} Star{n!==1?'s':''}</option>)}</select></div>
      </div>
      <div className="form-group"><label className="form-label">Review *</label><textarea className="form-textarea" value={f.text} onChange={e=>set('text',e.target.value)} /></div>
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={submit}>Save Testimonial</button>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────
   SOLUTIONS ADMIN
───────────────────────────────────────────────── */
function SolutionsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => { setLoading(true); getSolutions().then(r=>setItems(r.data.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);
  const del = async (id) => { if (!window.confirm('Delete?')) return; await deleteSolution(id); toast.success('Deleted'); load(); };
  const save = async (data, id) => {
    if (id) await updateSolution(id, data); else await createSolution(data);
    toast.success(id ? 'Updated!' : 'Created!'); setModal(null); load();
  };

  return (
    <div>
      <div className="adm-toolbar">
        <h2 className="adm-section-title">Solutions</h2>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')}><FaPlus /> Add Solution</button>
      </div>
      {loading ? <div className="page-loading"><div className="spinner spinner-dark"/></div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Icon</th><th>Title</th><th>Category</th><th>Tags</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(s=>(
                <tr key={s._id}>
                  <td style={{fontSize:'1.5rem'}}>{s.icon}</td>
                  <td><strong>{s.title}</strong></td>
                  <td><span className="tag tag-gold">{s.category}</span></td>
                  <td>{s.tags.map(t=><span key={t} className="tag tag-indigo" style={{marginRight:'4px'}}>{t}</span>)}</td>
                  <td><div style={{display:'flex',gap:'6px'}}>
                    <button className="adm-action-btn adm-btn-edit" onClick={()=>setModal(s)}><FaPen /></button>
                    <button className="adm-action-btn adm-btn-del"  onClick={()=>del(s._id)}><FaTrash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && <SolutionModal item={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  );
}

function SolutionModal({ item, onClose, onSave }) {
  const [f, setF] = useState({ title:item?.title||'', icon:item?.icon||'🤖', category:item?.category||'', tags:(item?.tags||[]).join(', '), desc:item?.desc||'', full:item?.full||'', features:(item?.features||[]).join('\n') });
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const submit = () => {
    if (!f.title||!f.desc) { toast.error('Title and description required'); return; }
    onSave({ ...f, tags:f.tags.split(',').map(t=>t.trim()).filter(Boolean), features:f.features.split('\n').map(s=>s.trim()).filter(Boolean) }, item?._id);
  };
  return (
    <Modal title={item ? 'Edit Solution' : 'New Solution'} onClose={onClose}>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={f.title} onChange={e=>set('title',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Icon (emoji)</label><input className="form-input" value={f.icon} onChange={e=>set('icon',e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={f.category} onChange={e=>set('category',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Tags (comma-sep)</label><input className="form-input" value={f.tags} onChange={e=>set('tags',e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="form-label">Short Description *</label><textarea className="form-textarea" style={{minHeight:'80px'}} value={f.desc} onChange={e=>set('desc',e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Full Content</label><textarea className="form-textarea" style={{minHeight:'100px'}} value={f.full} onChange={e=>set('full',e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Features (one per line)</label><textarea className="form-textarea" style={{minHeight:'80px'}} value={f.features} onChange={e=>set('features',e.target.value)} /></div>
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={submit}>Save Solution</button>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────
   SERVICES ADMIN
───────────────────────────────────────────────── */
function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => { setLoading(true); getServices().then(r=>setItems(r.data.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);
  const del = async (id) => { if (!window.confirm('Delete?')) return; await deleteService(id); toast.success('Deleted'); load(); };
  const save = async (data, id) => {
    if (id) await updateService(id, data); else await createService(data);
    toast.success(id ? 'Updated!' : 'Created!'); setModal(null); load();
  };

  return (
    <div>
      <div className="adm-toolbar">
        <h2 className="adm-section-title">Services</h2>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')}><FaPlus /> Add Service</button>
      </div>
      {loading ? <div className="page-loading"><div className="spinner spinner-dark"/></div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Title</th><th>Tag</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(s=>(
                <tr key={s._id}>
                  <td><strong>{s.title}</strong></td>
                  <td><span className={`tag ${s.tagType}`}>{s.tag}</span></td>
                  <td className="adm-td-truncate">{s.desc}</td>
                  <td><div style={{display:'flex',gap:'6px'}}>
                    <button className="adm-action-btn adm-btn-edit" onClick={()=>setModal(s)}><FaPen /></button>
                    <button className="adm-action-btn adm-btn-del"  onClick={()=>del(s._id)}><FaTrash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && <ServiceModal item={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  );
}

function ServiceModal({ item, onClose, onSave }) {
  const [f, setF] = useState({ title:item?.title||'', icon:item?.icon||'fa-star', tag:item?.tag||'', tagType:item?.tagType||'tag-indigo', desc:item?.desc||'' });
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const submit = () => { if (!f.title||!f.desc) { toast.error('Title and description required'); return; } onSave(f, item?._id); };
  return (
    <Modal title={item ? 'Edit Service' : 'New Service'} onClose={onClose}>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={f.title} onChange={e=>set('title',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">FA Icon class</label><input className="form-input" value={f.icon} onChange={e=>set('icon',e.target.value)} placeholder="fa-code" /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Tag</label><input className="form-input" value={f.tag} onChange={e=>set('tag',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Tag Style</label>
          <select className="form-select" value={f.tagType} onChange={e=>set('tagType',e.target.value)}>
            <option value="tag-gold">Gold</option>
            <option value="tag-indigo">Indigo</option>
            <option value="tag-green">Green</option>
          </select>
        </div>
      </div>
      <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" value={f.desc} onChange={e=>set('desc',e.target.value)} /></div>
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={submit}>Save Service</button>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────
   SETTINGS
───────────────────────────────────────────────── */
function Settings() {
  return (
    <div style={{maxWidth:'600px'}}>
      <h2 className="adm-section-title" style={{marginBottom:'24px'}}>Settings</h2>
      <div className="adm-settings-card">
        <h3 className="adm-settings-heading">Site Information</h3>
        <div className="form-group"><label className="form-label">Site Name</label><input className="form-input" defaultValue="AI-Solutions" /></div>
        <div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" defaultValue="hello@ai-solutions.co.uk" /></div>
        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+44 191 000 1234" /></div>
        <button className="btn btn-primary btn-sm" onClick={()=>toast.success('Settings saved!')}>Save Changes</button>
      </div>
      <div className="adm-settings-card">
        <h3 className="adm-settings-heading">API Keys</h3>
        <div className="form-group"><label className="form-label">Groq API Key</label><input className="form-input" type="password" placeholder="gsk_..." /></div>
        <div className="form-group"><label className="form-label">Email SMTP Host</label><input className="form-input" defaultValue="smtp.gmail.com" /></div>
        <div className="form-group"><label className="form-label">Email SMTP User</label><input className="form-input" placeholder="your@gmail.com" /></div>
        <div className="form-group"><label className="form-label">Email SMTP Password</label><input className="form-input" type="password" placeholder="App password" /></div>
        <button className="btn btn-primary btn-sm" onClick={()=>toast.success('API keys updated!')}>Update Keys</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   MAIN ADMIN COMPONENT
───────────────────────────────────────────────── */
const SECTION_MAP = {
  dashboard:    <Dashboard />,
  inquiries:    <Inquiries />,
  articles:     <ArticlesAdmin />,
  gallery:      <GalleryAdmin />,
  testimonials: <TestimonialsAdmin />,
  solutions:    <SolutionsAdmin />,
  services:     <ServicesAdmin />,
  settings:     <Settings />,
};

const TITLES = { dashboard:'Dashboard', inquiries:'Customer Inquiries', articles:'Articles', gallery:'Gallery', testimonials:'Testimonials', solutions:'Solutions', services:'Services', settings:'Settings' };

function AdminDashboardLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState('dashboard');

  useEffect(() => {
    const seg = location.pathname.split('/admin/')[1] || 'dashboard';
    setSection(seg);
  }, [location]);

  const onNav = (key) => { setSection(key); navigate(`/admin/${key}`); };
  const onLogout = () => { logoutUser(); toast.success('Signed out'); navigate('/admin'); };

  const sectionEl = React.cloneElement(SECTION_MAP[section] || SECTION_MAP.dashboard, { onNav });

  return (
    <div className="adm-layout">
      <Sidebar active={section} onNav={onNav} onLogout={onLogout} />
      <main className="adm-main">
        <div className="adm-topbar">
          <span className="adm-topbar-title">{TITLES[section]}</span>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <span style={{fontSize:'.8rem',color:'var(--slate)'}}>Admin</span>
            <div className="adm-user-chip">{(user?.name||'A').split(' ').map(n=>n[0]).join('')}</div>
          </div>
        </div>
        <div className="adm-content">{sectionEl}</div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────────── */
export default function Admin() {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  if (!user)   return <AdminLogin />;

  return (
    <Routes>
      <Route path="/*" element={<AdminDashboardLayout />} />
    </Routes>
  );
}
