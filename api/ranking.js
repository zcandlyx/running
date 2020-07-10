import http from "@/utils/request.js"

function click(data) {
	return http({
		method: "POST",
		data: data,
		url: "/like/click"
		// url: "http://127.0.0.1:8000/api/user/getKey"
	})
}

function sick(data) {
	return http({
		method: "POST",
		data: data,
		url: "/like/sick"
		// url: "http://127.0.0.1:8000/api/user/getKey"
	})
}

function like(data) {
	return http({
		method: "POST",
		data: data,
		url: "/like/click"
		// url: "http://127.0.0.1:8000/api/user/getKey"
	})
}

export {
	click,
	sick,
	like
}
