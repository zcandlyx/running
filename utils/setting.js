let host;
// let host = "https://tianqi.quanquankeji.cn"
if (process.env.NODE_ENV === 'development') {
	// host = "http://127.0.0.1:8000/api"
	host = "https://azhen.work/wx/api"
} else {
	host = "https://azhen.work/wx/api"
}

export {
	host
}
