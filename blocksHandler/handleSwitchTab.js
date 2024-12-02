module.exports.handleSwitchTab = async ({ page, data, browser, pageIndex }) => {
    try {
        let pages = await browser.pages();
        switch (data.param.findTabBy) {
            case "tab-index": {
                const tabIndex = data.param.tabIndex;
                if (tabIndex < pages.length) {
                    page = pages[tabIndex];
                    if (data.param.activeTab) {
                        page.bringToFront();
                    }
                    return { success: true, message: "success", page: page, pageIndex: tabIndex }
                }
                else {
                    return { success: false, message: "Not found tab index " + data.param.tabIndex, page: page, pageIndex };
                }
            }
            case "tab-title": {
                let titles = await Promise.all(
                    pages.map(async (page) => {
                        const title = await page.title();
                        return { page, title };
                    })
                );
                let index = titles.findIndex(c => c.title === data.param.tabTitle);
                if (index > -1) {
                    page = titles[index].page;
                } else {
                    if (data.param.createIfNoMatch) {
                        page = await browser.newPage();
                        await page.goto(data.param.url);
                        index = (await browser.pages()).length - 1;
                    } else {
                        return { success: false, message: "Not found page title " + data.param.tabTitle, page: page, pageIndex };
                    }
                }
                if (data.param.activeTab) {
                    page.bringToFront();
                }
                return { success: true, message: "success", page: page, pageIndex: index };
            }
            case "next-tab": {
                let nextTab = pageIndex + 1;
                page = pages[nextTab];
                if (data.param.activeTab) {
                    page.bringToFront();
                }
                return { success: true, message: "success", page: page, pageIndex: nextTab };
            }
            case "match-patterns": {
                let urls = await Promise.all(
                    pages.map(async (page) => {
                        const url = await page.url();
                        return { page, url };
                    })
                );
                let index = urls.findIndex(c => c.url.includes(data.param.matchPattern));
                if (index > -1) {
                    page = urls[index].page;
                } else {
                    if (data.param.createIfNoMatch) {
                        page = await browser.newPage();
                        await page.goto(data.param.url);
                        index = (await browser.pages()).length - 1;
                    } else {
                        return { success: false, message: "Not found page matchPattern " + data.param.matchPattern, page, pageIndex };
                    }
                }
                if (data.param.activeTab) {
                    page.bringToFront();
                }
                return { success: true, message: "success", page: page, pageIndex: index };
            }
            case "prev-tab": {
                let prevTab = pageIndex - 1;
                page = pages[prevTab];
                if (data.param.activeTab) {
                    page.bringToFront();
                }
                return { success: true, message: "success", page: page, pageIndex: prevTab };
            }
        }
    } catch (error) {
        return { success: false, message: error.message, page, pageIndex }
    }

}