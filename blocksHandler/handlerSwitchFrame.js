module.exports.handlerSwitchFrame = async (iframe, page, data) => {
    try {
        let context = iframe || page;
        let { windowType, findBy, selector } = data;
        let selectorValue = selector;
        if (windowType === 'main-window') {
            await page.mainFrame();
            return { iframe: null, success: true, message: 'success' };
        } else if (windowType === 'iframe') {

            if (!findBy || !selectorValue) {
                return { message: false, message: 'Must provide both findBy and selectorValue when switching to an iframe' };
            }
            let frameElement;
            try {
               // await context.waitForSelector(selectorValue, { timeout: 5000 }); // Wait for iframe to appear
                frameElement = await context.$(selectorValue);
                if (!frameElement) {
                    return { message: false, message: 'Unable to find the iframe with the provided selector' };
                }
            }
            catch (err) {
                try {
                    //await context.waitForSelector(`xpath/${selectorValue}`, { timeout: 20000 }); // Wait for iframe to appear
                    frameElement = await context.$(`xpath/${selectorValue}`);
                    if (!frameElement) {
                        return { message: false, message: 'Unable to find the iframe with the provided selector' };
                    }
                } catch (error) {
                    return { success: false, message: error.message, iframe: null };
                }

            }
            const frame = await frameElement.contentFrame();
            await frame.waitForSelector('body');

            return { iframe: frame, message: "success", success: true };

        }
    } catch (error) {
            return { success: false, message: error.message, iframe: null };
        
    }

};