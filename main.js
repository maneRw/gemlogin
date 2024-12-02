const { app, BrowserWindow, session, ipcMain, dialog, shell, screen } = require('electron');
const path = require('path');
const process = require('process');
const fs = require('fs');
const fsext = require('fs-extra');
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { Sequelize, Op } = require('sequelize');
const { faker } = require('@faker-js/faker');
const parser = require('ua-parser-js');
//
const https = require("https");
const http = require("http");
//
const { handelrActionFile } = require('./blocksHandler/handlerActionFile');
const { handelrImapReadMail } = require('./blocksHandler/handlerImap');
const { handlerKeyBoard } = require('./blocksHandler/handlerKeyBoard');
const { handlerMouseClick } = require('./blocksHandler/handlerMouseClick');
const { installMouseHelper } = require('./blocksHandler/mousehelper');
const { handlerMouseScroll } = require('./blocksHandler/handlerMouseScroll');
const { handlerMouseHover } = require('./blocksHandler/handlerMouseHover');
const { handlerMouseMove } = require('./blocksHandler/handlerMouseMove');
const { handlerCloseTab } = require('./blocksHandler/handlerCloseTab');
const { handlerSwitchFrame } = require('./blocksHandler/handlerSwitchFrame');
const { handlerAttributeValue } = require('./blocksHandler/handlerAttributeValue');
const { handlerPageTab } = require('./blocksHandler/handlerPageTab');
const { handlerTabUrl } = require('./blocksHandler/handlerTabUrl');
const { handlerGetText } = require('./blocksHandler/handlerGetText');
const { handlerInputText } = require('./blocksHandler/handlerInputText');
const { handlerCreateElement } = require('./blocksHandler/handlerCreateElement');
const { handlerLink } = require('./blocksHandler/handlerLink');
const { handlerTakeScreen } = require('./blocksHandler/handlerTakeScreen');
const { clearCache } = require('./clearCache');
const { handlerElementExists } = require('./blocksHandler/handlerElementExists');
const { handlerImageSearch } = require('./blocksHandler/handelerImageSearch');
const { handleSwitchTab } = require('./blocksHandler/handleSwitchTab');
const { handlerOpenUrl } = require('./blocksHandler/handlerOpenUrl');
const { handlerJavascriptCode } = require('./blocksHandler/handlerJavascriptCode');
const { handlerCookie } = require('./blocksHandler/handlerCookie');
const { handlerConditions } = require('./blocksHandler/handlerConditions');
const { importBackup } = require('./importBackup');
const { handlerReadFileText } = require('./blocksHandler/handlerReadFileText');
const { handlerVerifySelector } = require('./blocksHandler/handlerVerifySelector')
const { handlerUpload } = require('./blocksHandler/handlerUpload');
const { getExtensionID } = require('./getExtensionID')
const unzip = require("unzip-crx");
const { Window } = require('win-control');
const { handlerRandom } = require('./blocksHandler/handlerRandom');
const { handlerCmd } = require('./blocksHandler/handlerCmd');
const { handlerEmulateDevice } = require('./blocksHandler/handlerEmulateDevice');
const { handlerSpreadSheet } = require('./handlerSpreadSheet');
const { createBackup } = require('./backup');
const { handlerSwitchExtensionPopup } = require('./blocksHandler/handlerSwitchExtension');
const { previewData } = require('./previewInsertData')
const { saveData, getData } = require('./actionDatajson')
var listProfile = [];

const templatPath = path.join(process.resourcesPath, "..\\bin\\template.xlsx")
const pathWeb = path.join(process.resourcesPath, "..\\bin\\build");
// const pathWeb = path.join(process.resourcesPath, "..\\..\\build");
// const pathPreload = path.join(process.resourcesPath, 'bin\\preload.js');
// const pathToExtension = path.join(__dirname, "auto");

// const pathWeb = path.join("D:\\Electron\\auto", "build");
// const templatPath = path.join(__dirname, "template.xlsx")

const { randomUA, fingerHelper, randomOs } = require('./fingeHelper');
const pathPreload = path.join(__dirname, 'preload.js');
const osPaths = require('os-paths/cjs');
const pathRoot = osPaths.home() + "\\.gemlogin";
const chromePaths = pathRoot + "\\browser";
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: pathRoot + '\\db.db',
  username: "gemlogin",
  password: "dKlM@4r%",
  logging: false
});

const Profiles = require(__dirname + '/profile').Profiles(sequelize);
const Scripts = require(__dirname + '/script').Scripts(sequelize);
const Location = require(__dirname + '/location').Location(sequelize);
//const Proxy = require(__dirname + "/proxy").Proxy(sequelize);
const groupProfiles = require(__dirname + '/grouprofiles').groupProfiles(sequelize);
const platForm = require(__dirname + '/platform').Platform(sequelize);
const configProfile = require(__dirname + '/configprofile').Config_profile(sequelize);

const { connect } = require('puppeteer-real-browser');
const puppeteer = require('puppeteer-core');
let download = require('./download');
const creatConfig = require('./create_config');

const license = require('./license');
let deviceValid;
let deviceCode;

let virtualMouse;

var splashWindow = null;
var mainWindow = null;
var isUpdate = false;
//api Server
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml')
const { WebSocketServer } = require('ws');
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const appExpress = express()
const port = 1010;
let profilePath;
appExpress.use(cors());
appExpress.use(bodyParser.json());
const args = [
  '--no-sandbox',
  "--disable-infobars",
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-crash-restore-bubble',
  '--enable-save-password-bubble',
  '--password-store=basic',
  '--disable-popup-blocking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-background-networking',
  '--disable-bundled-ppapi-flash',
  '--disable-client-side-phishing-detection',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--disable-hang-monitor',
  '--disable-prompt-on-repost'
  // '--restore-last-session'

  // '--no-crashpad',
  // '--disable-crashpad',
  // '--metrics-recording-only',
  // '--disable-features=FlashDeprecationWarning,EnablePasswordsAccountStorage,CalculateNativeWinOcclusion,OptimizationHints,AcceleratedVideoDecode,ChromeLabs,ReadLater,ChromeWhatsNewUI,TrackingProtection3pcd',
  // '--disable-crash-reporter',
  // '--disable-background-mode',
  // '--disable-timer-throttling',
  // '--disable-render-backgrounding',
  // '--disable-background-media-suspend',
  // '--disable-external-intent-requests',
  // '--disable-ipc-flooding-protection',
  // '--disable-field-trial-config',
  // '--enable-unsafe-webgpu',
  // '--lang=vi'
]

// '--disable-3d-apis',
// "--disable-notifications",

const mode = "dev";

