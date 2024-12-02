const { contextBridge, ipcRenderer } = require('electron/renderer');
contextBridge.exposeInMainWorld('electronAPI', {
  getHomePath: () => ipcRenderer.invoke('getHomePath'),
  installExtension: (data) => ipcRenderer.invoke('installExtension', data),
  crudExtension: (data) => ipcRenderer.invoke('crudExtension', data),
  crudGroup: (data) => ipcRenderer.invoke('crudGroup', data),
  crudProxy: (data) => ipcRenderer.invoke('crudProxy', data),
  crudPlatform: (data) => ipcRenderer.invoke('crudPlatform', data),
  searchExtension: (data) => ipcRenderer.invoke('searchExtension', data),
  getIdDevice: (data) => ipcRenderer.invoke('getIdDevice', data),
  checkLicense: (data) => ipcRenderer.invoke('checkLicense', data),
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
  downloadTemplate: (data) => ipcRenderer.invoke('downloadTemplate', data),
  sendData: (data) => ipcRenderer.invoke('sendData', data),
  crudScript: (data) => ipcRenderer.invoke('crudScript', data),
  crudConfigProfile: (data) => ipcRenderer.invoke('crudConfigProfile', data),
  addProfile: (data) => ipcRenderer.invoke('addProfile', data),
  getProfile: (data) => ipcRenderer.invoke('getProfile', data),
  editProfile: (data) => ipcRenderer.invoke('editProfile', data),
  updateResource: (data) => ipcRenderer.invoke('updateResource', data),
  settingProfile: (data) => ipcRenderer.invoke('settingProfile', data),
  deleteProfile: (data) => ipcRenderer.invoke('deleteProfile', data),
  openProfile: (data) => ipcRenderer.invoke('openProfile', data),
  closeProfile: (data) => ipcRenderer.invoke('closeProfile', data),
  initWorkflow: (data) => ipcRenderer.invoke('initWorkflow', data),
  startRecording: (data) => ipcRenderer.invoke('startRecording', data),
  startDownloadbrowser: (data) => ipcRenderer.send('startDownloadbrowser', data),
  startUpdate: (data) => ipcRenderer.send('startUpdate', data),
  openLink: (data) => ipcRenderer.send('openLink', data),
  getLocation: (data) => ipcRenderer.invoke('getLocation', data),
  sortBrowser: (data) => ipcRenderer.invoke('sortBrowser', data),

  checkIpService: (data) => ipcRenderer.invoke('checkIpService', data),
  randomUserAgent: (data) => ipcRenderer.invoke('randomUserAgent', data),
  excelManage: (data) => ipcRenderer.invoke('excelManage', data),
  readFileText: (data) => ipcRenderer.invoke('readFileText', data),
  updateProxyProfile: (data) => ipcRenderer.invoke('updateProxyProfile', data),
  clearCache: (data) => ipcRenderer.invoke('clearCache', data),
  backUp: (data) => ipcRenderer.invoke('backupProfile', data),
  onBackupProgress: (callback) => ipcRenderer.on('backupProgress', (event, progress) => callback(progress)),
  uploadBackUp: (data) => ipcRenderer.invoke('uploadBackUp', data),
  onUploadProgress: (callback) => ipcRenderer.on('uploadProgress', (event, progress) => callback(progress)),
  previewImage: (data) => ipcRenderer.invoke('previewImage', data),
  replaceConfig : (data) => ipcRenderer.invoke('replaceConfig', data),
  getProfilePath: (data) => ipcRenderer.send('getProfilePath', data),

  getListScreen: (data) => ipcRenderer.invoke('getListScreen', data),

  googleSheet: (data) => ipcRenderer.invoke('googleSheet', data),

  previewInsertData: (data) => ipcRenderer.invoke('read-file', data),

  //autoupdate
  quitAndInstall: (data) => ipcRenderer.invoke('quitAndInstall', data),

  initLaucher: (data) => ipcRenderer.invoke('initLaucher', data),
  onCloseProfile: (cb) => {
    ipcRenderer.on('profileClose', (event, data) => cb(data));
  },
  onDownloadBrowser: (cb) => {
    ipcRenderer.on('downloadBrowser', (event, data) => cb(data));
  },
  onUpdate: (cb) => {
    ipcRenderer.on('onUpdate', (event, data) => cb(data));
  },
  onGetProfilePath: (cb) => {
    ipcRenderer.on('onGetProfilePath', (event, data) => cb(data));
  },
  onRecording: (cb) => {
    ipcRenderer.on('onRecording', (event, data) => cb(data));
  },
  onProxyCheck: (cb) => {
    ipcRenderer.on('onProxyCheck', (event, data) => cb(data));
  },
})