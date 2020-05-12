import {host} from './setting.js'

function http(config) {

	// 返回了promise 

	return new Promise((resolve, reject) => {

		var setting = {

			header: {

				// 'custom-header': 'hello' //自定义请求头信息 

				'content-type': 'application/json'

			},

			dataType: 'json',

			timeout: 60000,

			success: (res) => {

				//成功 如果是ajax会返回文本类型,但这里会默认对结果进行JSON.parse 

				resolve(res.data);

			},

			fail: (err) => {

				reject(err);

			}

		}

		// 合并config配置到默认setting中 

		setting = Object.assign(setting, config);

		// 修改url localhost/api/xxx..x. 后台cors处理 
		console.log(host)
		setting.url = host + setting.url;

		// 发送请求 

		uni.request(setting);

	})



}

export default http;
