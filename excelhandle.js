const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');
module.exports.excelhandle = async (data) => {
    try {
        let path = data.params.path;

        // Trước khi mở file, kiểm tra xem file có tồn tại không
        if (!fs.existsSync(path)) {
            return { success: false, message: "File not found" };
        }

        let range = data.params.range;
        let arrRange = range.split("!");
        const workbook = await XlsxPopulate.fromFileAsync(path);
        let workSheetRange;

        if (arrRange.length == 1) {
            if (arrRange[0].indexOf(":") == -1) {
                workSheetRange = workbook.sheet(arrRange[0]).usedRange();
            }
            else {
                workSheetRange = workbook.sheet(0).range(arrRange[0]);
            }
        }
        else {
            workSheetRange = workbook.sheet(arrRange[0]).range(arrRange[1]);

        }

        switch (data.type) {
            case "getRange":
            case "getAll": {
                let value = workSheetRange.value();
                return { values: value };
            };
            case "clearRange": {
                workSheetRange.clear();
                workbook.toFileAsync(path);
                return { success: true };

            }
            case "update": {

                let body = JSON.parse(data.params.options.body);
                let values = body.values;

                if (!Array.isArray(values)) {
                    if (typeof (values) == "string") {
                        console.log(Object.keys(values).map((key) => [key, values[key]]));
                        // values = [[values]];
                    }
                    else {
                        values = Object.keys(values).map((key) => [key, values[key]]);
                    }
                }

                const sheet = workbook.sheet(arrRange[0]) || workbook.sheet(0);

                if (data.params.append) {

                    // Xử lý khi append được chọn
                    let insertOption = data.params.options.queries.insertDataOption;

                    if (insertOption === 'INSERT_ROWS') {
                        if (!workSheetRange) {
                            // Sheet trống, thêm dữ liệu vào vị trí chỉ định
                            if (arrRange.length > 1 && arrRange[1]) {
                                targetCell = sheet.range(arrRange[1]).startCell();
                            } else {
                                targetCell = sheet.cell(1, 1);
                            }
                        } else {
                            // Sheet có dữ liệu, xác định ô cuối cùng và thêm dữ liệu
                            const lastRow = workSheetRange.endCell('down').rowNumber();
                            targetCell = sheet.cell(lastRow + 1, workSheetRange.startCell().columnNumber());
                        }

                        targetCell.value(values);
                    } else if (insertOption === 'OVERWRITE') {
                        // Ghi đè dữ liệu lên vị trí chỉ định
                        if (!workSheetRange || workSheetRange.value().length === 0) {
                            // Sheet trống hoặc vùng không có dữ liệu, ghi dữ liệu vào ô A1
                            const targetCell = sheet.cell(1, 1);
                            targetCell.value(values);
                        } else {
                            // Mở rộng vùng range để phù hợp với kích thước dữ liệu mới
                            const startCell = workSheetRange.startCell();
                            const endRow = startCell.rowNumber() + values.length - 1;
                            const endCol = startCell.columnNumber() + values[0].length - 1;
                            const rangeToOverwrite = sheet.range(startCell.address(), sheet.cell(endRow, endCol).address());

                            // Ghi đè toàn bộ dữ liệu
                            rangeToOverwrite.value(values);
                        }
                    }

                } else {
                    // Khi append = false, xử lý giống như OVERWRITE
                    if (!workSheetRange || workSheetRange.value().length === 0) {
                        // Sheet trống hoặc vùng không có dữ liệu, ghi dữ liệu vào ô A1
                        const targetCell = sheet.cell(1, 1);
                        targetCell.value(values);
                    } else {
                        // Mở rộng vùng range để phù hợp với kích thước dữ liệu mới
                        const startCell = workSheetRange.startCell();
                        const endRow = startCell.rowNumber() + values.length - 1;
                        const endCol = startCell.columnNumber() + values[0].length - 1;
                        const rangeToOverwrite = sheet.range(startCell.address(), sheet.cell(endRow, endCol).address());

                        // Ghi đè toàn bộ dữ liệu
                        rangeToOverwrite.value(values);
                    }
                }

                await workbook.toFileAsync(path);
                return { success: true, message: "Update successful" };
            }
        }

    } catch (error) {
        return { success: false, message: `Error: ${error.message}` };
    }

}