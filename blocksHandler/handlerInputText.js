module.exports.handlerInputText = async function (iframe, page, {
    findBy = 'cssSelector', // 'css' or 'xpath'
    selector = '', // CSS or XPath selector
    value = '', // Value to input or select
    isMultiple = false, // Multiple elements
    markElement = false, // Highlight element
    waitForSelector = false, // Wait for selector
    selectorTimeout = 5000, // Timeout for waiting selector
    getFormValue = true, // Get form value
    formType = 'text', // 'text', 'select', 'radio', 'checkbox'
    textFieldOptions = {
        clearFormValue: true, // Clear form before input
        typingDelay: 0 // Typing delay in ms
    },
    selectOptions = {
        byValue: 'value', // Select by value or position
        clearFormValue: true, // Clear form before selection
        optionPosition: 1, // Position of the option if by position (default = 1)
    },
    radioOptions = {
        selected: true // Default selected for radio
    },
    checkboxOptions = {
        selected: true // Default selected for checkbox
    }
}) {
    // Find elements by selector type (CSS or XPath)
    let elements;

    const context = iframe || page;

    try {
        if (findBy === 'cssSelector') {
            if (waitForSelector) {
                await context.waitForSelector(selector, { timeout: selectorTimeout });
            }
            elements = await context.$$(selector);
        } else if (findBy === 'xpath') {
            if (waitForSelector) {
                await context.waitForSelector(`xpath/${selector}`, { timeout: selectorTimeout });
            }
            elements = [await context.$(`xpath/${selector}`)];
        } else {
            return { success: false, message: 'Invalid selector type' };
        }
    } catch (error) {
        return { success: false, message: `Error finding elements: ${error.message}` };
    }

    if (isMultiple && elements.length === 0) {
        return { success: false, message: 'No elements found' };
    }

    // Process each element (single or multiple)
    const processElement = async (element) => {
        try {
            if (markElement) {
                await context.evaluate(el => el.style.border = '2px solid red', element);
            }

            if (getFormValue) {
                const formValue = await context.evaluate(el => el.value, element);

                return { success: true, message: 'success', data: formValue };
            } else {
                switch (formType) {
                    case 'text-field':
                        if (textFieldOptions.clearFormValue) {
                            await element.evaluate(input=>input.value="");
                        }
                        // Nhập giá trị mới
                        await element.type(value, { delay: textFieldOptions.typingDelay });
                        break;

                    case 'select':
                        if (selectOptions.clearFormValue) {
                            await element.select(''); // Clear selection
                        }

                        if (selectOptions.byValue === 'value') {
                            await element.select(value); // Select by value
                        } else {
                            if (selectOptions.byValue === 'first-option') {
                                await element.select(await element.evaluate(el => el.querySelector('option').value));
                            } else if (selectOptions.byValue === 'last-option') {
                                const options = await element.$$('option');
                                const lastOption = options[options.length - 1];
                                await lastOption.evaluate(option => option.selected = true);
                            } else {
                                const options = await element.$$('option');
                                const option = options[selectOptions.optionPosition - 1];
                                await option.evaluate(option => option.selected = true);
                            }
                        }
                        break;

                    case 'radio':
                        if (radioOptions.selected) {
                            await element.click();
                        }
                        break;

                    case 'checkbox':
                        const isChecked = await context.evaluate(el => el.checked, element);
                        if (isChecked !== checkboxOptions.selected) {
                            await element.click();
                        }
                        break;

                    default:
                        return { success: false, message: 'Invalid form type' };
                }
            }

            return { success: true, message: 'success' }; // Success case without data
        } catch (error) {
            console.log("err =>", error);

            return { success: false, message: error.message }; // Error case
        }
    };

    try {
        if (isMultiple) {
            const results = [];
            for (const element of elements) {
                if (!element) return { success: false, message: 'Element not found' };
                const result = await processElement(element);
                if (!result.success) return result; // Stop if any element fails
                if (getFormValue && result.data) {
                    results.push(result.data); // Collect form values
                }
            }
            return { success: true, message: 'success', data: results }; // Return all values if multiple
        } else {
            if (elements.length > 0) {
                return await processElement(elements[0]);
            } else {
                return { success: false, message: 'Element not found' };
            }
        }
    } catch (error) {
        console.log("err ==>", error);
        return { success: false, message: error.message };
    }
}
