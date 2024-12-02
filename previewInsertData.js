// backend/previewData.js
const path = require('path');
const fs = require('fs').promises;
const XlsxPopulate = require('xlsx-populate');
const Papa = require('papaparse');

module.exports.previewData = async ({ index, filePath, action, xlsSheet, csvAction }) => {
    try {
        const isExcel = /.xlsx?$/.test(filePath);
        const isJSON = filePath.endsWith('.json');
        const isCSV = filePath.endsWith('.csv');
        const isTxt = filePath.endsWith('.txt'); // Kiểm tra định dạng tệp .txt
        const readAction = action || csvAction || 'default';
        let result;

        // Đọc nội dung tệp dựa trên định dạng
        if (isExcel && readAction.includes('json')) {
            const workbook = await XlsxPopulate.fromFileAsync(filePath);
            const inputtedSheet = (xlsSheet || '').trim();
            const sheetName = workbook.sheets().some(sheet => sheet.name() === inputtedSheet)
                ? inputtedSheet
                : workbook.sheets()[0].name();

            const sheet = workbook.sheet(sheetName);
            const rows = sheet.usedRange().value();
            const headers = rows[0];

            const sheetData = rows.slice(1).map(row => {
                return headers.reduce((obj, header, index) => {
                    obj[header] = row[index];
                    return obj;
                }, {});
            });

            result = JSON.stringify(sheetData, null, 2);
        } else if (isJSON) {
            const content = await fs.readFile(filePath, 'utf-8');
            result = JSON.stringify(JSON.parse(content), null, 2);
        } else if (isCSV) {
            const content = await fs.readFile(filePath, 'utf-8');
            const parsedCSV = Papa.parse(content, { header: readAction.includes('header') });
            result = JSON.stringify(parsedCSV.data || [], null, 2);
        } else if (isTxt) {
            // Đọc tệp .txt
            const content = await fs.readFile(filePath, 'utf-8');
            result = content; // Trả về nội dung tệp văn bản dưới dạng chuỗi
        } else if (readAction === 'base64') {
            const buffer = await fs.readFile(filePath);
            result = buffer.toString('base64');
        } else {
            // Xử lý cho các định dạng tệp khác nếu cần
            throw new Error('Unsupported file type');
        }

        return { itemId: index, data: result };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};
