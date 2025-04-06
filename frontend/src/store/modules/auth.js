import { authService } from '@/services/api';

const state = {
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
    error: null
};

const getters = {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.is_admin || false,
    currentUser: state => state.user,
    error: state => state.error,
    loading: state => state.loading
};

const actions = {
    async login({ commit }, credentials) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await authService.login(credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            commit('SET_TOKEN', token);
            commit('SET_USER', user);
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to login');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async register({ commit }, userData) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await authService.register(userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            commit('SET_TOKEN', token);
            commit('SET_USER', user);
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to register');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async logout({ commit }) {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('token');
            commit('SET_TOKEN', null);
            commit('SET_USER', null);
        }
    },

    async fetchUser({ commit }) {
        try {
            const response = await authService.getProfile();
            commit('SET_USER', response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            commit('SET_TOKEN', null);
            commit('SET_USER', null);
        }
    }
};

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token;
    },
    SET_USER(state, user) {
        state.user = user;
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    SET_ERROR(state, error) {
        state.error = error;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}; 