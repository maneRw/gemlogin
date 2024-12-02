const fs = require('fs');
const path = require('path');

// Hàm 1: Ghi dữ liệu vào file JSON
function saveData(dirPath, newData) {
    const filePath = path.join(dirPath, 'storage.json');

    let data = {};

    // Nếu file tồn tại, đọc dữ liệu cũ từ file
    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    data = { ...data, ...newData };

    // Ghi lại dữ liệu vào file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getData(dirPath) {

    const filePath = path.join(dirPath, 'storage.json');

    // Kiểm tra nếu file tồn tại và đọc dữ liệu
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }

    // Trả về đối tượng rỗng nếu file không tồn tại
    return {};
}

module.exports = {
    saveData,
    getData
}