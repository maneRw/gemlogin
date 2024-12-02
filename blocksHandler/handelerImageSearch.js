const { exec, spawn } = require('child_process');
const fs = require('fs');
module.exports.handlerImageSearch = async (page, data, pathRoot) => {
    try {
        let checkRun = await isRunning("image-finder-v3.exe");
        if (!checkRun) {
            await cmd('image-finder-v3.exe', pathRoot)
        }
        let input_file = data.inputBase64;
        if (data.mode == 'Path') {
            if (!fs.existsSync(data.inputBase64)) return { success: false, message: "file not exist" }
            input_file = `data:image/png;base64,${fs.readFileSync(data.inputBase64, { encoding: 'base64' })}`;
        }
        else {
            if (data.inputBase64.indexOf('data:image/png;base64,') == -1) {
                input_file = `data:image/png;base64,${data.inputBase64}`
            }
        }
        let screenshot;
        if (data.type == "fullpage") {
            screenshot = await page.screenshot({ encoding: "base64", fullPage: true })
        }
        else if (data.type == 'element') {
            if (data.findBy == "cssSelector") {
                const element = await page.$(data.selector);
                screenshot = await element.screenshot({ encoding: "base64" });
            }
            else {
                const element = await page.$('xpath/' + data.selector);
                screenshot = await element.screenshot({ encoding: "base64" });
            }

        }
        else {
            screenshot = await page.screenshot({ encoding: "base64" })
        }
        screenshot = 'data:image/png;base64,' + screenshot;

        const body = {
            input_file: input_file,
            screenshot_file: screenshot,
            threshold: data.threshold,
            algo: data.algo,
            rgb: data.rgbEnable
        };
        const response = await fetch('http://127.0.0.1:58210/matching_img',
            {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            });
        const result = await response.json();
        if (result.data.nine_point.length > 0) {
            let point = { X: 0, Y: 0 };
            let length = result.data.nine_point[0].length;
            for (i = 0; i < length; i++) {
                point.X = point.X + result.data.nine_point[0][i][0];
                point.Y = point.Y + result.data.nine_point[0][i][1];
            }
            point.X = Math.round(point.X / length);
            point.Y = Math.round(point.Y / length);
            if (data.clickImage) {
                await page.mouse.click(point.X, point.Y);
            }
            return { success: true, message: "success", data: { screenshot: screenshot, point: point } };
        }
        return { success: false, message: "not found image", data: { screenshot: screenshot } };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
const isRunning = (query) => {
    return new Promise((resolve, reject) => {
        let platform = process.platform;
        let cmd = '';
        switch (platform) {
            case 'win32': cmd = `tasklist`; break;
            case 'darwin': cmd = `ps -ax | grep ${query}`; break;
            case 'linux': cmd = `ps -A`; break;
            default: break;
        }
        exec(cmd, (err, stdout, stderr) => {
            resolve(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
        });
    })

}

function cmd(command, path, openfile = true) {
    let p = path ? spawn(command, { cwd: path }) : spawn(command);
    if (openfile) {
        return new Promise((resolve) => {
            p.stdout.on("data", (x) => {
                if (x.toString().indexOf("Application startup complete")) setTimeout(() => { resolve() }, 2000);
            });
            p.stderr.on("data", (x) => {
                if (x.toString().indexOf("Application startup complete")) setTimeout(() => { resolve() }, 2000);
            });
        });
    }
}