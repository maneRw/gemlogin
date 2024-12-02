module.exports.handlerCreateElement = async (iframe, page, findBy, selectorValue, options, insertElement, editElement) => {
    try {

        const { waitForSelector = false, selectorTimeout = 5000 } = options;

        let element;

        const context = iframe || page;

        if (waitForSelector) {
            if (findBy === "cssSelector") {
                await context.waitForSelector(selectorValue, { timeout: selectorTimeout });
                element = await context.$(selectorValue);
            } else {
                await context.waitForSelector(`xpath/${selectorValue}`, { timeout: selectorTimeout });
                element = await context.$(`xpath/${selectorValue}`);
            }
        }
        if (!element) return { success: false, message: 'element not found' };

        // Kiểm tra xem element có phải là một phần tử hợp lệ không
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

        // Chèn và chỉnh sửa phần tử theo nội dung của editElement
        await context.evaluate(({ position, editElement }, target) => {
            // Nếu có HTML, thay thế hoặc chèn HTML vào vị trí xác định
            if (editElement.html) {
                switch (position) {
                    case 'before':
                        target.insertAdjacentHTML('afterbegin', editElement.html);
                        break;
                    case 'after':
                        target.insertAdjacentHTML('beforeend', editElement.html);
                        break;
                    case 'prev-sibling':
                        target.insertAdjacentHTML('beforebegin', editElement.html);
                        break;
                    case 'next-sibling':
                        target.insertAdjacentHTML('afterend', editElement.html);
                        break;
                    case 'replace':
                        target.outerHTML = editElement.html;
                        break;
                    default:
                        return { success: false, message: 'Invalid position' };
                }
            }

            // Nếu có CSS, áp dụng CSS vào phần tử
            if (editElement.css) {
                Object.keys(editElement.css).forEach((style) => {
                    target.style[style] = editElement.css[style];
                });
            }

            // Nếu có JS, thực thi mã JavaScript trong phần tử
            if (editElement.js) {
                const script = document.createElement('script');
                script.textContent = editElement.js;
                document.body.appendChild(script);
            }

            // Nếu preloadScripts là một mảng các đối tượng
            if (Array.isArray(editElement.preloadScript)) {

                editElement.preloadScript.forEach(({ src, type }) => {
                    if (type === 'script') {
                        const script = document.createElement('script');
                        script.src = src;
                        script.async = true; // Tải script không đồng bộ
                        document.body.appendChild(script);
                    } else if (type === 'style') {
                        const link = document.createElement('link');
                        link.href = src;
                        link.rel = 'stylesheet'; // Đặt liên kết cho style
                        document.head.appendChild(link);
                    } else {
                        return { success: false, message: 'Invalid type in preloadScripts' };
                    }
                });
            }

        }, { position: insertElement, editElement }, element);

        return { success: true, message: 'success' };

    } catch (error) {

        return { success: false, message: `Error: ${error.message}` };

    }
};
