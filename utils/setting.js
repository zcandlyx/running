let host;
// let host = "https://tianqi.quanquankeji.cn"
if (process.env.NODE_ENV === 'development') {
	// host = "http://192.168.1.31:8000/api"
	host = "https://azhen.work/wx/api"
} else {
	host = "https://azhen.work/wx/api"
}

export {
	host
}
