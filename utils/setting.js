let host;
// let host = "https://tianqi.quanquankeji.cn"
if (process.env.NODE_ENV === 'development') {
	host = "http://127.0.0.1:8000/api"
} else {
	host = "http://happly.gq:8000/api"
}

export {
	host
}
