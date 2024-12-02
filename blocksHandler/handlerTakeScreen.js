const fs=require('fs');
module.exports.handlerTakeScreen = async (iframe, page, data) => {
    try {
        let base64;
        if (data.type == "fullpage") {
            base64 = await page.screenshot({ encoding: "base64" ,fullPage: true });
            if (data.saveToComputer) {
                let path = data.fileName + "." + data.ext;
                base64_decode(base64, path);
            }
        }
        else if (data.type == "element") {
            let context=iframe||page;
            const element = await context.$(data.selector);
            base64 = await element.screenshot({ encoding: "base64" });
            if (data.saveToComputer) {
                let path = data.fileName + "." + data.ext;
                base64_decode(base64, path);
            }

        }
        else {
            base64 = await page.screenshot({ encoding: "base64" });
            if (data.saveToComputer) {
                let path = data.fileName + "." + data.ext;
                base64_decode(base64, path);
            }
        }
        return { success: true, message: "successs", data: base64 }
    } catch (error) {
        return { success: false, message: error.message }
    }



}
function base64_decode(base64String, file) {
    let base64Image = base64String.split(';base64,').pop();
    fs.writeFileSync(file, base64Image,{encoding: 'base64'});
}