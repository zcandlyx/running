import http from "@/utils/request.js"

function getBg(data) {
	return http({
		method: "GET",
		data: data,
		url: "/material"
		// url: "http://127.0.0.1:8000/api/user/getKey"
	})
}

function changeBg(data){
	return http({
		method: "POST",
		data: data,
		url: "/user/changeBackground"
		// url: "http://127.0.0.1:8000/api/user/getKey"
	})
}

export{
	getBg,
	changeBg
}


