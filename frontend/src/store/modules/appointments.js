import { appointmentService } from '@/services/api';

const state = {
    appointments: [],
    currentAppointment: null,
    loading: false,
    error: null,
};

const mutations = {
    SET_APPOINTMENTS(state, appointments) {
        state.appointments = appointments;
    },
    SET_CURRENT_APPOINTMENT(state, appointment) {
        state.currentAppointment = appointment;
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    ADD_APPOINTMENT(state, appointment) {
        state.appointments.push(appointment);
    },
    UPDATE_APPOINTMENT(state, updatedAppointment) {
        const index = state.appointments.findIndex(a => a.id === updatedAppointment.id);
        if (index !== -1) {
            state.appointments.splice(index, 1, updatedAppointment);
        }
    },
    REMOVE_APPOINTMENT(state, appointmentId) {
        state.appointments = state.appointments.filter(a => a.id !== appointmentId);
    },
};

const actions = {
    async fetchAppointments({ commit }) {
        commit('SET_LOADING', true);
        try {
            const response = await appointmentService.getAll();
            commit('SET_APPOINTMENTS', response.data);
            return response;
        } catch (error) {
            commit('SET_ERROR', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async createAppointment({ commit }, appointmentData) {
        commit('SET_LOADING', true);
        try {
            const response = await appointmentService.create(appointmentData);
            commit('ADD_APPOINTMENT', response.data);
            return response;
        } catch (error) {
            commit('SET_ERROR', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async updateAppointment({ commit }, { id, data }) {
        commit('SET_LOADING', true);
        try {
            const response = await appointmentService.update(id, data);
            commit('UPDATE_APPOINTMENT', response.data);
            return response;
        } catch (error) {
            commit('SET_ERROR', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async deleteAppointment({ commit }, id) {
        commit('SET_LOADING', true);
        try {
            await appointmentService.delete(id);
            commit('REMOVE_APPOINTMENT', id);
        } catch (error) {
            commit('SET_ERROR', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },
};

const getters = {
    allAppointments: state => state.appointments,
    currentAppointment: state => state.currentAppointment,
    isLoading: state => state.loading,
    error: state => state.error,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}; 