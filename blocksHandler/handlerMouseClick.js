let isMouseDown = false; // Biến toàn cục để lưu trạng thái chuột

module.exports.handlerMouseClick = async function (iframe, page, selectorType = 'cssSelector', selectorValue, options) {
    try {
        let elements = [];

        let {
            x = null,
            y = null,
            waitForSelector = false,
            waitSelectorTimeout = 5000,
            markElement = false,
            multiple = false,
            clickType = 'leftClick'
        } = options;

        let context = iframe || page;

        if (selectorType === 'coordinate') {
            // Trường hợp tọa độ x, y
            if (x !== null && y !== null) {
                await performClick(null, page, context, x, y, clickType);
            } else {
                return { success: false, message: "invalid coordinates." };
            }
        }
        else if (selectorType === 'cssSelector' || selectorType === 'xpath') {

            if (!selectorValue) {
                return { success: false, message: `invalid selectorValue.` };
            }

            // Chờ phần tử nếu cần
            if (waitForSelector) {
                if (selectorType === 'cssSelector') {
                    await context.waitForSelector(selectorValue, { timeout: waitSelectorTimeout });
                } else if (selectorType === 'xpath') {
                    await context.waitForSelector(`xpath/${selectorValue}`, { timeout: waitSelectorTimeout });
                }
            }

            if (selectorType === 'xpath') {
                elements = multiple ? await context.$$(`xpath/${selectorValue}`) : [await context.$(`xpath/${selectorValue}`)];
            } else if (selectorType === 'cssSelector') {
                elements = multiple ? await context.$$(selectorValue) : [await context.$(selectorValue)];
            }

            for (let elem of elements) {
                if (!elem) return { success: false, message: `element not found` };
                // await elem.scrollIntoView();
                // Kiểm tra xem phần tử có đang hiển thị không
                const isVisible = await elem.isVisible();

                if (!isVisible) {
                    return { success: false, message: `Element is not visible` };
                }
                let isIntersectingViewport = await elem.isIntersectingViewport();
                if (!isIntersectingViewport) {
                    await elem.scrollIntoView();
                    await new Promise(r => setTimeout(r, 1000));
                }

                const box = await elem.boundingBox();
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
                if (markElement) {
                    await context.evaluate((elem) => {
                        elem.style.border = '2px solid red';
                    }, elem);
                }
                await performClick(elem, page, context, box.x + box.width / 2, box.y + box.height / 2, clickType);
            }

        }
        return { success: true, message: "success" };

    } catch (error) {
        console.log(error)
        return { success: false, message: error.message }
    }
}

// Hàm thực hiện thao tác click dựa trên clickType
async function performClick(element, page, context, x, y, clickType) {

    switch (clickType) {
        case 'leftClick':
            if (element) {
                // await element.tap();
                try {
                    await page.realClick(element)
                }
                catch (err) {
                    console.log(err)
                }

            }
            else {
                await page.mouse.click(x, y);
            }
            isMouseDown = false; // Reset trạng thái chuột
            break;
        case 'rightClick':
            await page.mouse.click(x, y, { button: 'right' });
            isMouseDown = false;
            break;
        case 'doubleClick':
            await page.mouse.click(x, y, { clickCount: 2 });
            isMouseDown = false;
            break;
        case 'pressClick':
            if (!isMouseDown) {
                await page.mouse.move(x, y);
                await page.mouse.down();
                isMouseDown = true; // Đánh dấu chuột đang nhấn
            }
            break;
        case 'release':
            if (isMouseDown) {
                await page.mouse.up();
                isMouseDown = false; // Reset trạng thái chuột
            } else {
                throw new Error("'left' is not pressed.");
            }
            break;
        default:
            await page.mouse.click(x, y); // Mặc định là left click
            break;
    }
}