async function createWindow() {
  session.defaultSession.loadExtension(pathWeb).then((data) => {
    mainWindow.loadURL(data.url + "/newtab.html#");
  })
  createSplashWindow();
  // let checkRun = await isRunning("gemLogin.exe");
  // if (checkRun) {
  //   exec(`taskkill /im gemLogin.exe /f`, (err, stdout, stderr) => {
  //   })
  // }

  mainWindow = new BrowserWindow({
    width: 1500,
    minWidth: 1500,
    height: 800,
    minHeight: 800,
    backgroundColor: "#ccc",
    icon: __dirname + "/logo.png",
    backgroundColor: '#EEEEEE',
    // transparent: true,
    backgroundColor: '#EEEEEE',
    frame: true,
    show: false,
    center: true,
    webPreferences: {
      //  nodeIntegration: false, //
      contextIsolation: true, //
      preload: pathPreload
    }
  });


  Profiles.update({ status: 1 }, { where: { id: { [Op.not]: null } } });
  mainWindow.removeMenu();
  // mainWindow.webContents.openDevTools();

  //mainWindow.maximize();

  mainWindow.webContents.on('did-fail-load',
    function (event, errorCode, errorDescription) {
      setTimeout(function () {
        mainWindow.webContents.reload();
      }, 350);
    }
  );

  mainWindow.webContents.on('did-finish-load', function () {
    if (splashWindow !== null) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
  });

  mainWindow.on('close', function (e) {
    if (!isUpdate) {
      let response = dialog.showMessageBoxSync(this, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm closing app',
        message: 'Are you sure you want to quit?'
      });

      if (response == 1) {
        e.preventDefault();
      }
    }
  });

  ipcMain.handle("checkLicense", async (event, data) => {
    try {
      data = JSON.parse(data);
      if (!deviceCode) {
        deviceCode = await license.getIdDevice();
      }

      if (data.userPackage == 'freemium') {
        deviceValid = { success: true, data: {}, message: "success", id: "Free" }
        deviceValid.data.expires_at = null;
        deviceValid.data.profile_limit = 10;
        deviceValid.data.status = "Active";
        deviceValid.data.deviceId = deviceCode;
        return deviceValid;
      }
      else {
        data.deviceId = deviceCode;
        deviceValid = await license.checkLicense(data);
        return deviceValid;
      }
    } catch (error) {

      writelog(error);
      return { success: false, message: error }
    }
  });
  ipcMain.handle("previewImage", async (event, data) => {
    if (data.mode == 'Path') {
      if (!fs.existsSync(data.inputBase64)) return "";
      return `data:image/png;base64,${fs.readFileSync(data.inputBase64, { encoding: 'base64' })}`;
    }
    else {
      if (data.inputBase64.indexOf('data:image/png;base64,') == -1) {
        return `data:image/png;base64,${data.inputBase64}`
      }
      else return data.inputBase64;
    }
  });

  ipcMain.handle("downloadTemplate", async (event, data) => {
    try {
      data = JSON.parse(data);
      let pathSave = data.path + "\\template.xlsx";
      fsext.copySync(templatPath, pathSave, { overwrite: true });
      exec(pathSave, () => { })
      return { success: true, message: "success" };
    } catch (error) {

      return { success: false, message: error }
    }
  });
  ipcMain.handle('quitAndInstall', () => {
    try {
      if (fs.existsSync(`${pathRoot}\\update\\setup.exe`)) {
        exec(`setup.exe`, { cwd: `${pathRoot}\\update` }, (err, stdout, stderr) => {
          console.log(err);
        });
        setTimeout(() => {
          isUpdate = true;
          exec(`taskkill /im GemLogin.exe /f`, (err, stdout, stderr) => { })
          exec(`taskkill /im gemLogin.exe /f`, (err, stdout, stderr) => { })
          app.quit();
        }, 2000);
      }
    } catch (error) {
    }
  });


  ipcMain.handle('crudScript', async (event, data) => {
    data = JSON.parse(data);
    switch (data.action) {
      case "getAll": {
        let result = await Scripts.findAll({ raw: true });
        result = result.reduce((acc, current) => {
          acc[current.id] = JSON.parse(current.script);

          return acc;
        }, {})

        return result;
      }; break;
      case "create": {
        return await Scripts.create({ id: data.script.id, name: data.script.name, description: data.script.description, version: data.script.version, script: JSON.stringify(data.script) });
      }; break;
      case "update": {
        return await Scripts.update({ id: data.script.id, name: data.script.name, description: data.script.description, version: data.script.version, script: JSON.stringify(data.script) }, { where: { id: data.script.id } })
      };
      case "delete": {
        return await Scripts.destroy({ where: { id: data.id } })
      };
    }
  });
  ipcMain.handle('getIdDevice', async (event, data) => {
    if (!deviceCode) {
      deviceCode = await license.getIdDevice();
    }
    return deviceCode;
  });
  ipcMain.handle("getHomePath", (event, data) => {
    return { path: pathRoot };
  })
  ipcMain.handle("initLaucher", async () => {
    {
      await Profiles.sync();
      await Scripts.sync();
      await groupProfiles.sync();
      await Location.sync();
      await configProfile.sync();
      await platForm.sync();
      initLaucher();
    }
  })
  ipcMain.handle("getProfile", async (event, data) => {
    console.log("getProfile =>", data, deviceValid);

    let result;
    if (data.userPackage == 'professional') {
      if (deviceValid?.data?.valid) {
        if (!deviceValid?.data?.default) {
          if (deviceValid?.data?.device_code != deviceCode) {
            return { success: true, message: "success", data: [] }
          }
        }
        if (deviceValid?.data?.profile_limit == -1) {
          result = await sequelize.query(`select p.*,g.name group_name from profiles p left join profile_groups g on p.profile_group_id=g.id`, { raw: true });
        }
        else {
          let profile_limit = deviceValid?.data?.profile_limit;
          let query = `select p.*,g.name group_name from profiles p left join profile_groups g on p.profile_group_id=g.id limit ${profile_limit}`
          result = await sequelize.query(query, { raw: true });
        }
      }
    }
    else {
      result = await sequelize.query(`select p.*,g.name group_name from profiles p left join profile_groups g on p.profile_group_id=g.id limit 10`, { raw: true });
    }

    if (!result || !Array.isArray(result)) {
      return { success: false, message: "error" }
    }

    return { success: true, message: "success", data: result[0] }

  });

  //
  ipcMain.on("startUpdate", (event, data) => {
    data = JSON.parse(data);
    download.DownloadFile(data.url, pathRoot + "\\update", "setup.exe", mainWindow, "onUpdate")
  })
  ipcMain.on("openLink", (event, data) => {
    shell.openExternal(data);
  })
  ipcMain.on("getProfilePath", (event, data) => {
    profilePath = data.path;
  })
  ipcMain.handle("getLocation", (event, data) => {
    const { appVersion } = require('./defineLocation');
    return appVersion;
  })
  ipcMain.handle("excelManage", async (event, data) => {
    console.log("excelManage =>", data);

    const excelhandle = require('./excelhandle');
    return await excelhandle.excelhandle(data);
  })
  ipcMain.handle("googleSheet", async (event, data) => {
    console.log("data google sheet =>", data);
    return await handlerSpreadSheet(data.type, data.params);
  })

  ipcMain.handle("clearCache", async (event, data) => {
    try {
      const { pathSave, ids } = data;
      for (const profileId of ids) {
        let p = listProfile.find(c => c.id == profileId);
        if (p && p.browser.isConnected()) {
          await p.browser.close();
          Profiles.update({ status: '1' }, { where: { id: profileId } })
        }
      }
      clearCache(`${pathSave}\\profiles`, ids);

      //session.defaultSession.clearCache();
      return { success: true, message: "success" };
    }
    catch (ex) {
      return { success: false, message: ex.message };
    }

  })

  ipcMain.handle("sortBrowser", async (event, data) => {
    try {
      const { width, height, cols, rows } = data;
      const screenWidth = width;
      const screenHeight = height;

      const windowWidth = Math.floor(screenWidth / cols);
      const windowHeight = Math.floor(screenHeight / rows);
      // Lấy danh sách process IDs từ listProfile
      const processIds = listProfile.map((profile) => profile.chromeId);


      for (const pid of processIds) {
        const win = Window.getByPid(pid);

        if (win) {
          let index = processIds.indexOf(pid);
          let x = (index % cols) * windowWidth;
          let y = Math.floor((index % (rows * cols)) / cols) * windowHeight;

          // Ensure the window doesn't go beyond screen boundaries
          x = Math.min(x, screenWidth - windowWidth);
          y = Math.min(y, screenHeight - windowHeight);

          win.setPosition(0, x, y, windowWidth, windowHeight, 0);
        }
      }
      return { success: true, message: "success" };
    } catch (error) {
      return { success: false, message: error.message }
    }

  })

  ipcMain.handle("replaceConfig", async (event, data) => {

    saveData(pathRoot, { "version": data });
    // Lấy tất cả các hồ sơ
    let profiles = await Profiles.findAll();

    // Sử dụng for...of để xử lý không đồng bộ đúng cách
    for (const profile of profiles) {
      let profileData = JSON.parse(profile.profile_data);

      // Cập nhật phiên bản trình duyệt và user_agent
      profileData.browser.version = data;
      profileData.user_agent = profileData.user_agent.replace(/Chrome\/\d+\.\d+\.\d+\.\d+/, `Chrome/${data}.0.0.0`);

      // Cập nhật hồ sơ trong cơ sở dữ liệu
      await profile.update({
        version: data,
        profile_data: JSON.stringify(profileData)
      });

      // Tạo cấu hình mới
      await creatConfig.creatConfig(profileData, profilePath, profile.id);
    }
  });

  ipcMain.handle("checkIpService", async (event, data) => {
    data = JSON.parse(data);
    console.log("checkIpService =>", data);

    let result = await creatConfig.getInfoIp(data.proxy, data.location);
    console.log("result =>", result);

    if (result.status == "success") {
      return { success: true, data: result, message: "success" }
    }
    else {
      return { success: false, message: "Proxy faile!" }
    }
  })

  ipcMain.handle("installExtension", async (event, data) => {
    try {
      data = JSON.parse(data);
      let installExtension = require('./download_extension');
      return await installExtension.installExtension(pathRoot, data, mainWindow);
    }
    catch (ex) {
      writelog(ex);
      return ({ success: false, message: ex })
    }

  });

  ipcMain.handle("searchExtension", async (event, data) => {
    data = JSON.parse(data);
    const chromeStoreApi = require('chrome-extension-meta');
    const results = await chromeStoreApi.fullSearch(data.text);
    return results.data;
  });

  ipcMain.handle("getListScreen", (event, data) => {
    const displays = screen.getAllDisplays();

    let screens = displays.map(item => {
      return {
        size: item.size,
        internal: item.internal,
        scaleFactor: item.scaleFactor
      }
    })

    return screens;

  })

  // create update extension
  ipcMain.handle("crudExtension", async (event, data) => {
    try {
      data = JSON.parse(data);
      return await require('./crudExtension').crudExtension(data, pathRoot);
    } catch (error) {
      console.log(error)
      writelog(error.toString())
    }

  });

  //create update config profile
  ipcMain.handle("crudConfigProfile", async (event, data) => {
    data = JSON.parse(data);
    switch (data.action) {
      case "getAll": {
        try {
          return await configProfile.findAll({ raw: true });
        }
        catch (ex) {
          return { message: "error" }
        }
      };
      case "create": {
        try {
          await configProfile.create({ name: data.configData.name, config_profile: JSON.stringify(data.configData.config_profile) })
          return { success: true, message: "success" };
        }
        catch (ex) {
          return { success: false, message: ex }
        }
      };
      case "update": {
        try {
          await configProfile.update({ name: data.groupData }, { where: { id: data.configId } });
          return { success: true, message: "success" };
        }
        catch (ex) {
          return { success: false, message: ex }
        }
      };
      case "delete": {
        try {
          await configProfile.destroy({ where: { id: data.configId } })
          return { success: true, message: "success" };
        }
        catch (ex) {
          return { success: false, message: ex }
        }
      };
    }
  });
  //create update group
  ipcMain.handle("crudGroup", async (event, data) => {
    data = JSON.parse(data);
    switch (data.action) {
      case "getAll": {
        try {
          return await groupProfiles.findAll({ raw: true });
        }
        catch (ex) {
          return { message: "error" }
        }
      };
      case "getProfilesGroup": {
        try {
          let result = await Profiles.findAll({ raw: true, where: { profile_group_id: data.groupId } });
          return result;
        }
        catch (ex) {
          return { message: "error" }
        }
      }
      case "create": {
        try {
          await groupProfiles.create({ name: data.groupData })
          return { message: "success" };
        }
        catch (ex) {
          return { message: "error" }
        }
      };
      case "update": {
        try {
          await groupProfiles.update({ name: data.groupData }, { where: { id: data.groupId } });
          return { message: "success" };
        }
        catch (ex) {
          return { message: "error" }
        }
      };
      case "delete": {
        try {
          await groupProfiles.destroy({ where: { id: data.groupId } })
          return { message: "success" };
        }
        catch (ex) {
          return { message: "error" }
        }
      };
      case "assignProfilesGroup": {
        try {
          await Profiles.update({ profile_group_id: data.groupId }, { where: { id: { [Op.in]: data.profiles } } });
          return { message: "success" };
        }
        catch (ex) {
          return { message: "error" }
        }

      }
    }
  });
  //platform resource
  ipcMain.handle("crudPlatform", async (event, data) => {
    data = JSON.parse(data);
    switch (data.action) {
      case "getAll": {
        try {
          let result = await platForm.findAll({ raw: true });
          return result;
        }
        catch (ex) {
          return { message: "error" }
        }
      };
      case "create": {
        try {
          await platForm.create({ name: data.name, icon: data.icon })
          return { message: "success" };
        }
        catch (ex) {
          return { message: "error" }
        }
      };
    }
  });
  //proxy
  ipcMain.handle("crudProxy", async (event, data) => {

    data = JSON.parse(data);
    switch (data.action) {
      // case "getAll": {
      //   return await Proxy.findAll({ raw: true });
      // };
      // case "create": {
      //   let lstProxy = data.proxyData.split("\n").filter(i => i);
      //   lstProxy = lstProxy.map(c => {

      //     let proxy = c.split(":");
      //     const ip = proxy[1].substring(2);
      //     const port = proxy[2];
      //     return {
      //       name: `${ip}:${port}`,
      //       type: "Imported",
      //       protocol: proxy[0].toUpperCase(),
      //       capacity: "Không giới hạn",
      //       user_name: proxy[3],
      //       password: proxy[4],
      //       payment_status: "DONE",
      //       tags: data.tags.toString()
      //     }

      //   })
      //   await Proxy.bulkCreate(lstProxy)
      //   return { message: "success" }
      // };
      // case "update": {
      //   await Proxy.update({ name: `${data.proxyData.host}:${data.proxyData.port}`, protocol: data.proxyData.protocol, user_name: data.proxyData.user_name, password: data.proxyData.password, tags: data.proxyData.tags.toString() }, { where: { id: data.proxyId } });
      //   return { message: "success" }
      // };
      // case "delete": {
      //   // console.log(data.ids)
      //   await Proxy.destroy({ where: { id: { [Op.in]: data.ids } } })
      //   return { message: "success" }
      // };
      case "check": {
        // let proxies = (data.proxy || []);
        // const ProxyChecker = require("nodejs-proxy-checkerv2").default;
        // const instance = new ProxyChecker()
        //   .addProxiesFromArray(proxies);
        // await instance.check((result) => {
        //   mainWindow.send("onProxyCheck", { id: result.Proxy, status: result.ProxyStatus, level: result.ProxySpeedLevel })
        // });

        // async function checkProxies(data, callback) {
        //   const proxies = data.proxy || [];
        //   const urls = ["https://api.ipapi.is", "https://ip-score.com/fulljson", "http://ip-api.com/json/", "https://jsonip.com/"];
        //   const results = [];

        //   const promises = proxies.map(async (proxyString) => {
        //     console.log("proxyString =>", proxyString);

        //     // Tách thông tin proxy từ chuỗi
        //     const [type, host, port, user_name, password] = proxyString.split(':');
        //     const proxy = {
        //       host: host.split('//')[1],
        //       port,
        //       user_name,
        //       password,
        //       type
        //     };

        //     let urlProxy = '';

        //     // Xây dựng URL cho proxy
        //     if (proxy?.host && proxy?.port) {
        //       urlProxy = `${proxy.type}://${proxy.host}:${proxy.port}`;
        //     }
        //     if (proxy.user_name?.length && proxy.password?.length) {
        //       urlProxy = `${proxy.type}://${proxy.user_name}:${proxy.password}@${proxy.host}:${proxy.port}`;
        //     }

        //     try {
        //       let response;
        //       // Kiểm tra loại proxy
        //       if (proxy.type === "https" || proxy.type === "http") {
        //         response = await Promise.all(urls.map(async (c) => {
        //           try {
        //             return await fetch(c, { agent: new HttpsProxyAgent(urlProxy) });
        //           } catch (ex) {
        //             return null;
        //           }
        //         }));
        //       } else {
        //         response = await Promise.all(urls.map(async (c) => {
        //           try {
        //             return await fetch(c, { agent: new SocksProxyAgent(urlProxy) });
        //           } catch (ex) {
        //             return null;
        //           }
        //         }));
        //       }

        //       // Kiểm tra phản hồi
        //       for (let i = 0; i < response.length; i++) {
        //         if (response[i] && response[i].status === 200) {
        //           const result = await response[i].json();
        //           results.push({ id: proxyString, status: 'Alive', ip: result.ip || result.query });
        //           return; // Ngừng kiểm tra các URL còn lại nếu đã tìm thấy proxy sống
        //         }
        //       }

        //       // Nếu không có phản hồi thành công
        //       results.push({ id: proxyString, status: 'Dead' });
        //     } catch (error) {
        //       results.push({ id: proxyString, status: 'Dead' });
        //     }
        //   });

        //   // Chờ cho tất cả promise hoàn thành
        //   await Promise.all(promises);

        //   // Gọi callback với tất cả kết quả
        //   callback(results);
        // }

        // // Gọi hàm và xử lý kết quả
        // await checkProxies(data, (results) => {
        //   results.forEach(result => mainWindow.send("onProxyCheck", result));
        // });

        async function checkProxies(data, callback) {
          const proxies = data.proxy || [];
          const urls = ["https://api.ipapi.is", "https://ip-score.com/fulljson", "http://ip-api.com/json/", "https://jsonip.com/"];

          const promises = proxies.map(async (proxyString) => {
            console.log("proxyString =>", proxyString);

            // Tách thông tin proxy từ chuỗi
            const [type, host, port, user_name, password] = proxyString.split(':');
            const proxy = {
              host: host.split('//')[1],
              port,
              user_name,
              password,
              type
            };

            let urlProxy = '';

            // Xây dựng URL cho proxy
            if (proxy?.host && proxy?.port) {
              urlProxy = `${proxy.type}://${proxy.host}:${proxy.port}`;
            }
            if (proxy.user_name?.length && proxy.password?.length) {
              urlProxy = `${proxy.type}://${proxy.user_name}:${proxy.password}@${proxy.host}:${proxy.port}`;
            }

            try {
              let response;
              // Kiểm tra loại proxy
              if (proxy.type === "https" || proxy.type === "http") {
                response = await Promise.all(urls.map(async (c) => {
                  try {
                    return await fetch(c, { agent: new HttpsProxyAgent(urlProxy) });
                  } catch (ex) {
                    return null;
                  }
                }));
              } else {
                response = await Promise.all(urls.map(async (c) => {
                  try {
                    return await fetch(c, { agent: new SocksProxyAgent(urlProxy) });
                  } catch (ex) {
                    return null;
                  }
                }));
              }

              // Kiểm tra phản hồi
              for (let i = 0; i < response.length; i++) {
                if (response[i] && response[i].status === 200) {
                  const result = await response[i].json();
                  // Gọi callback ngay khi kiểm tra xong proxy này
                  callback({ id: proxyString, status: 'Live', ip: result.ip || result.query });
                  return; // Ngừng kiểm tra các URL còn lại nếu đã tìm thấy proxy sống
                }
              }

              // Nếu không có phản hồi thành công
              callback({ id: proxyString, status: 'Die' });
            } catch (error) {
              // Xử lý lỗi và gọi callback với trạng thái "Dead"
              callback({ id: proxyString, status: 'Die' });
            }
          });

          // Chờ cho tất cả promise hoàn thành để kết thúc hàm
          await Promise.all(promises);
        }

        // Gọi hàm và xử lý kết quả
        await checkProxies(data, (result) => {
          mainWindow.send("onProxyCheck", result);
        });

        // proxies.forEach(c => {
        //   const proxySplit = c.name.split(':');
        //   let proxy = {
        //     ipAddress: proxySplit[0],
        //     port: proxySplit[1] * 1,
        //     protocol: c.protocol.toLowerCase()
        //   };
        //   ProxyVerifier.testProtocol(proxy, { waitTimeBetweenAttempts: 10000 }, function (error, result) {
        //     console.log(error);
        //     console.log(result)
        //     if (error) {
        //       mainWindow.send("onProxyCheck", { id: c.id, status: false })
        //     } else {
        //       mainWindow.send("onProxyCheck", { id: c.id, status: result.ok })
        //     }
        //   });

        // })
        return { message: "success" }
      }
    }
  });

  ipcMain.handle('settingProfile', async (event, data) => {
    data = JSON.parse(data);
    let oldDatalocation = data.oldDatalocation + "\\profiles";
    let dataLocation = data.dataLocation + "\\profiles";
    if (data.action === "moveProfiles") {
      try {
        await fsext.move(oldDatalocation, dataLocation, { overwrite: true })
        return { success: true, message: "success" };
      } catch (err) {
        return { success: false, message: err.toString() };
      }
    }
    if (data.action == "copyProfiles") {
      try {
        await fsext.copy(oldDatalocation, dataLocation, { overwrite: true })
        return { success: true, message: "success" };
      } catch (err) {
        return { success: false, message: err.toString() };
      }
    }
    return data;
  })
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })

  ipcMain.on("startDownloadbrowser", (event, data) => {
    let pathSave = `${chromePaths}\\${data.version}`;
    let fileName = `${data.version}.zip`;
    download.DownloadFile(data.url, pathSave, fileName, mainWindow, "downloadBrowser")
  })

  ipcMain.handle("backupProfile", async (event, data) => {
    // Kiểm tra xem đường dẫn data.pathSave có tồn tại không
    if (!fs.existsSync(data.pathSave)) {
      // Nếu không tồn tại, trả về thông báo lỗi
      return { success: false, message: "The storage path does not exist." };
    }
    return await createBackup(`${data.profilePath}\\profiles`, `${data.pathSave}\\backup.zip`, data.ids, Profiles, event);
  })

  ipcMain.handle("uploadBackUp", async (event, data) => {
    return await importBackup(data.files, `${data.profilePath}\\profiles`, Profiles, data.numberProfile, data.profileLimit, event);
  })

  ipcMain.handle('read-file', async (event, data) => {
    console.log("read-file =>", data);

    return previewData(data);
  });

  // await importBackup("C:\\Users\\MY ASUS\\.gemlogin\\profile\\test_bk.zip", "C:\\Users\\MY ASUS\\.gemlogin\\profile\\profiles", Profiles);

  ipcMain.handle('sendData', async (event, data) => {
    console.log("data =>", data);
    try {
      if (data?.preview) {
        if (data.type == "random") {
          return handlerRandom({
            language: data.param.language,
            options: data.param.categories,
            type: data.param.type,
            command: data.param.command,
            fromNumber: +data.param.fromNumber,
            toNumber: +data.param.toNumber
          })
        }

        if (data.type == "readFileText") {
          return handlerReadFileText(data.param);
        }
      }

      let profile = listProfile.find(c => c.id == data.profileId);

      if (profile) {
        if (profile.browser.isConnected()) {
          let page = profile.page;
          if (!profile.isFrame) {
            if (page?.isClosed()) {
              let pages = await profile.browser.pages();
              if (pages.length - 1 < profile.pageIndex) {
                profile.pageIndex = 0;
                page = pages[0];
              }
              else {
                page = pages[profile.pageIndex];
              }
              profile.page = page;
            }
          }

          switch (data.type) {
            case "httpRequest": {
              let { url, payload, responseType } = data.param;
              const { headers, method, body = {} } = payload;
              let agent;
              if (url.startsWith("https")) {
                agent = new https.Agent({
                  rejectUnauthorized: false,
                });
              }
              else {
                agent = new http.Agent({
                  rejectUnauthorized: false,
                });
              }

              let response;
              if (method === "GET" || method === "HEAD") {
                response = await fetch(url, { headers, method, agent });
              }
              else {
                response = await fetch(url, { headers, method, body, agent });
              }
              const { status, statusText, redirected, ok } = response;
              let returnData = '';
              if (responseType === 'json') {
                const jsonRes = await response.json();
                returnData = jsonRes;
              } else if (responseType === 'base64') {
                const base64 = (await response.buffer()).toString('base64');
                returnData = base64;
              } else {
                returnData = await response.text();
              }
              return { success: true, message: "success", data: { status, statusText, redirected, ok, returnData } }
            }
            case "VerifySelector": {
              return await handlerVerifySelector(profile.iframe, page, data.param);
            };

            case "uploadFile": {
              return await handlerUpload(profile.iframe, page, data.param);
            };

            case "googleSheet": {
              return await handlerSpreadSheet();
            }

            case "openUrl": {

              let browser = profile.browser;
              let pageIndex = profile.pageIndex;
              if (!virtualMouse) {
                await installMouseHelper(profile.page);
              }
              let result = await handlerOpenUrl({ page, data, browser, pageIndex });
              profile.iframe = null;
              profile.page = result.page;
              profile.pageIndex = result.pageIndex;
              return { success: result.success, message: result.message };
            };

            case "inforTabs": {
              try {
                const tabs = await profile.browser.pages();
                const tabsInfo = await Promise.all(tabs.map(async (tab, index) => ({
                  index: index,
                  title: await tab.title(), // Đảm bảo chờ giá trị tiêu đề
                  pattern: tab.url(),
                  isActive: tab === profile.page // Kiểm tra nếu tab hiện tại đang hoạt động
                })));

                return { success: true, data: tabsInfo };
              } catch (error) {
                return { success: false, message: error.message }; // Trả về thông báo lỗi
              }
            }

            case "readFileText": {
              return handlerReadFileText(data.param);
            }

            case "switchExtensionPopup": {
              console.log("switchExtensionPopup", data);
              let {
                extensionPopupBy,
                switchPage,
                selectorType,
                selector,
                timeOut,
                passwordSelector,
                password,
                selectorSubmitClick,
              } = data.param.options

              return await handlerSwitchExtensionPopup(page, extensionPopupBy, switchPage, selectorType, selector, timeOut, passwordSelector, password, selectorSubmitClick);
            }

            case "emulate": {
              return await handlerEmulateDevice(page, data.param.model);
            }

            case "imageSearch": {
              return handlerImageSearch(page, data.param, pathRoot);
            };

            case "command": {
              let result = await handlerCmd(data.param.command, data.param.assignVariable, data.param.regex);
              return result;
            }

            case "switchTab": {
              let browser = profile.browser;
              let pageIndex = profile.pageIndex;
              let result = await handleSwitchTab({ page, data, browser, pageIndex });
              if (result.pageIndex != pageIndex) profile.iframe = null;
              profile.page = result.page;
              profile.pageIndex = result.pageIndex;
              if (!virtualMouse) {
                await installMouseHelper(profile.page);
              }
              console.log("switchTab =>", result);
              
              return { success: result.success, message: result.message };
            }

            case "fileAction": {
              let { filePath, action, inputData, delimiter, selectorType, writeMode, appendMode, deleteFileFolder } = data.param.options
              return handelrActionFile(action, filePath, inputData, selectorType, writeMode,
                appendMode, delimiter
              )
            }

            case "imapReadMail": {
              const options = {
                isUnreadMails: data.param.isUnreadMails,
                isMark: data.param.isMark,
                isGetLatest: data.param.isGetLatest,
                includesFrom: data.param.includesFrom,
                includesTo: data.param.includesTo,
                includesSubject: data.param.includesSubject,
                includesBody: data.param.includesBody,
                readEmailMinute: data.param.readEmailMinute,
                flags: { isGlobal: data.param.isGlobal, isCaseInsensitive: data.param.isCaseInsensitive, isMultiline: data.param.isMultiline }
              }

              return await handelrImapReadMail(
                data.param.emailService,
                data.param.email,
                data.param.password,
                data.param.folder,
                options,
                data.param.regex,
                data.param.timeout,
                data.param.imapHost,
                data.param.imapPort,
                data.param.isTLS
              )

            }

            case "getText": {
              const options = { multiple: data.param.multiple, markElement: data.param.markEl, waitForSelector: data.param.waitForSelector, selectorTimeout: data.param.waitSelectorTimeout, includeHtmlTag: data.param.includeTags, useTextContent: data.param.useTextContent }
              let result = await handlerGetText(profile.iframe, page, data.param.findBy, data.param.selector, options, data.param.regex, data.param.prefixText, data.param.suffixText);
              return result;

            }

            case "random": {
              return handlerRandom({
                language: data.param.language,
                options: data.param.categories,
                type: data.param.type,
                command: data.param.command,
                fromNumber: +data.param.fromNumber,
                toNumber: +data.param.toNumber
              })
            }

            case "emulate": {
              return handlerEmulateDevice(page, data.param)
            }

            case "elementExist": {
              let result = await handlerElementExists(profile.iframe, page, data.param.options.findBy, data.param.options.selector, data.param.options.tryCount, data.param.options.timeout)
              return result
            }
            case "conditions": {
              let result = await handlerConditions(profile.iframe, page, data.param);
              return result;
            }

            case "javascript": {
              return await handlerJavascriptCode(profile.iframe, page, data.param, data.args);
            }

            case "cookie": {
              const options = {
                useJsonFormat: data.param.data.useJson,
                json: data.param.data.jsonCode,
                getAllCookies: data.param.data.getAll,
                url: data.param.data.url,
                Name: data.param.data.name,
                value: data.param.data.value,
                Path: data.param.data.path,
                domain: data.param.data.domain,
                expirationDate: data.param.data.expirationDate,
                httpOnly: data.param.data.httpOnly,
                secure: data.param.data.secure,
                sameSite: data.param.data.sameSite,
                typeData: data.param.data.typeData
              }
              return await handlerCookie(page, data.param.data.type, options)
            }

            case "link": {
              const options = { markElement: data.param.markEl, waitForSelector: data.param.waitForSelector, selectorTimeout: data.param.waitSelectorTimeout, openLinkInNewTab: data.param.openInNewTab }
              return await handlerLink(profile.iframe, page, data.param.findBy, data.param.selector, options)
            }

            case "createElement": {
              let editElement = {
                html: data.param.html,
                css: JSON.parse(data.param.css.replace(/'/g, '"').replace(/(\w+)\s*:/g, '"$1":')) || {},
                js: data.param.javascript,
                preloadScript: data.param.preloadScripts
              };
              const options = { waitForSelector: data.param.waitForSelector, selectorTimeout: data.param.waitSelectorTimeout }
              return await handlerCreateElement(profile.iframe, page, data.param.findBy, data.param.selector, options, data.param.insertAt, editElement)
            };

            case "mouseMove": {
              const options = {
                x: data.param.x,
                y: data.param.y,
                waitForSelector: data.param.waitForSelector,
                waitSelectorTimeout: data.param.waitSelectorTimeout,
                markElement: data.param.markEl,
                multiple: data.param.multiple
              }
              return await handlerMouseMove(profile.iframe, page, data.param.findBy, data.param.selector, options)
            };

            case "inputText": {

              const obj = {
                findBy: data.param.findBy,
                selector: data.param.selector,
                value: data.param.value,
                isMultiple: data.param.multiple,
                markElement: data.param.markEl,
                waitForSelector: data.param.waitForSelector,
                selectorTimeout: data.param.waitSelectorTimeout,
                getFormValue: data.param.getValue,
                formType: data.param.type,
                textFieldOptions: {
                  clearFormValue: data.param.clearValue,
                  typingDelay: data.param.delay
                },
                selectOptions: {
                  byValue: data.param.selectOptionBy,
                  clearFormValue: data.param.clearValue,
                  optionPosition: data.param.optionPosition,
                },
                radioOptions: {
                  selected: data.param.selected
                },
                checkboxOptions: {
                  selected: data.param.selected
                }
              }

              return await handlerInputText(profile.iframe, page, obj);
            }
            case "keyBoard": {
              return await handlerKeyBoard(profile.iframe, page, data.param);
            }
            case "mouseClick": {
              const options = {
                x: data.param.x,
                y: data.param.y,
                waitForSelector: data.param.waitForSelector,
                waitSelectorTimeout: data.param.waitSelectorTimeout,
                markElement: data.param.markEl,
                multiple: data.param.multiple,
                clickType: data.param.selectOption
              }

              return await handlerMouseClick(profile.iframe, page, data.param.findBy, data.param.selector, options)
            }

            case "attributeValue": {
              return handlerAttributeValue(profile.iframe, page, data.param)
            }
            case "takeScreen": {
              return handlerTakeScreen(profile.iframe, page, data.param)
            }
            case "mouseScroll": {
              return handlerMouseScroll(profile.iframe, page, data.param);
            }
            case "mouseHover": {
              return handlerMouseHover(profile.iframe, page, data.param)
            }
            case "switchFrame": {
              let browserWSEndpoint = await profile.browser.wsEndpoint();
              let browserOrigin = await puppeteer.connect({
                browserWSEndpoint: browserWSEndpoint,
                defaultViewport: null
              });
              let pageOrigin = (await browserOrigin.pages())[profile.pageIndex];
              let result = await handlerSwitchFrame(profile.iframe, pageOrigin, data.param);
              profile.iframe = result.iframe;
              return { success: result.success, message: result.message }
            };

            case "closeTab": {
              return await handlerCloseTab({ page: page, data: data, browser: profile.browser, pageIndex: profile.pageIndex })
            };
            case "goBack":
            case "goForward":
            case "activeTab":
            case "tabReload": {
              return await handlerPageTab(page, data);
            }
            case "tabUrl": {
              return await handlerTabUrl(profile.browser, page, data.param);
            }
            case "tabLoaded": {
              await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
              return { success: true, message: "success" }
            }
            case "tabSendMessage": {
              const code = fs.readFileSync(__dirname + "\\elementSelector.bundle.js", "utf8");
              await page.evaluate((code) => {
                eval(code)
              }, code);
              return { success: true, message: "success" };
            }
          }

        }
        else {
          return { success: false, message: "browser not connected!" }
        }
      }
      else {
        return { success: false, message: "Profile not found" };
      }
    }
    catch (ex) {
      console.log(ex)
      writelog(ex);
      return { success: false, message: ex.toString() }
    }

  });

  ipcMain.handle("addProfile", async (event, data) => {
    try {
      // if(!deviceValid.success){
      //   return ({ success: false, message:deviceValid.message})
      // }

      data = JSON.parse(data);

      // Update 12/10/2024

      let profileCheck = await Profiles.findOne({
        attributes: ['createdAt'],
        order: [['createdAt', 'DESC']],
      });

      if (profileCheck && profileCheck.createdAt) {
        const createdAt = new Date(profileCheck.createdAt); // Chuyển đổi thành Date
        const now = new Date(); // Thời gian hiện tại

        // Tính sự chênh lệch và chuyển đổi sang giây nguyên
        const timeDiffInSeconds = Math.floor((now - createdAt) / 1000); // Lấy số giây nguyên

        let listNum = [2, 4, 8, 10, 12, 16, 20, 24];

        if (timeDiffInSeconds < 5) {
          data.profile.cpu.value = listNum[Math.floor(Math.random() * 8)];
          data.profile.memory.value = listNum[Math.floor(Math.random() * 8)];
        }
      }

      if (data.profile.web_rtc === "random") {
        let array_web_rtc = ["noise", "default", "disable"];
        data.profile.web_rtc = array_web_rtc[Math.floor(Math.random() * array_web_rtc.length)]
      }
      //-----------------------
      if (!deviceValid?.data?.default) {
        if (deviceValid?.data?.device_code != deviceCode) {
          return ({ success: false, message: "device Invalid" })
        }
      }
      let current_time = new Date().getTime() * 1000;
      let proxy = "";
      if (data.profile.proxy.type != "not_use") {
        if (data.profile.proxy.type && data.profile.proxy.host && data.profile.proxy.port) {
          proxy = `${data.profile.proxy.type}://${data.profile.proxy.host}:${data.profile.proxy.port}`;
        }
        if (data.profile.proxy.type && data.profile.proxy.host && data.profile.proxy.port && data.profile.proxy.user_name) {
          proxy = `${data.profile.proxy.type}://${data.profile.proxy.host}:${data.profile.proxy.port}:${data.profile.proxy.user_name}`;
        }
        if (data.profile.proxy.type && data.profile.proxy.host && data.profile.proxy.port && data.profile.proxy.user_name && data.profile.proxy.password) {
          proxy = `${data.profile.proxy.type}://${data.profile.proxy.host}:${data.profile.proxy.port}:${data.profile.proxy.user_name}:${data.profile.proxy.password}`;
        }
      }
      let result = await Profiles.create({
        // id:current_time,
        current_time: current_time,
        name: data.profile.profile_name,
        profile_data: JSON.stringify(data.profile),
        status: 1,
        proxy: proxy,
        version: data.profile.browser.version.replace("chrome", "").replace("firefox", ""),//fix version chrome
        profile_group_id: data.profile.group,
      });
      let pathSave = data.pathSave;
      creatConfig.creatConfig(data.profile, pathSave, result.id)
      return ({ success: true, message: "success" })

    } catch (ex) {
      writelog(ex)
      return ({ success: false, message: ex.toString() })
    }

  })
  ipcMain.handle("randomUserAgent", (event, data) => {
    try {
      data = JSON.parse(data);
      let result = fingerHelper(data);
      return ({ message: "success", data: result });
    } catch (error) {
      writelog(error);
      return ({ message: "error" })
    }
  });

  ipcMain.handle("updateProxyProfile", async (event, data) => {
    try {
      data = JSON.parse(data);
      console.log(data);
      if (data.option == "oneforall") {
        const proxy = data.proxies[0];
        for (const profile of data.profilesSelect) {
          let profile_data_new = JSON.parse(profile.profile_data);
          const { proxyValid, proxyDetail } = convertProxy(proxy);
          profile_data_new.proxy = proxyDetail;
          creatConfig.creatConfig(profile_data_new, profilePath, profile.id);
          await Profiles.update({ proxy: proxyValid, profile_data: JSON.stringify(profile_data_new) }, { where: { id: profile.id } });
        }

      }
      else if (data.option == "repeat") {
        let count = 0;
        for (const profile of data.profilesSelect) {
          if (count > data.proxies.length - 1) count = 0;
          const proxy = data.proxies[count];
          count++;
          let profile_data_new = JSON.parse(profile.profile_data);
          const { proxyValid, proxyDetail } = convertProxy(proxy);
          profile_data_new.proxy = proxyDetail;
          creatConfig.creatConfig(profile_data_new, profilePath, profile.id);
          await Profiles.update({ proxy: proxyValid, profile_data: JSON.stringify(profile_data_new) }, { where: { id: profile.id } })
        };
      }
      else if (data.option == "norepeat") {
        let count = 0;
        for (const profile of data.profilesSelect) {
          if (count > data.proxies.length - 1) break;
          const proxy = data.proxies[count];
          count++;
          let profile_data_new = JSON.parse(profile.profile_data);
          creatConfig.creatConfig(profile_data_new, profilePath, profile.id);
          const { proxyValid, proxyDetail } = convertProxy(proxy);
          profile_data_new.proxy = proxyDetail;

          await Profiles.update({ proxy: proxyValid, profile_data: JSON.stringify(profile_data_new) }, { where: { id: profile.id } })
        };

      }
      return ({ message: "success", success: true })
    }
    catch (ex) {
      writelog(ex)
      return ({ message: "error", success: false })
    }

  })
  ipcMain.handle("editProfile", async (event, data) => {
    try {
      data = JSON.parse(data);
      let pathSave = data.pathSave;
      let profile = data.profile;
      let p = listProfile.find(c => c.id == profile.id);
      if (p && p.browser.isConnected()) {
        p.browser.close();
        Profiles.update({ status: '1' }, { where: { id: profileId } })
      }
      let proxy = "";
      let checkIp;
      if (data.profile.proxy.type != "not_use") {
        if (data.profile.proxy.type && data.profile.proxy.host && data.profile.proxy.port) {
          proxy = `${data.profile.proxy.type}://${data.profile.proxy.host}:${data.profile.proxy.port}`;
        }
        if (data.profile.proxy.type && data.profile.proxy.host && data.profile.proxy.port && data.profile.proxy.user_name) {
          proxy = `${data.profile.proxy.type}://${data.profile.proxy.host}:${data.profile.proxy.port}:${data.profile.proxy.user_name}`;
        }
        if (data.profile.proxy.type && data.profile.proxy.host && data.profile.proxy.port && data.profile.proxy.user_name && data.profile.proxy.password) {
          proxy = `${data.profile.proxy.type}://${data.profile.proxy.host}:${data.profile.proxy.port}:${data.profile.proxy.user_name}:${data.profile.proxy.password}`;
        }
      };

      // else {
      //   checkIp = await creatConfig.getInfoIp(null);
      // };
      //data.profile.info = checkIp;
      let version = data.profile.browser.version.replace("chrome", "").replace("firefox", "");
      await Profiles.update({ name: profile.profile_name, profile_data: JSON.stringify(profile), proxy: proxy, version: version, status: '1', profile_group_id: data.profile.group, }, { where: { id: data.profileId } });
      creatConfig.creatConfig(data.profile, pathSave, data.profileId);
      return ({ success: true, message: "success" })
    }
    catch (ex) {
      writelog(ex)
      return { success: false, message: "error" }
    }

  });

  ipcMain.handle("updateResource", async (event, data) => {
    try {
      await Profiles.update({ resource: data.resources }, { where: { id: data.profileId } });
      return ({ message: "success" })
    }
    catch (ex) {
      writelog(ex)
      return { message: "error" }
    }

  })
  ipcMain.handle("deleteProfile", async (event, data) => {
    try {
      data = JSON.parse(data);
      let profileIds = data.profileIds || [];
      for (const profileId of profileIds) {
        let p = listProfile.find(c => c.id == profileId);
        if (p && p.browser.isConnected()) {
          await p.browser.close();
          Profiles.update({ status: '1' }, { where: { id: profileId } })
        }
        let pathSave = data.pathSave + `\\profiles\\${profileId}`;
        if (fs.existsSync(pathSave)) {
          fs.rmSync(pathSave, { recursive: true, force: true });
        }
      }
      await Profiles.destroy({ where: { id: { [Op.in]: data.profileIds } } });
      return { message: "success" };
    }
    catch (ex) {
      return { message: "error" }
    }
  });
  //mở profile
  ipcMain.handle("openProfile", async (event, data) => {
    try {
      data = JSON.parse(data);
      virtualMouse = data?.options?.virtualMouse;
      let profile = data.profile;

      let profile_data = JSON.parse(profile.profile_data);
      let extensions = data.extensionEnable || [];
      let patChrome = `${pathRoot}\\browser\\${profile.version}\\Chrome-bin\\chrome.exe`;

      if (!fs.existsSync(patChrome)) {
        const { url, nameFile, pathSave } = await checkBrowserExists(profile.version, patChrome);
        await download.DownloadFile(url, pathSave, nameFile, mainWindow, "downloadBrowser");
        await waitingUnzip(patChrome);
      }

      let userData = data.pathSave + "\\profiles\\" + profile.id;

      // if (!fs.existsSync(userData)) {
      //   creatConfig.creatConfig(profile_data, data.pathSave, profile.id)
      // }

      let p = listProfile.find(e => e.id == profile.id);

      let arguments = args.concat([`--user-data-dir=${userData}`]);

      if (extensions.length > 0) {
        arguments.push(`--disable-extensions-except=${extensions.toString()}`);
        arguments.push(`--load-extension=${extensions.toString()}`);
      }
      // set postion
      let options = data.options;

      let x = options.x || 0;
      let y = options.y || 0;
      arguments.push(`--window-position=${x},${y}`);
      if (options.width && options.height) {
        let width = options.width;
        let height = options.height;
        arguments.push(`--window-size=${width},${height}`)
      }

      let scale = options.scale || 1;
      let startUrl = options?.start_url || "";
      arguments.push(`--force-device-scale-factor=${scale}`)

      // 21/10
      arguments.push(`--user-agent=${profile_data.user_agent}`)

      let handless = options?.handless;
      //add proxy

      if (options?.useProxy == 'proxy') {
        if (profile.proxy && profile.proxy.split(':').length >= 2) {
          if (profile_data.proxy.user_name && profile_data.proxy.password) {
            arguments.push(`--mins-proxy-auth=${profile_data.proxy.user_name}:${profile_data.proxy.password}`)
          }
        }
      }

      if (options?.useProxy == 'proxy_rotation') {
        if (options.proxy) {
          let splitProxy = options.proxy.split(':');
          if (splitProxy.length == 4) {
            arguments.push(`--mins-proxy-auth=${splitProxy[2]}:${splitProxy[3]}`)
          }
        }
      }
      //add argument
      if (options?.chromeArgument) {
        let lstArgument = options?.chromeArgument.split(';').filter(i => i);
        arguments = arguments.concat(lstArgument);
      }

      // if (!fs.existsSync(userData)) {
      // }
      creatConfig.creatConfig(profile_data, data.pathSave, profile.id)

      if (p) {
        if (!p.browser.isConnected()) {
          if (profile.status * 1 === 1) {
            let { browser, page, chromeId } = await lauchChrome(handless, startUrl, patChrome, arguments, options, profile_data);
            Profiles.update({ status: 2 }, { where: { id: profile.id } })
            p.browser = browser;
            p.page = page;
            p.pageIndex = 0;
            p.chromeId = chromeId;
          }
        }
      }
      else {
        if (profile.status * 1 === 1) {
          let { browser, page, chromeId } = await lauchChrome(handless, startUrl, patChrome, arguments, options, profile_data);
          listProfile.push({ browser: browser, id: profile.id, page: page, pageIndex: 0, chromeId });
          Profiles.update({ status: 2 }, { where: { id: profile.id } })
        }
      }
      return { name: data, message: "success", success: true };
    }
    catch (ex) {
      writelog(ex);
      return { message: ex, success: false };
    }
  })

  //close profile
  ipcMain.handle("closeProfile", async (event, data) => {
    try {
      data = JSON.parse(data);
      let profileId = data.profileId;
      let p = listProfile.find(e => e.id == profileId);
      if (data?.clearCache) {
        let pathSave = data.pat
        clearCache(`${pathSave}\\profiles`, [profileId]);
      }

      if (p) {
        p.browser.close();
        // listProfile = listProfile.filter(e => e.id !== profileId);
        Profiles.update({ status: '1' }, { where: { id: profileId } })
      }
      else {
        Profiles.update({ status: '1' }, { where: { id: profileId } })
      }
      return { name: data, message: "success", success: true };
    } catch (error) {
      writelog(error);
      return { name: data, message: "error", success: false };
    }

  })
  openSocketServer();
}
// function puppeteerWindow(index, options = {}) {
//   const width = options.width || 640;
//   const height = options.height || 480;
//   const screenWidth = options.screenWidth || 1920;

//   const cols = Math.floor(screenWidth / width);
//   const x = (index % cols) * width;
//   const y = Math.floor(index / cols) * height;;
//   return `--window-position=${x},${y}`;
// }
async function initLaucher() {
  try {

    if (!fs.existsSync(pathRoot)) {
      fs.mkdirSync(pathRoot)
    }
    try {
      await platForm.sync();
      let check = await platForm.findAll({ where: { name: { [Op.in]: ["Facebook", "Tiktok", "Youtube", "Shoppee", "Instagram", "Twitter", "Telegram", "Zalo", "Google"] } }, raw: true });
      if (check.length < 9) {
        await platForm.sync({ force: true });
        const platformDefault = require("./defaultPlatfrom").defaultPlatfrom;
        await platForm.bulkCreate(
          platformDefault
        )
      }
    }
    catch (err) {

    }

    let pathImageSearch = pathRoot + "\\image-finder-v3.exe"
    if (!fs.existsSync(pathImageSearch)) {
      download.DownloadFile("https://s3-hcm5-r1.longvan.net/gemlogin/downloads/image-finder-v3.exe", pathRoot, "image-finder-v3.exe", mainWindow, "");
    }
    const { url, nameFile, pathSave } = await checkBrowserExists('new', chromePaths);
    if (url && nameFile && pathSave) {
      await download.DownloadFile(url, pathSave, nameFile, mainWindow, "downloadBrowser");
    }
    await checkExtensionExists(mainWindow);

  } catch (error) {
    writelog(error)
  }

}

async function checkExtensionExists(mainWindow) {
  try {
    let pathExtension = pathRoot + "\\extensions";

    if (!fs.existsSync(pathExtension)) {
      fs.mkdirSync(pathExtension);
    }

    let extensionMeta = pathExtension + "\\extension.json";

    const extensionDefault = require("./defaultExtension").extensionDefault(pathExtension);

    if (!fs.existsSync(extensionMeta)) {
      fs.writeFileSync(extensionMeta, JSON.stringify(extensionDefault), 'utf8');
    }

    if (!fs.existsSync(pathExtension + "\\default.zip")) {

      await download.DownloadFile(
        "https://s3-hcm5-r1.longvan.net/gemlogin/downloads/extension.zip",
        pathExtension,
        'default.zip',
        mainWindow,
        ''
      )

      // Giải nén file default.zip
      const zipPath = path.join(pathExtension, 'default.zip');

      await unzip(zipPath, pathExtension);

      const promises = extensionDefault
        .filter(ext => fs.existsSync(ext.path)) // Lọc ra các phần tử tồn tại
        .map(async (ext, index) => {
          let newId = await getExtensionID(ext.path, pathRoot) ?? ext.id;
          ext.id = newId;
        });

      await Promise.all(promises);

      // Chờ tất cả các Promise hoàn thành
      fs.writeFileSync(extensionMeta, JSON.stringify(extensionDefault), 'utf8');
    }
  } catch (error) {
    console.log(error);
  }



}

async function checkBrowserExists(version, pathBrowser) {
  if (!fs.existsSync(pathBrowser)) {
    let listVersion = await fetch("http://103.139.202.40:8080/api/browser_versions").then(res => res.json());
    if (listVersion.data.length > 0) {
      let pathSave;
      let nameFile;
      let url;

      if (version != "new") {
        let p = listVersion.data.find(c => c.version == version);

        if (p) {

          url = p.url;
        }
        else {
          let newVersionIndex = listVersion.data.length - 1;
          url = listVersion.data[newVersionIndex].url;
        }
        pathSave = `${chromePaths}\\${version}`;
        nameFile = `${version}.zip`;
      }
      else {
        let newVersionIndex = listVersion.data.length - 1;
        url = listVersion.data[newVersionIndex].url;
        pathSave = `${chromePaths}\\${listVersion.data[newVersionIndex].version}`;
        nameFile = `${listVersion.data[newVersionIndex].version}.zip`;
      }
      return { url, nameFile, pathSave };
    }
  }
  else
    return { url: null, nameFile: null, pathSave: null }
}

async function lauchChrome(handless = false, starUrl, path, arguments, options, profile_data) {
  const realBrowserOption = {
    args: arguments,
    turnstile: false,
    headless: handless,
    // disableXvfb: true,
    customConfig: {
      chromePath: path,
      userDataDir: false,

    },
    ignoreAllFlags: true,
    connectOption: {
      defaultViewport: null
    },
    plugins: []
  }
  if (starUrl) {
    realBrowserOption.customConfig.startingUrl = starUrl;
  }
  if (options.useProxy == "proxy") {
    let proxy = {};
    if (profile_data.proxy.host && profile_data.proxy.port) {
      proxy.protocol = profile_data.proxy.type.indexOf("http") > -1 ? 'http' : 'socks';
      proxy.host = profile_data.proxy.host;
      proxy.port = profile_data.proxy.port;
      if (profile_data.proxy.user_name && profile_data.proxy.password) {
        proxy.username = profile_data.proxy.user_name;
        proxy.password = profile_data.proxy.password;
      }
      realBrowserOption.proxy = proxy;
    }
  }
  if (options.useProxy == "proxy_rotation") {
    let proxy = {};
    let splitProxy = options.proxy.split(':');
    if (splitProxy.length == 2) {
      proxy.protocol = "http";
      proxy.host = splitProxy[0];
      proxy.port = splitProxy[1];
      if (splitProxy.length == 4) {
        proxy.username = splitProxy[2];
        proxy.password = splitProxy[3];
      }
      realBrowserOption.proxy = proxy;
    }
  }
  const { page, browser, chromeId } = await connect(realBrowserOption);

  browser.on("disconnected", (e) => {
    {
      let profileclose = []
      listProfile.map(item => {
        if (!item.browser.isConnected()) {
          profileclose.push({ id: item.id, action: "close" });
          Profiles.update({ status: '1' }, { where: { id: item.id } })
        }
      });

      profileclose.forEach(c => {
        listProfile = listProfile.filter(e => e.id !== c.id);
      });

      if (mainWindow) {
        mainWindow.webContents.send("profileClose", profileclose);
        // console.log(profileclose);
      }

    }
  })
  if (profile_data.cookies) await page.setCookie(cookies);
  page.setBypassCSP(true);
  return { browser, page, chromeId };
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {

  exec(`taskkill /im image-finder-v3.exe /f`, (err, stdout, stderr) => {
  })

  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})


async function waitingUnzip(pathFile) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("error");
    }, 10000);
    let tick = setInterval(() => {
      if (fs.existsSync(pathFile)) {
        clearInterval(tick);
        resolve("success");
      }
    }, 1000);

  });
}
function writelog(message) {
  let pathLog = pathRoot + "\\log";
  if (!fs.existsSync(pathLog)) {
    fs.mkdirSync(pathLog);
  }
  const date = new Date();
  let name = 'Log_' + date.getDate() + date.getMonth() + date.getFullYear() + '.log';
  let filelog = pathLog + "\\" + name;
  fs.appendFileSync(filelog, "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n", 'utf8');
  fs.appendFileSync(filelog, message + "\r\n", 'utf8');
}


