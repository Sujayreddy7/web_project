import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Axios Interceptor to attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; // Force login if token is bad or expired
    }
    return Promise.reject(error);
  }
);

// Auth routes
export const registerUser = (data) => api.post('auth/register/', data);
export const loginUser = (data) => api.post('auth/login/', data);

// Standard endpoints
export const getNotes = () => api.get('notes/');
export const createNote = (data) => api.post('notes/', data);

export const getTasks = () => api.get('tasks/');
export const createTask = (data) => api.post('tasks/', data);
export const updateTask = (id, data) => api.patch(`tasks/${id}/`, data);

export const getGoals = () => api.get('goals/');
export const createGoal = (data) => api.post('goals/', data);
export const updateGoal = (id, data) => api.patch(`goals/${id}/`, data);

export const getStudyPlans = () => api.get('study-plans/');
export const createStudyPlan = (data) => api.post('study-plans/', data);

export const summarizeNoteAI = (data) => api.post('ai/summarize/', data);
export const askQuestionAI = (data) => api.post('ai/ask/', data);
export const generatePlanAI = (data) => api.post('ai/plan/', data);

export default api;
