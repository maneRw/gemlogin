const crypto = require('crypto');
const si = require('systeminformation');
var md5 = require('md5');
const fetch = require('node-fetch');
const {appVersion}=require('./defineLocation');


module.exports.getIdDevice = async () => {
    let cpu = await getCpucore() + await getSystem();
    return md5(cpu).toUpperCase();
}

function getCpucore() {
    return new Promise((resolve) => {
        si.cpu(cb => {
            resolve(cb.cores + cb.model)
        });
    })
}
function getSystem() {
    return new Promise((resolve) => {
        si.system(cb => {
            resolve(cb.uuid)
        });
    })
}

decryptData = (encryptedData, key) => {
    const parts = atob(encryptedData).split('::', 2);
    if (parts.length !== 2) {
        throw new Error('Invalid data format');
    }
    const encryptedText = parts[0];
    const iv = Uint8Array.from(atob(parts[1]), c => c.charCodeAt(0));
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    return JSON.parse(decrypted + decipher.final('utf8'));
}
module.exports.checkLicense = async (data) => {
    try {
        let headers = {
            "Authorization": `Bearer ${data.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        const params = new URLSearchParams()
        params.append('device_code', data.deviceId)
        params.append('app_id', '1');
        let base_url="https://app.gemlogin.vn";
        if(appVersion.location=="Thai"){
            base_url="https://app.gemlogin.io";

        }
        let response = await fetch(`${base_url}/api/checkLicense`, { method: 'post', headers: headers, body: params });
        let result = await response.json();
       
        if (result.success) {
            let dataDecode = decryptData(result.data, data.deviceId);
            result.data = dataDecode;
            return result;
        }
        else {
            return result;
        }
    } catch (error) {
        return { success: false, message: "error " }
    }


}

