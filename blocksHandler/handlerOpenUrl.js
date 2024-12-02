const { installMouseHelper } = require('./mousehelper')
module.exports.handlerOpenUrl = async ({ page, data, browser, pageIndex }) => {
  try {
    let options = data.param.options;
    if (options.newTab) {
      page = await browser.newPage();
      await installMouseHelper(page);
      pageIndex = (await browser.pages()).length - 1;
    }
    if (options.customUserAgent) {
      await page.setUserAgent(options.userAgent);
    }
    if (options.active) {
      await page.bringToFront();
    }
    // await page.goto(options.url, { waitUntil: 'load', timeout: 30000 });
    await page.goto(options.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    return { success: true, message: "success", page: page, pageIndex: pageIndex }
  } catch (error) {
    return { success: false, message: error.message, page: page, pageIndex: pageIndex }
  }
}

// const { installMouseHelper } = require('./mousehelper');
// module.exports.handlerOpenUrl = async ({ page, data, browser, pageIndex }) => {
//   try {
//     let options = data.param.options;

//     // Kiểm tra options.newTab và tạo trang mới
//     if (options.newTab) {
//       page = await browser.newPage();
//       await installMouseHelper(page);
//       pageIndex = (await browser.pages()).length - 1;
//     }

//     // Kiểm tra và set user agent
//     if (options.customUserAgent) {
//       console.log("Setting custom user agent: ", options.userAgent);
//       await page.setUserAgent(options.userAgent);
//     }

//     // Đưa trang ra trước nếu cần
//     if (options.active) {
//       await page.bringToFront();
//     }

//     // Kiểm tra xem trang có còn mở trước khi gọi goto
//     if (!page.isClosed()) {
//       console.log("Navigating to URL:", options.url);
//       await page.goto(options.url, { waitUntil: 'load', timeout: 50000 });
//     } else {
//       throw new Error("Page is closed unexpectedly.");
//     }

//     return { success: true, message: "success", page: page, pageIndex: pageIndex }
//   } catch (error) {
//     console.error("Error opening URL: ", error.message);
//     return { success: false, message: error.message, page: page, pageIndex: pageIndex }
//   }
// }

