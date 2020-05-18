import http from "@/utils/request.js"

function getOpenID(data) {
	return http({
		method: "GET",
		data: data,
		url: "http://39.107.233.206:8000/login"
	})
}
export {
	getOpenID
}
