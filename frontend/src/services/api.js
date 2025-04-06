import axios from 'axios';
import router from '@/router';
import store from '@/store';

// Create Axios instance
const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
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

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            store.commit('auth/SET_TOKEN', null);
            store.commit('auth/SET_USER', null);
            
            if (router.currentRoute.value.name !== 'Login') {
                router.push({
                    name: 'Login',
                    query: { redirect: router.currentRoute.value.fullPath }
                });
            }
        }
        return Promise.reject(error);
    }
);

// Auth service
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile')
};

// User service
export const userService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.post('/users/profile', data),
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`)
};

// Hairdresser service
export const hairdresserService = {
    getAll: () => api.get('/hairdressers'),
    getById: (id) => api.get(`/hairdressers/${id}`),
    create: (data) => api.post('/hairdressers', data),
    update: (id, data) => api.put(`/hairdressers/${id}`, data),
    delete: (id) => api.delete(`/hairdressers/${id}`)
};

// Appointment service
export const appointmentService = {
    getAll: () => api.get('/appointments'),
    getById: (id) => api.get(`/appointments/${id}`),
    create: (data) => api.post('/appointments', data),
    update: (id, data) => api.put(`/appointments/${id}`, data),
    cancel: (id) => api.put(`/appointments/${id}/cancel`),
    getAvailableSlots: (hairdresserId, date) => 
        api.get(`/appointments/available-slots`, { params: { hairdresser_id: hairdresserId, date } })
};

export default api; 