import { createStore } from "vuex";
import auth from './modules/auth';
import appointments from './modules/appointments';
import hairdressers from './modules/hairdressers';

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    appointments,
    hairdressers
  },
});
