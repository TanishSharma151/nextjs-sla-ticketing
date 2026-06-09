import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // proxied through Next.js — fixes third-party cookie blocking
  withCredentials: true,
});

export default api;