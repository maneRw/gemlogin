const puppeteer = require('puppeteer-core');
const fs = require('fs');
module.exports.getExtensionID = async function (extensionPath, pathChome) {

    const dirPath = `${pathChome}\\browser`;

    const directories = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(file => file.isDirectory())
        .map(file => file.name);

    let version = null;

    // Lặp qua tất cả các thư mục để tìm chrome.exe
    for (const dir of directories) {
        const potentialPath = `${dirPath}\\${dir}\\Chrome-bin\\chrome.exe`;
        if (fs.existsSync(potentialPath)) {
            version = dir; // Lưu đường dẫn nếu tìm thấy
            break;
        }
    }

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: `${dirPath}\\${version || 127}\\Chrome-bin\\chrome.exe`, //"C:\\Users\\MY ASUS\\.gemlogin\\browser\\127\\Chrome-bin\\chrome.exe",
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            // '--headless=old'
            `--window-size=1,1`,
            `--window-position=-9999,-9999`
        ]
    });

    let [page] = await browser.pages();
    await page.goto("chrome://extensions", { waitUntil: 'networkidle0' });
    await page.waitForSelector('extensions-manager', { visible: true });

    // await page.goto("chrome://extensions");

    let id = await page.evaluate(() =>
        document.querySelector('extensions-manager').shadowRoot.querySelector('#items-list').shadowRoot.querySelector('extensions-item').getAttribute('id'));

    await browser.close();

    return id;
}