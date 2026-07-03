import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaLocationDot, FaClock } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { submitInquiry } from '../services/api';
import './Contact.css';

const INTERESTS = ['AI Virtual Assistant','Rapid Prototyping Suite','Predictive Analytics','Document AI','Custom AI Integration','General Enquiry','Schedule a Demo','Join Our Events'];
const COUNTRIES  = ['United Kingdom','United States','Germany','France','Netherlands','Australia','Canada','India','Singapore','UAE','Other'];

export default function Contact() {
  const [form, setForm]       = useState({ firstName:'', lastName:'', email:'', phone:'', company:'', country:'', jobTitle:'', interest:'', message:'', joinEvents:false });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErrors(e => ({...e, [k]:''})); };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.company.trim())  e.company  = 'Required';
    if (!form.country)         e.country  = 'Required';
    if (!form.message.trim())  e.message  = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await submitInquiry({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email, phone: form.phone, company: form.company,
        country: form.country, jobTitle: form.jobTitle, interest: form.interest,
        message: form.message, joinEvents: form.joinEvents,
        jobDetails: `Interest: ${form.interest || 'General'} — ${form.message}`,
      });
      toast.success(`Thank you ${form.firstName}! We'll be in touch within 24 hours.`);
      setForm({ firstName:'', lastName:'', email:'', phone:'', company:'', country:'', jobTitle:'', interest:'', message:'', joinEvents:false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="con-hero">
        <h1>Get in Touch</h1>
        <p>Tell us about your project. We'll match you with the right solution and get back to you within one business day.</p>
      </section>

      <div className="con-layout">
        {/* Info panel */}
        <div>
          <div className="con-info-card">
            <h3 className="con-info-heading">Contact Details</h3>
            {[
              [FaEnvelope, 'Email',    'hello@ai-solutions.co.uk'],
              [FaPhone,    'Phone',    '+44 191 000 1234'],
              [FaLocationDot,'Address','14 Innovation Quarter\nSunderland, SR1 1PP'],
              [FaClock,    'Hours',    'Mon–Fri: 9:00 – 17:00 GMT'],
            ].map(([Icon, label, value]) => (
              <div key={label} className="con-info-item">
                <div className="con-info-icon"><Icon /></div>
                <div>
                  <div className="con-info-label">{label}</div>
                  <div className="con-info-value" style={{whiteSpace:'pre-line'}}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="con-form-wrap">
          <h2 className="con-form-title">Send Us a Message</h2>
          <p className="con-form-sub">Fill in the form and we'll respond within 24 hours. Alternatively, use the chat widget to speak with Aria instantly.</p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input className="form-input" value={form.firstName} onChange={e=>set('firstName',e.target.value)} placeholder="Jane" />
              {errors.firstName && <div className="form-error">{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input className="form-input" value={form.lastName} onChange={e=>set('lastName',e.target.value)} placeholder="Smith" />
              {errors.lastName && <div className="form-error">{errors.lastName}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="jane@company.com" />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+44 7700 900000" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input className="form-input" value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Acme Corp" />
              {errors.company && <div className="form-error">{errors.company}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Country *</label>
              <select className="form-select" value={form.country} onChange={e=>set('country',e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.country && <div className="form-error">{errors.country}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input className="form-input" value={form.jobTitle} onChange={e=>set('jobTitle',e.target.value)} placeholder="Head of Technology" />
          </div>

          <div className="form-group">
            <label className="form-label">What are you interested in?</label>
            <select className="form-select" value={form.interest} onChange={e=>set('interest',e.target.value)}>
              <option value="">Select an area</option>
              {INTERESTS.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea className="form-textarea" value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Tell us about your project, team size, and timelines…" style={{minHeight:'140px'}} />
            {errors.message && <div className="form-error">{errors.message}</div>}
          </div>

          <label className="con-checkbox-row">
            <input type="checkbox" checked={form.joinEvents} onChange={e=>set('joinEvents',e.target.checked)} />
            <span>Join our events list — receive invites to demos, webinars, and promotional events</span>
          </label>

          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'8px'}} onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Sending…</> : 'Send Message'}
          </button>
          <p className="con-privacy">By submitting you agree to our Privacy Policy. We'll never share your data.</p>
        </div>
      </div>
    </>
  );
}
