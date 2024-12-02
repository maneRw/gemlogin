module.exports.handlerMouseScroll = async function (iframe, page, data) {
    const {
        findBy = 'cssSelector',
        selector = '',
        multiple = false,
        markEl = false,
        waitForSelector = false,
        waitSelectorTimeout = 3000,
        scrollX = 0,
        scrollY = 0,
        scrollIntoView = false,
        smooth = false,
        incX = false,
        incY = false,
    } = data;

    let elements = [];
    const context = iframe || page;
    try {

        // Chờ phần tử nếu cần
        if (waitForSelector) {
            // Tìm phần tử theo css hoặc xpath
            if (findBy === 'cssSelector') {
                await context.waitForSelector(selector, { timeout: waitSelectorTimeout });
            } else if (findBy === 'xpath') {
                await context.waitForSelector(`xpath/${selector}`, { timeout: waitSelectorTimeout });
            }

        }

        // Tìm phần tử dựa trên css hoặc xpath
        if (findBy === 'cssSelector') {
            if (multiple) {
                elements = await context.$$(selector); // Sử dụng $$ để tìm nhiều phần tử
            } else {
                elements = [await context.$(selector)]; // Đặt phần tử vào mảng để xử lý đồng nhất
            }
        } else if (findBy === 'xpath') {
            if (multiple) {
                elements = await context.$$(`xpath/${selector}`);
            } else {
                elements = [await context.$(`xpath/${selector}`)];
            }
        }

        for (let element of elements) {
            if (!element) return { sucess: false, message: 'element not found' };

            // Kiểm tra xem element có phải là một phần tử hợp lệ không
            const box = await element.boundingBox();
            if (box) {
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
            } else {
                return { success: false, message: 'bounding box not found' }
            }


            // Đánh dấu phần tử nếu được yêu cầu
            if (markEl) {
                if (element) {
                    await context.evaluate(el => {
                        if (el) el.style.border = '2px solid red';
                    }, element);
                }
            }

            // Cuộn phần tử vào tầm nhìn nếu tùy chọn được kích hoạt
            if (scrollIntoView) {
                await context.evaluate((el, smooth) => {
                    if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center', inline: 'center' });
                }, element, smooth);
            } else {
                if (incX || incY) {
                    const horizontalStep = incX ? scrollX : 0;
                    const verticalStep = incY ? scrollY : 0;

                    await context.evaluate((horizontalStep, verticalStep, smooth) => {

                        window.scrollBy({
                            left: horizontalStep,
                            top: verticalStep,
                            behavior: smooth ? 'smooth' : 'auto'
                        });

                    }, horizontalStep, verticalStep, smooth);
                } else {
                    // Cuộn trang đến vị trí cụ thể nếu không phải cuộn theo phần tử
                    await context.evaluate((scrollHorizontal, scrollVertical, smooth) => {
                        window.scrollBy({
                            left: scrollHorizontal,
                            top: scrollVertical,
                            behavior: smooth ? 'smooth' : 'auto'
                        });
                    }, scrollX, scrollY, smooth);
                }
            }
        }
        return { success: true, message: 'Success' };
    } catch (error) {
        return { success: false, message: `Error: ${error.message}` };
    }
}