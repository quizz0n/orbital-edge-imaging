export default {
  namespaced: true,
  state() {
    return {
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  getters: {
    getAlert(state) {
      return state.snackbar;
    },
  },
  mutations: {
    SET_ALERT(state, payload) {
      state.snackbar.show = true;
      state.snackbar.message = payload.message;
      state.snackbar.color = payload.color;
    },
  },
  actions: {
    setAlert({ commit }, payload) {
      commit('SET_ALERT', payload);
    },
  },
};
