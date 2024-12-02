const fs = require('fs');
const { google } = require('googleapis');

module.exports.handlerSpreadSheet = async function (action, data) {
    try {
        // Đọc tệp thông tin xác thực
        const credentials = JSON.parse(fs.readFileSync(data.path, 'utf8'));

        // Xác thực với Google API
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Khởi tạo Google Sheets API
        const sheets = google.sheets({ version: 'v4', auth });

        // Tạo phạm vi hoàn chỉnh nếu có sheetName
        // const completeRange = sheetName ? `${sheetName}!${data.range}` : data.range;
        const completeRange = data.range;

        // Kiểm tra loại hành động
        switch (action.toLowerCase()) {
            case 'get':
            case 'getrange':
                // Lấy giá trị từ ô hoặc phạm vi
                const getResponse = await sheets.spreadsheets.values.get({
                    spreadsheetId: data.spreadsheetId,
                    range: completeRange,
                });

                return { success: true, message: "success", data: getResponse.data.values };

            case 'update':
                let body = JSON.parse(data.options.body);
                let values = body.values;
                console.log("value =>", values, typeof values);

                if (!Array.isArray(values)) {
                    if (typeof values === "string") {
                        // Nếu values là một chuỗi, chuyển đổi nó thành mảng với một phần tử
                        console.log(Object.keys(values).map((key) => [key, values[key]]));
                        // values = [[values]];
                    } else if (typeof values === "object") {
                        // Nếu values là một đối tượng, chuyển đổi thành mảng của các cặp key-value
                        values = Object.keys(values).map((key) => [key, values[key]]);
                    } else {
                        throw new Error("Invalid data format: values must be an array, string, or object.");
                    }
                }

                if (data.append) {
                    let insertDataOption = data.options.queries.insertDataOption;
                    let valueInputOption = data.options.queries.valueInputOption;
                    console.log(data.options.queries);

                    console.log(valueInputOption);

                    // Thêm giá trị vào ô
                    if (!values || values.length === 0) {
                        throw new Error('Input data is required for append action.');
                    }
                    // Kiểm tra xem cần thêm hay ghi đè (sử dụng 'update' để ghi đè lên một phạm vi cụ thể)
                    if (insertDataOption === 'OVERWRITE') {

                        // Sử dụng update để ghi đè lên dữ liệu hiện tại
                        await sheets.spreadsheets.values.update({
                            spreadsheetId: data.spreadsheetId,
                            range: completeRange,
                            valueInputOption: valueInputOption,
                            requestBody: {
                                values: values,
                            },
                        });

                        return { success: true, message: "success" }

                    } else if (insertDataOption === 'INSERT_ROWS') {
                        // Sử dụng append để thêm dữ liệu vào dòng mới
                        await sheets.spreadsheets.values.append({
                            spreadsheetId: data.spreadsheetId,
                            range: completeRange,
                            valueInputOption: valueInputOption,
                            insertDataOption: 'INSERT_ROWS',
                            requestBody: {
                                values: values,
                            },
                        });

                        return { success: true, message: "success" }

                    } else {
                        throw new Error('Invalid insertDataOption. Please use "OVERWRITE" or "INSERT_ROWS".');
                    }
                } else {
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: data.spreadsheetId,
                        range: completeRange,
                        valueInputOption: data.options.queries.valueInputOption,
                        requestBody: {
                            values: values,
                        },
                    });

                    return { success: true, message: "success" }
                }

            case 'clear':
                // Xóa giá trị trong ô
                await sheets.spreadsheets.values.clear({
                    spreadsheetId: data.spreadsheetId,
                    range: completeRange,
                });

                return { success: true, message: "success" }

            default:
                throw new Error('Invalid action.');
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}