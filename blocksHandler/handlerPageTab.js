module.exports.handlerPageTab = async (page,data) => {
    try {
        if (data.type == "goBack") {
            await page.goBack();
        }
        if (data.type == "goForward") {
            await page.goForward();
        }
        if (data.type == "tabReload") {
            await page.reload();
        }
        if (data.type == "activeTab") {
            await page.bringToFront();
        }
        return { success: true, message: "success" }
    }
    catch (err) {
        return { success: false, message: err.message }
    }

}