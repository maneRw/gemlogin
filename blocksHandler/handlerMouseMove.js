module.exports.handlerMouseMove = async function (iframe, page, selectorType = 'cssSelector', selectorValue, options) {
    try {
        let elements = [];
        let context = iframe || page;
        let {
            x = null,
            y = null,
            waitForSelector = false,
            waitSelectorTimeout = 5000,
            markElement = false,
            multiple = false
        } = options;

        if (selectorType === 'coordinate') {
            // Trường hợp tọa độ x, y
            if (x !== null && y !== null) {
                await page.mouse.move(x, y, { steps: 10 });
            } else {
                return { success: false, message: 'Cần truyền tọa độ (x, y) cho selectorType coordinate.' };
            }
        } else if (selectorType === 'cssSelector' || selectorType === 'xpath') {

            if (!selectorValue) {
                return { success: false, message: 'Cần truyền selectorValue cho selectorType' }
            }

            // Chờ phần tử nếu cần
            if (waitForSelector) {
                try {

                    if (selectorType === 'cssSelector') {
                        await context.waitForSelector(selectorValue, { timeout: waitSelectorTimeout });
                    } else if (selectorType === 'xpath') {
                        await context.waitForSelector(`xpath/${selectorValue}`, { timeout: waitSelectorTimeout });
                    }

                } catch (error) {
                    return { success: false, message: "Element not found" }
                }
            }

            if (selectorType === 'xpath') {
                if (multiple) {
                    elements = await context.$$(`xpath/${selectorValue}`);
                } else {
                    elements = [await context.$(`xpath/${selectorValue}`)];
                }


            } else if (selectorType === 'cssSelector') {
                if (multiple) {
                    elements = await context.$$(selectorValue);
                } else {
                    const element = await context.$(selectorValue);
                    elements.push(element);
                }

            }
            for (let elem of elements) {
                if (!elem) return { sucess: false, message: 'element not found' };

                const isVisible = await elem.isVisible(); // Phương thức kiểm tra hiển thị

                if (!isVisible) {
                    return { success: false, message: `Element is not visible` };
                }

                const box = await elem.boundingBox();
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });

                if (markElement) {
                    await context.evaluate((elem) => {
                        elem.style.border = '2px solid red';
                    }, elem);
                }
            }
        } else {
            return { success: false, message: "Invalid selector type" }
        }

        return { success: true, message: "success" }
    } catch (error) {
        return { success: false, message: `Error: ${error.message}` };

    }
}