import CryptoJS from 'crypto-js'
import { Base64 } from 'js-base64'

class Decode {
	appId
	sessionKey

	constructor(appId, sessionKey) {
		this.appId = appId
		this.sessionKey = sessionKey
	}

	decryptData(data, ivv) {
		let key = CryptoJS.enc.Base64.parse(this.sessionKey)
		let iv = CryptoJS.enc.Base64.parse(ivv)
		let decrypt = CryptoJS.AES.decrypt(data, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		})
		return JSON.parse(Base64.decode(CryptoJS.enc.Base64.stringify(decrypt)))
	}
}
export default Decode
