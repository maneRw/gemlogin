module.exports.handlerCloseTab = async ({ page, data, browser, pageIndex }) => {
    try {
        if (data.param.closeType == 'tab') {
            if (data.param.activeTab) {
                await page.close()
            }
            else {
                let pages = await browser.pages();
                pages.forEach(async (c) => {
                    const url = await c.url();
                    if (url.indexOf(data.param.url)>-1) {
                        await c.close();
                    }
                })
            }
    
        }
        else {
            if (data.param.allWindows) {
                await browser.close();
            }
            else {
                let pages = await browser.pages();
                let i=0;
                for (const element of pages) {
                    if(i!=pageIndex){
                        await element.close();
                    }
                    i++;
                }
            }
    
        }
        return { success: true, message: "success" };
    } catch (error) {
        return { success: false, message: error.message }
    }


}