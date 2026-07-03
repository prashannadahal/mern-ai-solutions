import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ──────────────────────────────────────
export const login = (data) => api.post('/auth/login', data);
export const getMe  = ()     => api.get('/auth/me');

// ── Public ────────────────────────────────────
export const getSolutions    = ()       => api.get('/solutions');
export const getServices     = ()       => api.get('/services');
export const getArticles     = (cat)    => api.get('/articles', { params: { category: cat } });
export const getArticleCats  = ()       => api.get('/articles/categories');
export const getGallery      = (cat)    => api.get('/gallery',  { params: { category: cat } });
export const getGalleryCats  = ()       => api.get('/gallery/categories');
export const getTestimonials = ()       => api.get('/testimonials');
export const submitInquiry   = (data)   => api.post('/inquiries', data);
export const chatWithAria    = (messages, apiKey) => api.post('/ai/chat', { messages, apiKey });

// ── Admin ─────────────────────────────────────
export const getInquiries    = (params) => api.get('/inquiries', { params });
export const updateInquiry   = (id, d)  => api.put(`/inquiries/${id}`, d);
export const deleteInquiry   = (id)     => api.delete(`/inquiries/${id}`);

export const createSolution  = (d) => api.post('/solutions', d);
export const updateSolution  = (id,d) => api.put(`/solutions/${id}`, d);
export const deleteSolution  = (id) => api.delete(`/solutions/${id}`);

export const createService   = (d) => api.post('/services', d);
export const updateService   = (id,d) => api.put(`/services/${id}`, d);
export const deleteService   = (id) => api.delete(`/services/${id}`);

export const createArticle   = (d) => api.post('/articles', d);
export const updateArticle   = (id,d) => api.put(`/articles/${id}`, d);
export const deleteArticle   = (id) => api.delete(`/articles/${id}`);

export const createGallery   = (d) => api.post('/gallery', d);
export const updateGallery   = (id,d) => api.put(`/gallery/${id}`, d);
export const deleteGallery   = (id) => api.delete(`/gallery/${id}`);

export const createTestimonial = (d) => api.post('/testimonials', d);
export const updateTestimonial = (id,d) => api.put(`/testimonials/${id}`, d);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

export const getAnalytics    = () => api.get('/analytics/overview');
