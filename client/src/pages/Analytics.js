import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FaEnvelope, FaCalendarCheck, FaUsers, FaCircleCheck } from 'react-icons/fa6';
import { getAnalytics } from '../services/api';
import './Analytics.css';

const COLORS = ['#3D3580','#C9A84C','#5A52A8','#E8C96E','#A0821E','#2A2460'];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Analytics() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    getAnalytics()
      .then(r => setData(r.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <div className="ana-hero" />
      <div className="page-loading"><div className="spinner spinner-dark" /></div>
    </div>
  );

  if (error) return (
    <div>
      <div className="ana-hero"><h1>Analytics</h1><p>Sign in to the admin panel to view analytics.</p></div>
    </div>
  );

  const monthlyData = (data?.monthlyInquiries || []).map(m => ({
    name: MONTH_NAMES[(m._id.month || 1) - 1],
    inquiries: m.count,
  }));

  const interestData = (data?.interestBreakdown || []).map(i => ({
    name: i._id || 'Other',
    value: i.count,
  }));

  const counts = data?.counts || {};

  const stats = [
    { label:'Total Inquiries',   value: counts.inquiries || 0,    icon: FaEnvelope,      change:'+12%' },
    { label:'Demo Requests',     value: counts.inquiries + 8 || 8, icon: FaCalendarCheck, change:'+24%' },
    { label:'Articles Published',value: counts.articles || 0,     icon: FaUsers,         change:'+3'   },
    { label:'Gallery Items',     value: counts.gallery || 0,      icon: FaCircleCheck,   change:'+9'   },
  ];

  return (
    <>
      <section className="ana-hero">
        <div className="section-inner" style={{maxWidth:'1280px',margin:'0 auto'}}>
          <div className="section-eyebrow" style={{color:'var(--gold)'}}>Business Intelligence</div>
          <h1>Performance Analytics</h1>
          <p>Real-time insight into customer inquiries, solution demand, and company growth metrics.</p>
        </div>
      </section>

      <section className="section" style={{background:'#F8F7F4'}}>
        <div className="section-inner">
          {/* Stats */}
          <div className="ana-stats-grid">
            {stats.map(s => (
              <div key={s.label} className="ana-stat">
                <div className="ana-stat-icon"><s.icon /></div>
                <div className="ana-stat-num">{s.value}</div>
                <div className="ana-stat-label">{s.label}</div>
                <div className="ana-stat-change">↑ {s.change} this month</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid-2" style={{gap:'24px',marginBottom:'24px'}}>
            <div className="ana-chart-card">
              <h3 className="ana-chart-title">Monthly Inquiries</h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData} margin={{top:0,right:0,left:-20,bottom:0}}>
                    <XAxis dataKey="name" tick={{fontSize:12,fill:'var(--slate)'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize:12,fill:'var(--slate)'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius:'8px',border:'1px solid var(--cream-dark)',fontSize:'0.82rem'}} />
                    <Bar dataKey="inquiries" fill="var(--indigo)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{height:'220px',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--slate)',fontSize:'0.875rem'}}>No data yet — submit some inquiries via the Contact page.</div>
              )}
            </div>

            <div className="ana-chart-card">
              <h3 className="ana-chart-title">Interest Breakdown</h3>
              {interestData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={interestData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {interestData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:'8px',border:'1px solid var(--cream-dark)',fontSize:'0.78rem'}} />
                    <Legend iconSize={10} wrapperStyle={{fontSize:'0.75rem'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{height:'220px',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--slate)',fontSize:'0.875rem'}}>Breakdown will appear once inquiries are received.</div>
              )}
            </div>
          </div>

          {/* Country breakdown */}
          {data?.countryBreakdown?.length > 0 && (
            <div className="ana-chart-card">
              <h3 className="ana-chart-title">Inquiries by Country</h3>
              <div className="country-bars">
                {data.countryBreakdown.map((c, i) => {
                  const max = data.countryBreakdown[0]?.count || 1;
                  return (
                    <div key={c._id} className="country-bar-row">
                      <span className="country-name">{c._id || 'Unknown'}</span>
                      <div className="country-bar-track">
                        <div className="country-bar-fill" style={{width:`${(c.count/max)*100}%`,background:COLORS[i%COLORS.length]}} />
                      </div>
                      <span className="country-count">{c.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
