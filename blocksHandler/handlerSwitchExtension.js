
module.exports.handlerSwitchExtensionPopup = async function (
    page,
    mode,
    pageType,
    selectorType,
    selector,
    timeout,
    passwordInputSelector,
    password,
    submitSelector
) {
    try {
        // Kiểm tra chế độ
        if (mode === 'Manual') {
            if (pageType === 'extensionPage') {
                // Tìm tất cả các cửa sổ (tab) hiện có
                const pages = await page.browser().pages();
                // Giả sử cửa sổ popup mới là cửa sổ cuối cùng
                const popup = pages[pages.length - 1];

                console.log('Extension popup page:', popup);

                // Chuyển sang cửa sổ popup
                await popup.bringToFront();

                // Xử lý Extension popup page
                if (selectorType === 'XPath') {
                    await popup.waitForSelector(`xpath/${selector}`, { timeout: timeout * 1000 });
                    const elements = await popup.$x(`xpath/${selector}`);
                    if (elements.length > 0) {
                        await elements[0].click();
                    } else {
                        return { success: false, message: 'Không tìm thấy phần tử với XPath đã cho' };
                    }
                } else if (selectorType === 'CSS') {
                    await popup.waitForSelector(selector, { timeout: timeout * 1000 });
                    await popup.click(selector);
                } else if (selectorType === 'Text') {
                    // Sử dụng cách tiếp cận dựa trên văn bản
                    const elements = await popup.$x(`//button[contains(text(), '${selector}')]`);
                    if (elements.length > 0) {
                        await elements[0].click();
                    } else {
                        return { success: false, message: 'Không tìm thấy phần tử với Text đã cho' };
                    }
                }
            } else if (pageType === 'mainPage') {
                // Xử lý Main page
                await page.waitForSelector(selector, { timeout: timeout * 1000 });
                await page.click(selector);
            }
        } else if (mode === 'Auto') {
            // Nhập mật khẩu nếu có
            if (passwordInputSelector && password) {
                await page.waitForSelector(passwordInputSelector, { timeout: timeout * 1000 });
                await page.type(passwordInputSelector, password);
            }

            // Gửi biểu mẫu nếu có nút submit
            if (submitSelector) {
                await page.waitForSelector(submitSelector, { timeout: timeout * 1000 });
                await page.click(submitSelector);
            } else {
                // Nếu không có nút submit, sử dụng Enter để gửi
                await page.keyboard.press('Enter');
            }
        } else {
            return { success: false, message: 'Mode không hợp lệ' };
        }
        // Nếu tất cả các thao tác đều thành công
        return { success: true, message: 'Thành công' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

