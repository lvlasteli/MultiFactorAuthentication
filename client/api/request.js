import axios from 'axios';
require('dotenv').config();

const request = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
  });

  request.interceptors.request.use(config => {
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
  
  export default request;