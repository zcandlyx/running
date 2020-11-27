const state = {
	appTheme: 'pink'
};
const mutations = {
	TOGGLE_APP_THEME(state, color = 'pink') {
		console.log(color)
		state.appTheme = color
	}

}
const getters = {}
const actions = {};
export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true
}
