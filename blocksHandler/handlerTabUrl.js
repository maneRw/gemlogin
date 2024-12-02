module.exports.handlerTabUrl = async (browser, page, data) => {
    try {
        let urls = [];
        if (data.type == "active-tab") {
            let url = await page.url();
            urls=url;
        }
        else {
            let pages = await browser.pages();
            let arrPage = [];
            for (const element of pages) {
                let url = await element.url();
                let title = await element.title();
                arrPage.push({ url, title });

            }
            if (data.qMatchPatterns) {
                arrPage = arrPage.filter(c => c.url.indexOf(data.qMatchPatterns) > -1);
            }
            if (data.qTitle) {
                arrPage = arrPage.filter(c => c.title.indexOf(data.qTitle) > -1);
            }
            urls = arrPage.map(c => c.url);
        }
        return { success: true, message: "success", data: urls }
    } catch (error) {
        return { success: false, message: error.message }
    }


}