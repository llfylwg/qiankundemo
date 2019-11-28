const app = {
  state: {
    progress: {
      progressPercentage: 0,
      showProgressBar: false,
      tipName: '',
    },
    balance: 0, // 账户余额
    sidebar: {
      opened: true,
      withoutAnimation: false,
    },
    device: 'desktop',
  },
  mutations: {
    SET_BALANCE: (state, params) => {
      state.balance = params;
    },
    progress: (state, progress) => {
      Object.assign(state.progress, progress);
    },
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR');
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device);
    },
  },
};

export default app;
