const state = {
	run_state: false,
	start: {}
};
const mutations = {
	SET_RUN_STATE(state, data) {
		console.log(data)
		state.run_state = data
		// uni.setStorageSync("integral", data)
	},
	REMOVE_RUN_STATE(state) {
		uni.removeStorageSync("run_state")
	},
	SET_RUN_START(state, data) {
		console.log("开始数据===>", data)
		state.start = data
		// uni.setStorageSync("integral", data)
	},
	// SET_COST(state, data) {
	// 	// 1.存入vuex
	// 	state.cost = data;
	// 	// 2.存入localstorage
	// 	uni.setStorageSync("cost", data);
	// 	console.log((state.cost))
	// },
	// REMOVE_COST(state) {
	// 	state.cost = {};
	// 	uni.removeStorageSync("cost");
	// },
	// SET_DATE(state, data) {
	// 	// 1.存入vuex
	// 	state.date = data;
	// 	// 2.存入localstorage
	// 	uni.setStorageSync("date", data);
	// 	console.log((state.date))
	// },
	// REMOVE_DATE(state) {
	// 	state.date = {};
	// 	uni.removeStorageSync("date");
	// },
	// SET_RECEIPT(state, data) {
	// 	// 1.存入vuex
	// 	state.receipt = data;
	// 	// 2.存入localstorage
	// 	uni.setStorageSync("receipt", data);

	// },
	// REMOVE_DATE(state) {
	// 	state.date = {};
	// 	uni.removeStorageSync("date");
	// },
	// SET_IMG(state, data) {
	// 	// 1.存入vuex
	// 	state.img = data;
	// 	// 2.存入localstorage
	// 	uni.setStorageSync("img", data);

	// },
	// REMOVE_DATE(state) {
	// 	state.date = {};
	// 	uni.removeStorageSync("date");
	// },
	// REMOVE_ALL() {
	// 	uni.removeStorageSync("cost")
	// 	uni.removeStorageSync("date")
	// 	uni.removeStorageSync("receipt")
	// 	uni.removeStorageSync("img")
	// }
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
