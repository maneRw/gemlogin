const addPreloadScripts = async (page, preloadScripts) => {
    if (Array.isArray(preloadScripts)) {

        for (const script of preloadScripts) {
            if (typeof script === 'string' && script.startsWith('http')) {
                try {
                    await page.addScriptTag({ url: script });
                } catch (error) {

                    return { success: false, message: `Failed to add preload script from URL: ${script}` }; // Trả về lỗi
                }
            } else {
                return { success: false, message: `Invalid script URL: ${script}. Must be a string starting with 'http'.` }; // Trả về lỗi
            }
        }
        return { success: true, message: "success" }; // Trả về thành công nếu thêm preload scripts
    } else {
        return { success: false, message: 'No preload scripts provided or invalid format.' }; // Trả về lỗi nếu không có preload scripts
    }
};

module.exports.handlerJavascriptCode = async (iframe, page, data, args) => {
    try {
        let context = iframe || page;
        let code = args[0].data.code;
        let automaFunc = args[2];
        let preloadScripts = args[1];

        // Xác định thời gian chờ
        if (data.timeout > 0) {
            await page.setDefaultTimeout(data.timeout);
        }
        // Thực hiện mã dựa trên executionContext
        let result;
        if (data.context === 'website') {

            if (data.runBeforeLoad) {

                await context.evaluateOnNewDocument(code); // Thực hiện trước khi trang được tải
            } else {
                await context.evaluate(automaFunc); // Thực hiện sau khi trang đã tải
                result = await getData(context, code, data.timeout);
            }
        } else if (data.context === 'background') {
            await context.evaluate(automaFunc); // Thực hiện sau khi trang đã tải
            result = await getData(context, code, data.timeout);
        }
        console.log("result", result);

        // Thực thi preloadScripts nếu có
        const preloadResult = await addPreloadScripts(page, preloadScripts);

        if (!preloadResult.success) {
            return { success: false, message: preloadResult.message }; // Trả về thông báo lỗi nếu thêm preload scripts thất bại
        }

        // Kiểm tra kết quả từ getData
        if (result.success === false) {
            return { success: false, message: result.message }; // Trả về thông báo lỗi
        }

        return { success: true, message: 'success', data: result.data };

    } catch (error) {
        return { success: false, message: 'An error occurred: ' + error.message };
    }
};
async function getData(context, code, timeoutDuration = 10000) {
    console.log(typeof timeoutDuration); // Ghi log kiểu dữ liệu của timeoutDuration

    // Thực hiện mã ngay lập tức với thời gian trễ 500ms
    setTimeout(async () => {
        await context.evaluate((code) => { eval("(async () => {" + code + "})()") }, code);
    }, 500);

    return await context.evaluate((timeoutDuration) => {

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                resolve({ success: false, message: "time out" });
            }, timeoutDuration);

            window.addEventListener("__automa-next-block__", async function (event) {
                clearTimeout(timeout);
                resolve({ success: true, data: event.detail });
            });
        });
    }, timeoutDuration); // Truyền timeoutDuration vào đây
}

// async function getData(context, code) {
//     try {
//         setTimeout(async () => {
//             await context.evaluate(code);
//         }, 500)
//     }
//     catch (err) {
//         console.log("err", err.message)
//     }
//     return await context.evaluate(() => {
//         return new Promise((resolve, reject) => {
//             let timeout = setTimeout(() => { resolve({ message: "time out" }) }, 10000);
//             window.addEventListener("__automa-next-block__", async function (event) {
//                 clearTimeout(timeout);
//                 resolve(event.detail);
//             })
//         })
//     });
// }

// async function getData(context, code) {
//     setTimeout(async () => {
//         // console.log(code)
//         await context.evaluate((code) => { eval("(async () => {" + code + "})()") }, code);
//     }, 500)
//     return await context.evaluate(() => {
//         return new Promise((resolve, reject) => {
//             let timeout = setTimeout(() => { resolve({ message: "time out" }) }, 10000);
//             window.addEventListener("__automa-next-block__", async function (event) {
//                 clearTimeout(timeout);
//                 resolve(event.detail);
//             })
//         })
//     });
// }

// async function getData(context, code, timeoutDuration = 20000) {
//     // Bắt đầu chạy mã đã cho
//     setTimeout(async () => {
//         await context.evaluate((code) => { eval("(async () => {" + code + "})()") }, code);
//     }, 500);

//     // Tạo Promise để xử lý kết quả từ sự kiện __automa-next-block__
//     const eventPromise = context.evaluate(() => {
//         return new Promise((resolve) => {
//             window.addEventListener("__automa-next-block__", async function (event) {
//                 resolve(event.detail);
//             });
//         });
//     });

//     // Tạo Promise để xử lý thời gian chờ chính xác
//     const timeoutPromise = new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({ success: false, message: "time out" });
//         }, timeoutDuration);
//     });

//     // Sử dụng Promise.race để đảm bảo đợi đúng khoảng thời gian quy định
//     const result = await Promise.race([eventPromise, timeoutPromise]);

//     // Đảm bảo hàm chỉ trả về sau khi đợi đúng khoảng thời gian
//     await new Promise((resolve) => setTimeout(resolve, timeoutDuration));

//     return result;
// }

