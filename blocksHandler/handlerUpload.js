module.exports.handlerUpload = async (iframe, page, data) => {
  try {
    let context = iframe || page;
    let element;
    if (data.waitForSelector) {
      if (data.findBy == "xpath") {
        await context.waitForSelector(`xpath/${data.selector}`, { timeout: data.waitSelectorTimeout });
      }
      else {
        await context.waitForSelector(data.selector, { timeout: data.waitSelectorTimeout });
      }
    }
    if (data.findBy == "xpath") {
      element = await context.$(`xpath/${data.selector}`);
    }
    else {
      element = await context.$(data.selector);
    }


    const box = await element.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      element.click()
    ]);
    await fileChooser.accept(data.filePaths);

    return { success: true, message: "success" }
  }
  catch (err) {
    return { message: err.message, success: false }
  }

}
