import http from "@/utils/request.js"

function getOpenId(data) {
	return http({
		method: "POST",
		data: data,
		url: "/user/wxOpenId"
		// url: "http://127.0.0.1:8000/api/user/getKey"
	})
}

function getStep(data) {
	return http({
		method: "POST",
		data: data,
		// url: "http://39.107.233.206:8000/login"
		url: "/user/step"
	})
}

function register(data) {
	return http({
		method: "POST",
		data: data,
		// url: "http://39.107.233.206:8000/login"
		url: "/user/register"
	})
}

function inquire(data) {
	return http({
		method: "POST",
		data: data,
		url: "/user/inquire"
	})
}
// function get
export {
	getOpenId,
	getStep,
	register,
	inquire
}
