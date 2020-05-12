import http from "@/utils/request.js"

function nowWeather(data) {
	return http({
		method: "GET",
		data: data,
		url: "s6/weather/now"
	})
}
export {
	nowWeather
}
