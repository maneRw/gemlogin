
module.exports.handlerKeyBoard = async (iframe, page, data) => {
    try {
        let context = iframe || page;
        let element;
        // Đợi cho đến khi phần tử xuất hiện trên trang
        if (data.findBy == "cssSelector") {
            await context.waitForSelector(data.selector, { timeout: 15000 });
            element = await context.$(data.selector);
        }
        else {
            await context.waitForSelector(`xpath/${data.selector}`, { timeout: 15000 });
            element = await context.$(`xpath/${data.selector}`);
        }


        if (!element) {
            return { success: false, message: `No element found for selector: ${data.selector}` }
        }
        const box = await element.boundingBox();
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        // Di chuyển chuột đến vị trí của phần tử
        await page.mouse.move(x, y, { steps: 10 });
        await element.focus();
        if (data.action === 'press-key') {
            let keys = data.keys.split(',');
            await page.keyboard.down(keys[0]);
            if (keys.length > 1) {
                for (i = 1; i < keys.length; i++) {
                    await page.keyboard.press(keys[i]);
                }
            }
            if (data.pressTime > 0) {
                await new Promise(r => setTimeout(r, data.pressTime));  // Thay thế waitForTimeout
            }
            await page.keyboard.up(keys[0]);
        }
        else {
            // for (let char of data.keysToPress) {
            //     await page.keyboard.press(char);
            //     if (data.pressTime > 0) {
            //         await new Promise(r => setTimeout(r, data.pressTime));  // Thay thế waitForTimeout
            //     }
            // }
            await page.keyboard.type(data.keysToPress, { delay: data.pressTime })
        }

        return { success: true, message: "success" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
