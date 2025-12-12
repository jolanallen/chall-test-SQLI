import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data;
};

export const register = async (email, username, password) => {
  const response = await api.post('/api/auth/register', { email, password, username });
  return response.data;
};

export const fetchPosts = async () => {
  const response = await api.get('/api/posts');
  return response.data;
};

export const createPost = async (content) => {
  const response = await api.post('/api/posts', { content });
  return response.data;
};

export const updateProfile = async (username, password, description) => {
    const response = await api.put('/api/auth/update-profile', { username, password, description });
    return response.data;
  };
  

export const getPublishers = async () => {
    const response = await api.get('/api/auth/publishers');
    return response.data;
  };
  
  export const followPublisher = async (publisherId) => {
    const response = await api.post(`/api/auth/follow/${publisherId}`);
    return response.data;
  };
  
  export const unfollowPublisher = async (publisherId) => {
    const response = await api.delete(`/api/auth/unfollow/${publisherId}`);
    return response.data;
  };
  
  export const fetchFeed = async () => {
    const response = await api.get('/api/posts/feed');
    return response.data;
  };
  
  export const fetchPublishers = async () => {
    const response = await api.get('/api/auth/publishers');
    return response.data;
  };


export default api;
