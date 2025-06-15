import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const httpService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const get = (url, config) => httpService.get(url, config);
const post = (url, data, config) => httpService.post(url, data, config);
const put = (url, data, config) => httpService.put(url, data, config);
const patch = (url, data, config) => httpService.patch(url, data, config);
const remove = (url, config) => httpService.delete(url, config);

export default {
  get,
  post,
  put,
  patch,
  delete: remove,
};
