module.exports.handlerMouseHover = async (iframe, page, data) => {
    try {
        const { findBy, waitForSelector, waitSelectorTimeout, selector, markEl, multiple } = data;
        const selectorTimeout = waitSelectorTimeout;
        const markElement = markEl;
        const selectorType = findBy;

        let elements;

        let context = iframe || page;

        // Chờ phần tử nếu cần
        if (waitForSelector) {
            try {
                if (selectorType === 'css') {
                    await context.waitForSelector(selector, { timeout: selectorTimeout });
                } else if (selectorType === 'xpath') {
                    await context.waitForSelector(`xpath/${selector}`, { timeout: selectorTimeout });
                }

            } catch (error) {
                return { sucess: false, message: error.message };
            }
        }

        // Tìm phần tử dựa trên selector type
        if (selectorType === 'cssSelector') {
            if (multiple) {
                elements = await context.$$(selector); // Sử dụng $$ để tìm nhiều phần tử
            } else {
                elements = [await context.$(selector)]; // Đặt phần tử vào mảng để xử lý đồng nhất
            }
        }
        else {

            if (multiple) {
                elements = await context.$$(`xpath/${selector}`);
            } else {
                elements = [await context.$(`xpath/${selector}`)];
            }

        }


        if (!elements || elements.length === 0) {
            return { sucess: false, message: 'element not found' };
        }

        // Đánh dấu phần tử nếu tùy chọn bật
        if (markElement) {
            for (const element of elements) {
                await context.evaluate(el => {
                    if (el) el.style.border = '2px solid red'; // Đánh dấu bằng đường viền đỏ
                }, element);


            }
        }

        // Di chuyển chuột và kích hoạt sự kiện "mouseover" cho tất cả các phần tử
        for (const element of elements) {
            if (!element) return { sucess: false, message: 'element not found' };
            const box = await element.boundingBox();
            if (box) {
                // Di chuyển chuột đến giữa phần tử
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
                await element.hover();
                // Kích hoạt sự kiện "mouseover"
                // await context.evaluate(el => {
                //     if (el) el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                // }, element);


            } else {
                return { sucess: false, message: 'bounding box not found' };
            }
        }

        return { success: true, message: 'success' };
    } catch (error) {
        return { sucess: false, message: error.message };
    }

}
