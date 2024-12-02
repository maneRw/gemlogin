const { spawn } = require('child_process');
async function runCommand(command, waitForOutput = false, outputPattern) {
    return new Promise((resolve, reject) => {
        const cmdProcess = spawn(command, { shell: true });

        let output = '';

        // Ghi nhận đầu ra
        cmdProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Xử lý lỗi
        cmdProcess.stderr.on('data', (data) => {
            // Gửi thông báo lỗi nếu có
            reject({
                success: false,
                message: `Error: ${data.toString()}`.trim() // Chuyển đổi dữ liệu thành chuỗi
            });
        });

        // Khi lệnh hoàn thành
        cmdProcess.on('close', (code) => {

            output = output.trim();


            // Nếu waitForOutput là true, kiểm tra đầu ra với biểu thức chính quy
            if (waitForOutput) {

                if (!outputPattern) {
                    resolve({
                        success: true,
                        message: "success",
                        data: output
                    })
                }

                if (typeof outputPattern === 'string') {
                    outputPattern = new RegExp(outputPattern, 'gim'); // Chuyển đổi từ chuỗi thành RegExp

                }

                const matches = output.match(outputPattern); // Tìm các kết quả khớp

                if (matches) {
                    resolve({
                        success: true,
                        message: "success",
                        data: matches // Trả về kết quả khớp đầu tiên

                    });
                } else {
                    reject({
                        success: false,
                        message: 'Output not match.'
                    });
                }

            } else {
                resolve({
                    success: true,
                    message: "success",
                });
            }
        });
    });
}

module.exports.handlerCmd = async function (command, waitForOutput = false, outputPattern) {
    try {
        const result = await runCommand(command, waitForOutput, outputPattern);
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
}