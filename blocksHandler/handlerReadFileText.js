const fs = require('fs');
module.exports.handlerReadFileText = (data) => {

    {
        if (fs.existsSync(data.path)) {
            return converData(data)
        }
        else {
            return { success: false, message: "file not exist " }
        }
    }
}

function converData(data) {
    let result = fs.readFileSync(data.path, 'utf8');
    let dataLine = result.split("\r\n");

    if (data.mode == 'aline') {
        if (data.randomEnable) {
            result = dataLine[randomInteger(0, dataLine.length - 1)]
        } else {
            result = dataLine[0];
        }

        // Xóa dòng vừa đọc nếu deleteFile = true
        if (data.deleteLine) {

            let resultLine;

            if (typeof (result) == "string") {
                resultLine = result;
            } else {
                resultLine = result.join(data.delimiter);
            }

            // Tìm và xóa dòng đầu tiên trùng khớp với resultLine
            const index = dataLine.indexOf(resultLine);
            if (index !== -1) {
                dataLine.splice(index, 1); // Xóa một dòng tại vị trí index
            }

            // Ghi lại nội dung mới vào tệp
            fs.writeFileSync(data.path, dataLine.join("\r\n"), 'utf8');
        }
    } else {
        result = dataLine;
    }

    if (data.delimiter) {
        if (typeof (result) == "string") {
            result = result.split(data.delimiter);
        }
        else {
            let dataArr = [];
            for (let i = 0; i < result.length; i++) {
                dataArr.push(result[i].split(data.delimiter))
            }
            result = dataArr;
        }
    }

    return { success: true, message: "success", data: result }
}
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}