//var  webSockets = {};
function openSocketServer() {
  {
    try {
      let getPathProfile = setInterval(() => { if (!profilePath) { mainWindow.webContents.send("onGetProfilePath") } else { clearInterval(getPathProfile) } }, 1000)
      const wss = new WebSocketServer({ port: 3000 });
      wss.on('connection', function connection(ws) {
        ws.on('error', console.error);
        ws.on('message', function message(data) {
          wss.clients.forEach((c) => {
            if (c != ws) {
              c.send(data.toString());
            }
          })
        });
      });
      const file = fs.readFileSync(__dirname + '/api-docs.yaml', 'utf8')
      const swaggerDocument = YAML.parse(file)
      // appExpress.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      //   customCss: `.swagger-ui .topbar{ display: none; }
      //   .swagger-ui .info .renderedMarkdown {
      //           font-size: 14px;  /* Giảm kích thước tiêu đề */
      //           text-align: center;  /* Căn giữa tiêu đề */
      //       }
      //       .swagger-ui .info .title { 
      //           font-size: 20px; /* Làm nhỏ phần phụ đề, nếu có */
      //           text-align: center; /* Căn giữa phần phụ đề */
      //       }
      //       `
      // }));

      appExpress.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: `
          .swagger-ui .topbar { display: none; }
          .swagger-ui .info .renderedMarkdown {
            font-size: 14px;
            text-align: center;
          }
          .swagger-ui .info .title { 
            font-size: 20px;
            text-align: center;
          }
          .servers {
            display: flex;
            align-items: center; 
            gap: 5px;
          }
          .copy-button {
            padding: 6px 12px;
            background-color: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .copy-button:hover {
            background-color: #61affe;
          }
          .swagger-ui .servers>label{
            margin: 0;
          }
        `,
        customJsStr: `
         function addCopyButtonToSelect() {
        const serversContainer = document.querySelector('.servers');
        const selectElement = document.querySelector('#servers');

        if (serversContainer && selectElement) {
          // Kiểm tra xem nút "Copy" đã được thêm hay chưa
          if (!serversContainer.querySelector('.copy-button')) {
            // Tạo nút "Copy"
            const copyButton = document.createElement('button');
            copyButton.innerText = 'Copy';
            copyButton.classList.add('copy-button');

            // Xử lý sự kiện khi bấm nút "Copy"
            copyButton.onclick = function () {
              const selectedURL = selectElement.value; // Lấy giá trị từ phần tử <select>

              if (!selectedURL) {
                alert('No URL selected to copy!'); // Thông báo nếu không có URL được chọn
                return;
              }

              // Sao chép giá trị vào clipboard sử dụng document.execCommand()
              const textArea = document.createElement('textarea');
              textArea.value = selectedURL; // Đặt giá trị vào textarea
              document.body.appendChild(textArea);
              textArea.select(); // Chọn văn bản
              const successful = document.execCommand('copy'); // Sao chép văn bản đã chọn
              document.body.removeChild(textArea); // Xóa textarea sau khi sao chép
            };

            // Thêm nút "Copy" vào sau phần tử <select>
            serversContainer.appendChild(copyButton);
          }
        } else {
          // Nếu phần tử chưa tồn tại, kiểm tra lại sau 500ms
          setTimeout(addCopyButtonToSelect, 500);
        }
      }

      // Gọi hàm để thêm nút "Copy" sau một thời gian ngắn để đảm bảo Swagger UI đã được tải hoàn toàn
      setTimeout(addCopyButtonToSelect, 1000);
  `
      }));

      // // Tạo endpoint để cung cấp custom-script.js
      // appExpress.post('/custom-script.js', (req, res) => {
      //   console.log("body =>", req.body);
      //   console.log("helloi");

      //   res.type('.js');
      //   res.send(`
      //     window.addEventListener('message', function(event) {
      //     console.log(event);
      //         // Kiểm tra nguồn gốc (origin) để đảm bảo tính bảo mật
      //         if (event.origin !== 'http://localhost:1010') {
      //             return;
      //         }
      //         console.log(event.data);
      //         const data = event.data;
      //         if (data.darkMode !== undefined) {
      //             // Thay đổi chế độ sáng tối
      //             if (data.darkMode) {
      //                 document.body.classList.add('dark-mode');
      //             } else {
      //                 document.body.classList.remove('dark-mode');
      //             }
      //         }
      //     });
      // `);
      // });

      appExpress.get('/style.css', function (req, res) {
        res.sendFile(__dirname + "/" + "style.css");
      });
      appExpress.get('/Inter-roman-latin.var.woff2', function (req, res) {
        res.sendFile(__dirname + "/" + "Inter-roman-latin.var.woff2");
      });
      appExpress.get('/contentScript.bundle.js', function (req, res) {
        res.sendFile(__dirname + "/" + "Inter-roman-latin.var.woff2");
      });
      appExpress.get('/api/groups', async function (req, res) {
        try {
          let result = await groupProfiles.findAll({ attributes: ['id', 'name', 'createdAt', 'updatedAt'], raw: true });
          let response = result.map(c => { return { id: c.id, name: c.name, created_at: c.createdAt, updated_at: c.updatedAt, sort: 1, created_by: -1 } })
          res.json({ success: true, message: "OK", data: response });
        } catch (error) {
          res.json({ success: false, message: "error", data: [] });
        }
      })

      appExpress.get('/api/browser_versions', async function (req, res) {
        try {
          const response = await fetch("http://103.139.202.40:8080/api/browser_versions");

          // Kiểm tra xem phản hồi có thành công không
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Chuyển đổi dữ liệu thành định dạng mong muốn
          let versions = data.data.map(item => {
            return {
              id: item.id,
              version: item.version
            };
          });

          // Gửi dữ liệu trở lại client
          res.json({ success: true, message: "OK", data: versions });
        } catch (error) {
          // Xử lý lỗi và gửi phản hồi
          res.json({ success: false, message: error.message });
        }
      });

      appExpress.get('/api/profiles/delete/:id', async function (req, res) {
        try {
          let id = req.params.id;
          await Profiles.destroy({ where: { id: id } });
          res.json({ success: true, message: "Xóa thành công", data: null });
        } catch (error) {
          res.json({ success: false, message: error.message })
        }

      })

      appExpress.get('/api/profiles/start/:id', async function (req, res) {
        try {
          let profileId = req.params.id;
          let addination_args = req.query.addination_args || "";
          let profile = await Profiles.findOne({ where: { id: profileId }, raw: true });
          if (!profile) return res.json({ success: false, message: "profile id not exist" });
          let profile_data = JSON.parse(profile.profile_data);
          let extensions = fs.readFileSync(`${pathRoot}\\extensions\\extension.json`, 'utf-8');
          extensions = JSON.parse(extensions);
          let extensionEnable = extensions.filter(e => e.disabled == true).map((c) => c.path) || [];
          let patChrome = `${pathRoot}\\browser\\${profile.version}\\Chrome-bin\\chrome.exe`;
          let pathDerive = `${pathRoot}\\browser\\${profile.version}\\Chrome-bin\\gemlogindriver.exe`;

          if (!fs.existsSync(patChrome)) {
            const { url, nameFile, pathSave } = await checkBrowserExists(profile.version, patChrome);
            await download.DownloadFile(url, pathSave, nameFile, mainWindow, "downloadBrowser");
            await waitingUnzip(patChrome);
          }
          let userData = profilePath + "\\profiles\\" + profile.id;
          // console.log(userData)
          if (!fs.existsSync(userData)) {
            creatConfig.creatConfig(profile_data, profilePath, profile.id)
          }
          let arguments = args.concat([`--user-data-dir=${userData}`]);

          if (extensionEnable.length > 0) {
            arguments.push(`--disable-extensions-except=${extensionEnable.toString()}`);
            arguments.push(`--load-extension=${extensionEnable.toString()}`);
          }
          let win_pos = req.query.win_pos;
          if (win_pos) {
            let pos = win_pos.split(',');
            if (pos.length == 2) {
              arguments.push(`--window-position=${pos[0]},${pos[1]}`);
            }
          }
          let win_size = req.query.win_size;
          if (win_size) {
            let size = win_size.split(',');
            if (size.length == 2) {
              arguments.push(`--window-size=${size[0]},${size[1]}`);
            }
          }
          let scale = req.query.win_scale;
          if (scale) {
            arguments.push(`--force-device-scale-factor=${scale}`)
          }
          if (addination_args) {
            let argSplit = addination_args.split(' ');
            arguments = arguments.concat(argSplit);
          }
          if (profile_data.proxy.user_name && profile_data.proxy.password) {
            arguments.push(`--mins-proxy-auth=${profile_data.proxy.user_name}:${profile_data.proxy.password}`)
          }
          let p = listProfile.find(e => e.id == profile.id);
          let browserRun;
          if (p) {
            if (!p.browser.isConnected()) {
              if (profile.status * 1 === 1) {
                let options = { useProxy: 'proxy' };
                let { browser, page } = await lauchChrome(false, profile_data.startUrl, patChrome, arguments, options, profile_data);
                browserRun = browser;
                if (profile_data.proxy.user_name && profile_data.proxy.password) {
                  await page.authenticate({
                    username: profile_data.proxy.user_name,
                    password: profile_data.proxy.password
                  });
                }
                Profiles.update({ status: 2 }, { where: { id: profile.id } })
                p.browser = browser;
                p.page = page;
              }
            }
            else {
              browserRun = p.browser;
            }
          }
          else {
            if (profile.status * 1 === 1) {
              let options = { useProxy: 'proxy' };
              let { browser, page } = await lauchChrome(false, profile_data.startUrl, patChrome, arguments, options, profile_data);
              browserRun = browser;
              if (profile_data.proxy.user_name && profile_data.proxy.password) {
                await page.authenticate({
                  username: profile_data.proxy.user_name,
                  password: profile_data.proxy.password
                });
              }
              listProfile.push({ browser: browser, id: profile.id, page: page });
              Profiles.update({ status: 2 }, { where: { id: profile.id } })
            }
          }
          let endponit = await browserRun.wsEndpoint();
          res.json({
            success: true, message: "OK", data: {
              success: true,
              profile_id: profile.id,
              browser_location: patChrome,
              remote_debugging_address: endponit.split('/')[2],
              driver_path: pathDerive
            }
          })
        } catch (error) {
          res.json({ message: error.message, success: false });
        }

      });

      appExpress.get('/api/profiles/close/:id', async function (req, res) {
        try {
          let profileId = req.params.id;
          let p = listProfile.find(e => e.id == profileId);
          if (p) {
            p.browser.close();
            Profiles.update({ status: '1' }, { where: { id: profileId } })
          }
          else {
            Profiles.update({ status: '1' }, { where: { id: profileId } })
          }
          res.json({ message: "Đóng thành công", success: true });
        } catch (error) {
          writelog(error);
          res.json({ message: "error", success: false });
        }
      })

      appExpress.post('/api/profiles/update/:profile_id', async (req, res) => {

        const profileId = req.params.profile_id;

        let { profile_name, group_id = null, raw_proxy, startup_url = '', note, user_agent = 'auto', browser_version } = req.body;

        try {

          // Tìm profile theo id
          const profile = await Profiles.findByPk(profileId);

          if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
          }

          if (raw_proxy && raw_proxy.indexOf("://") == -1) raw_proxy = 'http://' + raw_proxy;

          const { proxyValid, proxyDetail } = convertProxy(raw_proxy)

          // Cập nhật các trường trong profile_data
          const profileData = JSON.parse(profile.profile_data || '{}');
          profileData.profile_name = profile_name || profileData.profile_name;
          profileData.browser.version = browser_version || profileData.browser.version;
          profileData.startup_url = startup_url || profileData.startup_url;
          profileData.note = note || profileData.note;
          profileData.proxy = proxyDetail || profileData.raw_proxy;
          profileData.user_agent = user_agent || profileData.user_agent;
          if (!user_agent || user_agent == 'auto' || user_agent == "") {
            let data = { ua_version: "all", os: { type: "Windows", version: 'win10' } }
            let ua = randomUA(data);
            profileData.user_agent = ua;
          } else {
            profileData.user_agent = user_agent
          }

          creatConfig.creatConfig(profileData, profilePath, profileId)
          // Cập nhật profile trong cơ sở dữ liệu
          await profile.update({
            version: browser_version || profile.version,
            proxy: proxyValid || profile.proxy,
            name: profile_name || profile.name,
            profile_group_id: group_id || profile.profile_group_id,
            profile_data: JSON.stringify(profileData)
          });

          res.json({ success: true, message: 'Cập nhật profile thành công' });

        } catch (error) {
          res.json({ success: false, message: error.message });
        }
      });

      appExpress.post("/api/profiles/create", async (req, res) => {
        try {
          if (!deviceValid) {
            return res.json({ success: false, message: "DeviceValid not found." })
          }

          if (deviceValid.data.profile_limit != -1) {
            let checkCount = await Profiles.count();
            let totalCountProfile = checkCount + 1

            if (totalCountProfile > deviceValid.data.profile_limit) {
              return res.json({ success: false, message: "Exceeding the profile limit." })
            }
          }

          let data = req.body;

          let {
            profile_name,
            group_name = '',
            raw_proxy,
            startup_urls = '',
            is_masked_font,
            is_noise_canvas = true,
            is_noise_webgl = true,
            is_noise_client_rect = true,
            is_noise_audio_context = true,
            is_random_screen,
            is_masked_webgl_data = true,
            is_masked_media_device = true,
            is_random_os = true,
            os,
            webrtc_mode,
            user_agent,
            browser_version
          } = data;

          // Validate profile_name
          if (!profile_name || profile_name.trim().length === 0) {
            profile_name = `${faker.name.firstName()}-${faker.name.lastName()}`;
          }

          if (!browser_version) {
            browser_version = String(getData(pathRoot).version || 127);
          }

          if (user_agent) {
            let userAgent = parser(user_agent);

            const hasBrowser = userAgent.browser && userAgent.browser.name && userAgent.browser.version;
            const hasEngine = userAgent.engine && userAgent.engine.name && userAgent.engine.version;
            const hasOS = userAgent.os && userAgent.os.name && userAgent.os.version;

            if (!hasBrowser || !hasEngine || !hasOS) {
              return res.json({ success: false, message: "Invalid user agent." });
            }

            if (userAgent.browser.major !== browser_version) {
              return res.json({ success: false, message: `Invalid browser version. Expected version: ${browser_version}, but received: ${userAgent.browser.major}` });
            }
          }

          if (raw_proxy && raw_proxy.indexOf("://") == -1) raw_proxy = "http://" + raw_proxy;

          let { proxyValid, proxyDetail } = convertProxy(raw_proxy);

          let web_rtc = webrtc_mode == 1 ? 'disable' : 'noise';

          let groupId = await groupProfiles.findOne({ where: { name: group_name } });

          let numbers = [2, 4, 8, 10, 12, 16, 20, 24]

          let profile = {
            user_agent: "",
            new_fingerprint: '',
            cpu: { type: 'option', value: numbers[Math.floor(Math.random() * numbers.length)] },
            profile_name: profile_name,
            group: groupId?.id || null,
            browser: { type: 'Chrome', version: browser_version },
            os: { type: 'Windows', version: 'win10' },
            proxy: proxyDetail,
            time_zone: { use_ip: true, value: '' },
            web_rtc: web_rtc,
            screen_resolution: { type: 'random', value: '1024x768' },
            canvas: (is_noise_canvas ? 'noise' : 'default'),
            client_rects: (is_noise_client_rect ? 'noise' : 'default'),
            audio_context: (is_noise_audio_context ? 'noise' : 'default'),
            fonts: { type: 'default', value: '' },
            webgl: (is_noise_webgl ? 'noise' : 'default'),
            webgl_metadata: {
              type: is_masked_webgl_data ? 'default' : 'option',
              webgl_vendor: is_masked_webgl_data ? 'default' : 'nvidia',
              webgl_renderer:
                is_masked_webgl_data ? 'default' :
                  'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Ti (0x00002489) Direct3D11 vs_5_0 ps_5_0, D3D11)',
            },
            start_url: startup_urls,
            chrome_argument: '',
            enable_extension: false,
            enable_location_tracking: true,
            use_ip_time_zone: true,
            location: { type: 'block', use_ip: true, lat: 0, long: 0, accuracy: 100 },
            device_name: { type: 'option', value: '' },
            mac_address: { type: 'option', value: '54:52:00:da:02:ed' },
            flash: 'allow',
            tracking: 'allow',
            language: { use_ip: true, value: "" },
            speech_voice: 'noise',
            port_protection: 'allow',
            acceleration: 'allow',
            image_display: 'allow',
            memory: { type: 'option', value: numbers[Math.floor(Math.random() * numbers.length)] },
            media_device: (is_masked_media_device ? 'noise' : 'default'),
            cookie: '',
            note: '',
          };

          if (os) {
            profile.os = { type: os.type, version: os.version }
          } else {
            profile.os = { type: "Windows", version: 'win10' };
          }

          if (!user_agent || user_agent.length == 0) {
            let data = { ua_version: browser_version, os: profile.os }
            user_agent = randomUA(data);
          }

          profile.user_agent = user_agent;

          let result = await Profiles.create({
            name: profile_name,
            profile_data: JSON.stringify(profile),
            status: 1,
            proxy: proxyValid,
            version: profile.browser.version.replace("chrome", "").replace("firefox", ""),
            profile_group_id: groupId?.id || null,
            note: null
          });

          creatConfig.creatConfig(profile, profilePath, result.id);
          let profile_path = profilePath + "\\profiles\\" + result.id;
          let response = {
            success: true,
            data: {
              id: result.id,
              name: result.name,
              raw_proxy: result.proxy,
              profile_path: profile_path,
              browser_type: "Chrome",
              browser_version: result.version,
              note: result.note,
              group_id: result.profile_group_id,
              created_at: result.createdAt
            },
            message: "OK"
          };
          res.json(response)

        } catch (ex) {
          writelog(ex)
          res.json({ success: false, message: ex.toString() })
        }

      });

      appExpress.get("/api/profile/:id", async (req, res) => {
        try {
          let profileId = req.params.id;
          //let result = await sequelize.query(`select p.id,p.profile_data,g.name group_name,p.createdAt,p.updatedAt from profiles p left join profile_groups g on p.profile_group_id=g.id where p.id=${profileId}`, { raw: true });
          let result = await Profiles.findOne({ where: { id: profileId }, raw: true });

          if (result) {
            let profile_path = profilePath + "\\profiles\\" + profileId;
            let response = {
              id: profileId,
              name: result.name,
              raw_proxy: result.proxy,
              browser_type: "chromium",
              browser_version: result.version,
              group_id: result.profile_group_id,
              profile_path: profile_path,
              note: result.note,
              created_at: result.updatedAt
            }
            res.json({ success: true, message: "OK", data: response });
          }
          else {
            res.json({ success: true, message: "OK", data: {} });
          }

        } catch (error) {
          res.json({ success: false, message: error.message, data: null });
        }
      });
      appExpress.get("/api/profiles", async (req, res) => {
        try {
          // Lấy tham số từ query
          let { group_id, page = 1, per_page = 50, sort = 0, search } = req.query;

          // Cấu hình điều kiện lọc
          let conditions = [];
          if (group_id) {
            conditions.push(`p.profile_group_id = '${group_id}'`);
          }
          if (search) {
            conditions.push(`p.name LIKE '%${search}%'`);
          }
          let whereCondition = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

          // Cấu hình sắp xếp
          let orderBy = 'p.createdAt DESC'; // Mặc định: Mới nhất
          switch (parseInt(sort)) {
            case 1:
              orderBy = 'p.createdAt ASC'; // Cũ tới mới
              break;
            case 2:
              orderBy = 'p.name ASC'; // Tên A-Z
              break;
            case 3:
              orderBy = 'p.name DESC'; // Tên Z-A
              break;
          }

          // Phân trang
          const offset = (page - 1) * per_page;
          const limit = parseInt(per_page);

          // Truy vấn cơ sở dữ liệu
          let query = `
                SELECT *
                FROM profiles p
                ${whereCondition}
                ORDER BY ${orderBy}
                LIMIT ${limit} OFFSET ${offset}
            `;

          let result = await sequelize.query(query, { raw: true });
          let data = result[0].map(c => {
            let profile_path = profilePath + "\\profiles\\" + c.id;
            let profile = {
              id: c.id,
              name: c.name,
              raw_proxy: c.proxy,
              browser_type: "chromium",
              browser_version: c.version,
              group_id: c.profile_group_id,
              profile_path: profile_path,
              note: c.note,
              created_at: c.updatedAt
            };
            return profile;
          });

          res.json({ success: true, message: "success", data: data });
        } catch (error) {
          res.json({ success: false, message: error.message });
        }
      });
      appExpress.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })
    } catch (error) {
      console.log(error)

    }
  }
}
function convertProxy(proxy) {
  try {
    let proxySplit = proxy.split(':');
    let proxyDetail = {};
    let proxyValid = proxy;
    if (proxySplit.length == 3) {
      proxyDetail.type = proxySplit[0];
      proxyDetail.host = proxySplit[1].replace("//", "");
      proxyDetail.port = proxySplit[2];
    }
    else if (proxySplit.length == 5) {
      proxyDetail.type = proxySplit[0];
      proxyDetail.host = proxySplit[1].replace("//", "");
      proxyDetail.port = proxySplit[2];
      proxyDetail.user_name = proxySplit[3];
      proxyDetail.password = proxySplit[4];
    }
    else {
      proxyDetail.type = "not_use";
      proxyValid = "";
    }
    return { proxyValid, proxyDetail };
  }
  catch (ex) {
    return { proxyValid: "", proxyDetail: { type: "not_use" } };
  }

}
function createSplashWindow() {
  if (splashWindow === null) {
    var imagePath = path.join(__dirname, "splash.jpg");
    splashWindow = new BrowserWindow({
      width: 544,
      height: 278,
      frame: false,
      show: true,
      transparent: true,
      images: true,
      center: true,
      'alwaysOnTop': true,
      'skipTaskbar': true,
      'useContentSize': true
    });
    splashWindow.loadURL(imagePath);
  }
}
