module.exports.handlerLink = async (iframe, page, findBy, selectorValue, options) => {
    try {
        let element;
        const context = iframe || page;

        const { markElement = false, waitForSelector = false, selectorTimeout = 5000, openLinkInNewTab = false } = options;

        if (waitForSelector) {
            if (findBy === "cssSelector") {
                await context.waitForSelector(selectorValue, { timeout: selectorTimeout });
            } else {
                await context.waitForSelector(`xpath/${selectorValue}`, { timeout: selectorTimeout });
            }
        }

        if (findBy === "cssSelector") {
            element = await context.$(selectorValue);
        } else if (findBy === "xpath") {
            element = await context.$(`xpath/${selectorValue}`);
        }

        if (!element) {
            return { success: false, message: 'element not found' }
        }

        // Kiểm tra xem element có phải là một phần tử hợp lệ không
        if (element && typeof element.boundingBox === 'function') {
            const box = await element.boundingBox();

            if (box) {
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
            } else {
                return { success: false, message: 'could not get bounding box' };
            }
        } else {
            return { success: false, message: 'element is not valid or boundingBox is not a function' };
        }

        // Kiểm tra xem phần tử có phải là link hay không
        // const tagName = await context.evaluate(el => el.tagName, element);
        // const isLink = tagName.toLowerCase() === 'a' || await context.evaluate(el => el.hasAttribute('href'), element);

        // if (!isLink) {
        //     console.log('Element is not a link');
        //     return 'element is not a link';
        // }

        if (markElement) {
            await context.evaluate(el => {
                el.style.border = '2px solid red';
            }, element);
        }

        if (openLinkInNewTab) {
            await context.evaluate(el => {
                el.target = '_blank';
            }, element);
        }

        await context.evaluate(el => {
            el.click();
        }, element);

        return { success: true, message: 'success' };

    } catch (error) {

        return { success: false, message: `Error: ${error.message}` };

    }
}