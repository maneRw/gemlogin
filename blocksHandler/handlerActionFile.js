const fs = require('fs');
const path = require('path');
module.exports.handelrActionFile = (action, filePath, inputData = "", selectorType, writeMode, appendMode, delimiter = ',') => {
    // Chuẩn hóa đường dẫn file
    try {
        const fullPath = path.resolve(filePath);

        if (action === 'Delete') {
            // Xóa file
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                return { success: true, message: "success" }
            } else {
                return { success: false, message: `File not found: ${fullPath}` }
            }
        } else if (action === 'Write') {
            let dataToWrite = '';
    
            if (selectorType === 'txt') {
                dataToWrite = inputData;
            } else if (selectorType === 'csv') {
                // Đối với CSV, cần phải định dạng dữ liệu với delimiter
                if (Array.isArray(inputData)) {
                    dataToWrite = inputData.map(row => row.join(delimiter)).join('\n');
                } else {
                    return { success: false, message: 'Input data for CSV must be an array of arrays.' };
                }
            } else if (selectorType === 'json') {
                dataToWrite = JSON.stringify(inputData, null, 2);
            } else {
                return { success: false, message: 'Unsupported selector type' };
            }
    
            if (writeMode === 'overwrite') {
                fs.writeFileSync(fullPath, dataToWrite, 'utf8');
            } else if (writeMode === 'append') {
                let existingData = '';
    
                if (fs.existsSync(fullPath)) {
                    existingData = fs.readFileSync(fullPath, 'utf8');
                }
    
                if (appendMode === 'newLine') {
                    fs.appendFileSync(fullPath, (existingData ? '\n' : '') + dataToWrite, 'utf8');
                } else if (appendMode === 'sameLine') {
                    if (selectorType === 'txt' || selectorType === 'csv') {
                        fs.appendFileSync(fullPath, (existingData ? delimiter : '') + dataToWrite, 'utf8');
                    } else {
                        fs.appendFileSync(fullPath, (existingData ? '\n' : '') + dataToWrite, 'utf8');
                    }
                } else {
                    return { success: false, message: 'Unsupported append mode' };
                }
            }
            return { success: true, message: "success" }
        }
    } catch (error) {
        return {success:false,message:error.message}
    }

}