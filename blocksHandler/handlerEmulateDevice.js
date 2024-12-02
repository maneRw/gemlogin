const puppeteer = require('puppeteer-core');
module.exports.handlerEmulateDevice = async function (page, deviceName) {
    // const device = Object.values(puppeteer.KnownDevices).slice(30).map(item => item.name)
    // console.log("Device =>", device);

    try {
        const device = puppeteer.KnownDevices[deviceName];

        if (!device) {
            //throw new Error(`Device "${deviceName}" not found in KnownDevices`);
            return { success: false, message: `Device "${deviceName}" not found in KnownDevices` };
        }
        await page.emulate(device);
        // Ghi đè userAgent
        await page.evaluate((userAgent) => {
            Object.defineProperty(navigator, 'userAgent', {
                value: userAgent,
                configurable: true
            });
        }, device.userAgent);
        
        await page.setViewport({
            width: device.viewport.width,
            height: device.viewport.height,
            deviceScaleFactor: device.viewport.deviceScaleFactor,
            isMobile: device.viewport.isMobile,
            hasTouch: device.viewport.hasTouch,
            isLandscape: device.viewport.isLandscape
        });

        return { success: true, message: "Success" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}