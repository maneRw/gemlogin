const chromeStoreApi = require('chrome-extension-meta');
const fetch = require('node-fetch');
let download = require('./download');
const fs = require('fs');
const { getExtensionID } = require('./getExtensionID');

module.exports.installExtension = async function (pathRoot, data, mainWindow) {

    try {
        let startIndex = data.url.lastIndexOf('/');
        let endIndex = data.url.indexOf('?');
        let id = "";
        if (endIndex > -1) {
            id = data.url.substring(startIndex + 1, endIndex);
        }
        else {
            id = data.url.substring(startIndex + 1);
        }
        let extensions = fs.readFileSync(`${pathRoot}\\extensions\\extension.json`, 'utf-8');
        extensions = JSON.parse(extensions);


        let url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=125.0.0.0&x=id%3D${id}%26installsource%3Dondemand%26uc&nacl_arch=x86-64&acceptformat=crx2,crx3`;
        let pathSave = `${pathRoot}\\extensions\\${id}`
        await download.DownloadFile(url, pathSave, `${id}.crx`, mainWindow, "");
        await new Promise(r => setTimeout(r, 2000));
        // Lấy ID extension sau khi tải xuống
        const extensionID = await getExtensionID(`${pathSave}\\${id}`, pathRoot);

        const detail = await chromeStoreApi.getExtMeta(id);
        const imageUrlData = await fetch(detail.iconUrl);
        const buffer = await imageUrlData.arrayBuffer();
        const stringifiedBuffer = Buffer.from(buffer).toString('base64');
        const contentType = imageUrlData.headers.get('content-type');
        const imageBase64 = `data:${contentType};base64,${stringifiedBuffer}`;
        let detailSave = {
            id: extensionID,
            deletable: true,
            disabled: true,
            name: detail.name,
            description: detail.description,
            path: `${pathSave}\\${id}`,
            icon: imageBase64,
            url: detail.url,
            pinned: false
        }
        let extensionExist = extensions.find(c => c.id == extensionID);
        if (!extensionExist) {
            extensions.push(detailSave);
        }
        else{
            extensionExist=detailSave;
        }
        fs.writeFileSync(`${pathRoot}\\extensions\\extension.json`, JSON.stringify(extensions), 'utf-8')

        return { success: true, message: "success", data: extensions };

    } catch (error) {
        console.log(error)
        throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi hàm này
    }
}