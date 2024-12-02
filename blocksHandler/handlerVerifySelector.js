module.exports.handlerVerifySelector = async (iframe, page, data) => {
    try {


        let context = iframe || page;
        let elements;
        if (data.findBy === "cssSelector") {
            if (data.multiple) {
                elements = await context.$$(data.selector);
            } else {
                elements = [await context.$(data.selector)];
            }
        } else if (data.findBy === "xpath") {
            if (data.multiple) {
                elements = await context.$$(`xpath/${data.selector}`);
            } else {
                elements = [await context.$(`xpath/${data.selector}`)];
            }
        }

        elements[0].scrollIntoView();
        await new Promise(r => setTimeout(r, 500));
        for (let elem of elements) {
            await context.evaluate(async(el) => {
                const divEl = document.createElement('div');
                divEl.style =
                    'height: 100%; width: 100%; top: 0; left: 0; background-color: rgb(0 0 0 / 0.3); pointer-events: none; position: fixed; z-index: 99999';

                const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgEl.style =
                    'height: 100%; width: 100%; top: 0; left: 0; pointer-events: none; position: relative;';
                divEl.appendChild(svgEl);
                const { left, top, width, height } = el.getBoundingClientRect();
                const rectEl = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'rect'
                );
                rectEl.setAttribute('y', top);
                rectEl.setAttribute('x', left);
                rectEl.setAttribute('width', width);
                rectEl.setAttribute('height', height);
                rectEl.setAttribute('stroke', '#2563EB');
                rectEl.setAttribute('stroke-width', '2');
                rectEl.setAttribute('fill', 'rgba(37, 99, 235, 0.4)');
                svgEl.appendChild(rectEl);
                document.body.appendChild(divEl);
                await new Promise(r => setTimeout(r, 2000));
                divEl.remove();
            }, elem);
        }

    } catch (error) {
        console.log(error)

    }
}