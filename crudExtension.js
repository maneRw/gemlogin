const chromeStoreApi = require('chrome-extension-meta');
const fetch = require('node-fetch');
const unzip = require("unzip-crx");
const fs = require('fs');
const fsext = require('fs-extra');
const { getExtensionID } = require('./getExtensionID');
var AdmZip = require("adm-zip");
module.exports.crudExtension = async (data, pathRoot) => {

  let extensions = fs.readFileSync(`${pathRoot}\\extensions\\extension.json`, 'utf-8');

  extensions = JSON.parse(extensions);
  try {
    switch (data.action) {
      case "getAll": {
        return extensions;
      }
      case "delete": {
        let indexExtension = extensions.findIndex(c => c.id == data.id);
        let dirPath = extensions[indexExtension].path;
        const parts = dirPath.split('\\');
        // Lấy phần tử cuối cùng trong mảng
        const folderName = parts[parts.length - 1];

        extensions.splice(indexExtension, 1);
        fs.writeFileSync(`${pathRoot}\\extensions\\extension.json`, JSON.stringify(extensions), 'utf-8');
        let extensionPath = `${pathRoot}\\extensions\\${folderName}`;
        if (fs.existsSync(extensionPath)) fs.rmSync(extensionPath, { recursive: true, force: true })
        return extensions;
      };
      case "update": {
        let p = extensions.find(c => c.id == data.id);
        if (p) {
          p.disabled = data.disabled;
          fs.writeFileSync(`${pathRoot}\\extensions\\extension.json`, JSON.stringify(extensions), 'utf-8');
          //  console.log(extensions)
          return extensions;
        }
        return extensions;

      };
      case "upload": {

        let pathExtension = `${pathRoot}\\extensions\\${data.extensionData.extensionName}`;
        let imageAsBase64 = "data:image/png;base64,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";
        let description = data.extensionData.descripttion;
        if (data.extensionData.extensionPath.endsWith(".zip")) {
          //fsext.copySync(data.extensionData.extensionPath,pathExtension,{overwrite :true});
          const zip = new AdmZip(data.extensionData.extensionPath);
          zip.extractAllTo(pathExtension, true);
          await new Promise(r => setTimeout(r, 1000));
          let manifestPath = pathExtension + "\\manifest.json";
          if (fs.existsSync(manifestPath)) {
            let manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            let iconPath = manifestContent.icons[128].startsWith('/') ? `${pathExtension}${manifestContent.icons[128]}` : `${pathExtension}\\${manifestContent.icons[128]}`;
            if (!description) description = manifestContent?.description || "Custom extension upload";
            if (fs.existsSync(iconPath)) imageAsBase64 = "data:image/png;base64," + fs.readFileSync(iconPath, 'base64');
          }
          let idExtension = await getExtensionID(pathExtension, pathRoot);

          const id = idExtension;
          let extensionExist = extensions.find(c => c.id == id);
          if (!extensionExist) {
            extensions.push(
              {
                id: id,
                icon: imageAsBase64,
                name: data.extensionData.extensionName,
                path: pathExtension,
                description: description,
                disabled: false,
                deletable: true
              });
          }
        } else if (data.extensionData.extensionPath.endsWith(".crx")) {

          //fsext.copySync(data.extensionData.extensionPath,pathExtension,{overwrite :true});

          unzip(data.extensionData.extensionPath, pathExtension);
          await new Promise(r => setTimeout(r, 2000));
          let manifestPath = pathExtension + "\\manifest.json";
          if (fs.existsSync(manifestPath)) {
            let manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

            let iconPath = manifestContent.icons[128].startsWith('/') ? `${pathExtension}${manifestContent.icons[128]}` : `${pathExtension}\\${manifestContent.icons[128]}`;
            if (!description) description = manifestContent?.description || "Custom extension upload";
            if (fs.existsSync(iconPath)) imageAsBase64 = "data:image/png;base64," + fs.readFileSync(iconPath, 'base64');

          }

          let idExtension = await getExtensionID(pathExtension, pathRoot);

          const id = idExtension;
          let extensionExist = extensions.find(c => c.id == id);
          if (!extensionExist) {
            extensions.push(
              {
                id: id,
                icon: imageAsBase64,
                name: data.extensionData.extensionName,
                path: pathExtension,
                description: description,
                disabled: false,
                deletable: true
              });
          }

        }

        fs.writeFileSync(`${pathRoot}\\extensions\\extension.json`, JSON.stringify(extensions), 'utf-8');
        return extensions;

      }
    }
  }
  catch (err) {
    console.log(err)
    return extensions;
  }
}

