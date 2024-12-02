module.exports.handlerAttributeValue = async (iframe,page, data) => {
    let { attributeValue, attributeName, findBy, waitForSelector, waitSelectorTimeout, selector, markEl, multiple, action } = data;
    let selectorType = findBy;
    let selectorValue = selector;
    let elements = [];
    let context=iframe||page;
    try {
        

    // Chờ phần tử nếu cần
    if (waitForSelector) {
        try {
            if (selectorType === 'cssSelector') {
                await context.waitForSelector(selectorValue, { timeout: waitSelectorTimeout });
            } else if (selectorType === 'xpath') {
                await context.waitForSelector(`xpath/${selectorValue}`, { timeout: waitSelectorTimeout });
            }
        } catch (error) {
            return { success: false, message: 'element not found ' +selectorValue};
        }
    }

    // Tìm phần tử dựa trên selector type
    if (selectorType === 'cssSelector') {
        if (multiple) {
            elements = await context.$$(selectorValue); // Sử dụng $$ để tìm nhiều phần tử
        } else {
            elements = [await context.$(selectorValue)]; // Đặt phần tử vào mảng để xử lý đồng nhất
        }
    } else if (selectorType === 'xpath') {
        if (multiple) {
            elements = await context.$$(`xpath/${selectorValue}`);
        } else {
            elements = [await context.$(`xpath/${selectorValue}`)];
        }
    }

    if (!elements || elements.length === 0) {
        return { success: false, message: 'element not found ' +selectorValue};
    }

    let results = [];

    for (let element of elements) {

        if (element && typeof element.boundingBox === 'function') {
            const box = await element.boundingBox();

            if (box) {
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
            } else {
                return { success: false, message: 'bounding box not found' };
            }
        } else {
            return { success: false, message: 'Invalid element' };
        }

        if (markEl) {
            if (element) {
                await context.evaluate(el => {
                    if (el) el.style.border = '2px solid red';
                }, element);
            }
        }

        // Thực hiện hành động lấy hoặc đặt giá trị thuộc tính
        if (action === 'get') {
            const value = await context.evaluate((el, attrName) => {
                return el.getAttribute(attrName);
            }, element, attributeName);
            results.push(value);
        } else if (action === 'set') {
            await context.evaluate((el, attrName, attrValue) => {
                el.setAttribute(attrName, attrValue);
            }, element, attributeName, attributeValue);
            results.push('set completed');
        }
    }

    return { success: true, message: 'success', data: results.length > 1 ? results : results[0] };
} catch (error) {
        
}
}