module.exports.handlerGetText = async (iframe, page, findBy, selectorValue, options, flags, prefix = null, suffix = null) => {
    try {
        const { multiple = false, markElement = false, waitForSelector = false, selectorTimeout = 5000, includeHtmlTag = false, useTextContent = false } = options;
        let elements = [];
        let context = iframe || page;
        if (waitForSelector) {
            if (findBy === "cssSelector") {
                await context.waitForSelector(selectorValue, { timeout: selectorTimeout });
            } else {
                await context.waitForSelector(`xpath/${selectorValue}`, { timeout: selectorTimeout });
            }
        }

        if (findBy === "cssSelector") {
            if (multiple) {
                elements = await context.$$(selectorValue);
            } else {
                elements = [await context.$(selectorValue)];
            }
        } else if (findBy === "xpath") {
            if (multiple) {
                elements = await context.$$(`xpath/${selectorValue}`);
            } else {
                elements = [await context.$(`xpath/${selectorValue}`)];
            }
        }



        if (!elements || elements.length === 0) {
            return { success: false, message: 'element not found' }
        }

        const texts = [];

        for (let element of elements) {
            if (!element) return { success: false, message: 'element not found' }
            // Kiểm tra xem element có phải là một phần tử hợp lệ không
            if (element && typeof element.boundingBox === 'function') {
                const box = await element.boundingBox();

                if (box) {
                    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
                } else {
                    return { success: false, message: 'bounding box not found' }
                }
            } else {
                return { success: false, message: 'Invalid element' }
            }

            if (markElement) {
                if (iframe) {
                    await iframe.evaluate(el => {
                        el.style.border = '2px solid red';
                    }, element);
                }
                else {
                    await context.evaluate(el => {
                        el.style.border = '2px solid red';
                    }, element);
                }

            }

            // Lấy nội dung từ element dựa trên tùy chọn useTextContent hoặc includeHtmlTag
            let text;
            if (includeHtmlTag) {
                text = await context.evaluate(el => el.outerHTML, element); // Lấy cả thẻ HTML
            } else if (useTextContent) {
                text = await context.evaluate(el => el.textContent.trim(), element); // Lấy textContent
            } else {
                text = await context.evaluate(el => el.innerText.trim(), element); // Lấy innerText
            }



            if (flags) {
                const regex = new RegExp(flags, 'g');
                const matches = text.match(regex);

                if (matches) {
                    for (const match of matches) {
                        // Thêm prefix và suffix vào từng phần khớp
                        texts.push(`${prefix || ''}${match}${suffix || ''}`);
                    }
                }
            } else {
                // Nếu không có flags, thêm văn bản gốc với prefix và suffix
                texts.push(`${prefix || ''}${text}${suffix || ''}`);
            }
        }

        return { success: true, message: "success", data: multiple ? texts : texts[0] }; // Trả về 1 phần tử hoặc mảng phần tử

    } catch (error) {
        return { success: false, message: `Error: ${error.message}` };

    }
}