import axios from 'axios';

const BASE_URL = 'https://smartstudy-ai-production.up.railway.app/api';
const getHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const registerUser = (data) =>
  axios.post(`${BASE_URL}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${BASE_URL}/auth/login`, data);

// Study APIs
export const generateQuiz = (content) =>
  axios.post(`${BASE_URL}/study/generate-quiz`, { content }, getHeaders());

export const generateSummary = (content) =>
  axios.post(`${BASE_URL}/study/generate-summary`, { content }, getHeaders());

// Score APIs
export const saveScore = (data) =>
  axios.post(`${BASE_URL}/quiz/save-score`, data, getHeaders());

export const getHistory = (userId) =>
  axios.get(`${BASE_URL}/quiz/history/${userId}`, getHeaders());

// PDF Upload API
export const uploadPdf = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/pdf/upload`, formData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};