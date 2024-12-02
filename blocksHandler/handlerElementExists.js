module.exports.handlerElementExists = async (iframe, page, findBy, selector, tryFor = 1, timeout = 1000) => {

    const context = iframe || page;

    for (let attempt = 0; attempt < tryFor; attempt++) {
        try {
            let element;
            // Chờ phần tử xuất hiện với timeout quy định
            if (findBy === "cssSelector") {
                await context.waitForSelector(selector, { timeout: timeout });
                element = await context.$(selector);
            } else {
                await context.waitForSelector(`xpath/${selector}`, { timeout: timeout });
                element = await context.$(`xpath/${selector}`);
            }

            // Kiểm tra sự tồn tại của phần tử
            if (element) {
                return { success: true, message: 'success' };
            }
        } catch (error) {
        }
    }
    // Nếu không tìm thấy phần tử sau tất cả các lần thử
    return { success: false, message: 'Element not found '+selector };
}

// module.exports.handlerElementExists = async (iframe, page, findBy, selector, tryFor = 1, timeout = 1000) => {

//     const context = iframe || page;

//     for (let attempt = 0; attempt < tryFor; attempt++) {
//         try {
//             let element;
//             // Chờ phần tử xuất hiện với timeout quy định
//             if (findBy === "cssSelector") {
//                 await context.waitForSelector(selector, { timeout: timeout });
//                 element = await context.$(selector);
//             } else if (findBy === "xpath") {
//                 await context.waitForSelector(`xpath/${selector}`, { timeout: timeout });
//                 element = await context.$(`xpath/${selector}`);
//             } else if (findBy === "text") {
//                 element = await context.evaluateHandle((text) => {
//                     const elements = Array.from(document.body.querySelectorAll("*"));
//                     return elements.find(el => el.innerText.includes(text));
//                 }, selector);
//             }

//             // Kiểm tra sự tồn tại của phần tử
//             if (element) {
//                 return { success: true, message: 'success' };
//             }
//         } catch (error) {
//         }
//     }
//     // Nếu không tìm thấy phần tử sau tất cả các lần thử
//     return { success: false, message: 'Element not found ' + selector };


// }