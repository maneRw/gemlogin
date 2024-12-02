module.exports.handlerConditions = async (iframe, page, data) => {
    try {


        let context = iframe || page;
        let selector = data.data.selector;
        let type = data.type.split("#");
        if (type[0] == "element") {
            let element;
            if (!isXpath(selector)) {
                element = await context.$(selector);
            }
            else {
                element = await context.$(`xpath/${selector}`);
            }
            switch (type[1]) {
                case "exists":
                case "notExists": {
                    let result = element ? true : false;
                    if (type[1] == "notExists") result = !result;
                    return result;
                }
                case "attribute": {
                    const attributeName = data.data.attrName;
                    if (!attributeName) return null;
                    const value = await context.evaluate((el, attrName) => {
                        return el.getAttribute(attrName);
                    }, element, attributeName);
                    return value;
                }
                case "text": {
                    const text = await context.evaluate(el => el.textContent.trim(), element);
                    return text;
                }
                case "visibleScreen":
                    {
                        if (!element) return null;
                        let result = await element.isIntersectingViewport();
                        return result;
                    }
                case "visible": {
                    if (!element) return null;
                    let result = await element.isVisible();
                    return result;
                }

                case "invisible": {
                    if (!element) return null;
                    let result = await element.isHidden();
                    return result;
                }
            }

        }
    } catch (error) {
        return false;
    }
}

const isXpath = str =>
    /[\/@]/.test(                     // find / or @ in
        str.split(/['"`]/)            // cut on any quote
            .filter((s, i) => !(i % 2)) // remove 1 on 2
            .join('')                 // string without quotes
    )