import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const httpService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const get = (url, config) => httpService.get(url, config);
const post = (url, data, config) => httpService.post(url, data, config);
const put = (url, data, config) => httpService.put(url, data, config);
const remove = (url, config) => httpService.delete(url, config);

export default {
  get,
  post,
  put,
  delete: remove,
};
