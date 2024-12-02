// module.exports.handlerCookie = async function (page, action, options) {

//     try {
//         switch (action) {
//             case 'get':
//                 if (options.useJsonFormat) {
//                     // Nếu useJsonFormat là true, phân tích JSON để lọc cookies
//                     const jsonCookies = options.json;
//                     const allCookies = await page.cookies();

//                     const filteredCookies = allCookies.filter(cookie => {
//                         return jsonCookies.some(jsonCookie =>
//                             (!jsonCookie.Name || cookie.name === jsonCookie.Name) &&
//                             (!jsonCookie.Path || cookie.path === jsonCookie.Path) &&
//                             (!jsonCookie.Domain || cookie.domain === jsonCookie.Domain) &&
//                             (jsonCookie.secure === undefined || cookie.secure === jsonCookie.secure)
//                         );
//                     });

//                     // Trả về các cookies đã lọc
//                     return { success: true, data: filteredCookies, message: 'success' };

//                 } else {

//                     if (options.getAllCookies) {
//                         // Lấy tất cả các cookie từ trang hiện tại và lọc theo các trường được yêu cầu
//                         const allCookies = await page.cookies();

//                         const filteredCookies = allCookies.filter(cookie => {
//                             let match = true;

//                             // Lọc theo tên nếu có
//                             if (options.Name) {
//                                 match = match && cookie.name === options.Name;
//                             }

//                             // Lọc theo đường dẫn nếu có
//                             if (options.Path) {
//                                 match = match && cookie.path === options.Path;
//                             }

//                             // Lọc theo domain nếu có
//                             if (options.Domain) {
//                                 match = match && cookie.domain === options.Domain;
//                             }

//                             match = match && cookie.secure === options.secure;

//                             return match;
//                         });

//                         return { success: true, data: filteredCookies, message: 'success' };

//                     } else {
//                         // Khi getAllCookies là false, chỉ lọc theo URL, Name và Path
//                         const allCookies = await page.cookies(options.url);

//                         const filteredCookies = allCookies.filter(cookie => {
//                             let match = true;

//                             // Lọc theo tên
//                             if (options.Name) {
//                                 match = match && cookie.name === options.Name;
//                             }

//                             // Lọc theo đường dẫn (optional)
//                             if (options.Path) {
//                                 match = match && cookie.path === options.Path;
//                             }

//                             return match;
//                         });

//                         return { success: true, data: filteredCookies, message: 'success' };
//                     }
//                 }

//             case 'set':
//                 // Thiết lập cookie
//                 if (options.useJsonFormat) {
//                     const cook = options.json;
//                     await page.setCookie(cook);

//                 } else {
//                     const cookie = {
//                         url: options.url,
//                         name: options.Name,
//                         value: options.Value,
//                         path: options.Path,
//                         domain: options.Domain,
//                         sameSite: options.sameSite,
//                         expires: options.expirationDate ? Date.now() / 1000 + (+options.expirationDate) : undefined,
//                         httpOnly: options.httpOnly,
//                         secure: options.secure,
//                     };
//                     await page.setCookie(cookie);
//                 }

//                 return { success: true, message: 'success' };

//             case 'remove':
//                 // Xóa cookie
//                 if (options.useJsonFormat) {
//                     const cookiesToRemove = options.json;
//                     await page.deleteCookie(cookiesToRemove);
//                     return { success: true, message: 'success' };
//                 } else {
//                     const cookie = {
//                         name: options.Name,
//                         path: options.Path || '/',  // Cung cấp path mặc định nếu không có
//                     };

//                     // Kiểm tra nếu có URL, lấy tất cả cookie theo URL và xóa cookie mong muốn
//                     const cookiesToDelete = await page.cookies(options.url);

//                     const targetCookie = cookiesToDelete.find(c => c.name === cookie.name && c.path === cookie.path);

//                     if (targetCookie) {
//                         await page.deleteCookie(targetCookie);
//                         return { success: true, message: 'success' };
//                     } else {
//                         return { success: false, message: 'Không tìm thấy cookie cần xóa' };
//                     }
//                 }

//             default:
//                 return { success: false, message: 'Unknown action: ' + action };
//         }
//     } catch (error) {
//         // Bắt lỗi nếu có bất kỳ lỗi nào xảy ra
//         return { success: false, message: 'An error occurred: ' + error.message };
//     }
// };

module.exports.handlerCookie = async function (page, action, options) {
    try {
        switch (action) {
            case 'get':
                const allCookies = await page.cookies();

                let filteredCookies = allCookies;

                // Nếu có domain, lọc cookie theo domain
                if (options.domain) {
                    filteredCookies = allCookies.filter(cookie => cookie.domain.includes(options.domain));
                }

                if (options.typeData !== 'json') {
                    // Chuyển đổi cookie thành chuỗi string
                    const cookieString = filteredCookies
                        .map(cookie => `${cookie.name}=${cookie.value}`)
                        .join(';');

                    return { success: true, data: cookieString };
                }

                // Trả về dữ liệu dưới dạng JSON
                return { success: true, data: JSON.stringify(filteredCookies), message: 'success' };
            case 'set':
                if (options.typeData !== 'json') {
                    // Trường hợp cookieData là chuỗi string
                    const cookies = options.value.split(';').map(cookie => {
                        const [name, ...valueParts] = cookie.split('=');
                        return {
                            name: name.trim(),
                            value: valueParts.join('=').trim(),
                            domain: options.domain || '', // Đặt domain hoặc để trống nếu không có
                            httpOnly: options.httpOnly,
                            secure: options.secure
                        };
                    });

                    // Thiết lập cookie
                    await page.setCookie(...cookies);
                    return { success: true, message: 'Cookies set successfully from string' };
                } else {
                    // Trường hợp cookieData là JSON
                    const cookies = JSON.parse(options.json);

                    // Thiết lập cookie
                    await page.setCookie(...cookies);
                    return { success: true, message: 'Cookies set successfully from JSON' };
                }

            case 'remove':
                const allCookiesForRemoval = await page.cookies();

                // Nếu có domain, lọc và xóa cookie theo domain
                if (options.domain) {
                    const cookiesToDelete = allCookiesForRemoval.filter(cookie => cookie.domain.includes(options.domain));
                    for (const cookie of cookiesToDelete) {
                        await page.deleteCookie({ name: cookie.name, domain: cookie.domain });
                    }
                    return { success: true, message: `Cookies cleared for domain: ${options.domain}` };
                } else {
                    // Nếu không có domain, xóa tất cả cookie
                    await page.deleteCookie(...allCookiesForRemoval);
                    return { success: true, message: 'All cookies cleared' };
                }

            default:
                return { success: false, message: 'Unknown action: ' + action };
        }
    } catch (error) {
        // Bắt lỗi nếu có bất kỳ lỗi nào xảy ra
        return { success: false, message: 'An error occurred: ' + error.message };
    }
};