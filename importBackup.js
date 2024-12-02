
// const fs = require('fs');
// const path = require('path');
// const unzipper = require('unzipper');

// function countZip(zipFilePath) {
//     let arr = [];

//     return unzipper.Open.file(zipFilePath)
//         .then(directory => {
//             directory.files.forEach(file => {
//                 let check = file.path.split('/')[0];
//                 if (!arr.includes(check)) {
//                     arr.push(check);
//                 }
//             });
//             return arr.length || 0;
//         });
// }

// module.exports.importBackup = async function (zipFilePath, destinationDir, Profiles, numberProfile, profileLimit, event) {
//     try {
//         // 1. Kiểm tra tệp có tồn tại và có phần mở rộng .zip không
//         if (!fs.existsSync(zipFilePath)) {
//             return { success: false, message: `The zip file is not found at the link: ${zipFilePath}` };
//         }
//         if (path.extname(zipFilePath) !== '.zip') {
//             return { success: false, message: `Wrong file type. Need a .zip file.` };
//         }

//         let checkDirectory;

//         try {
//             checkDirectory = await unzipper.Open.file(zipFilePath);
//         } catch (err) {
//             return { success: false, message: `The zip file is not valid or broken.` };
//         }

//         // 3. Kiểm tra các thư mục con bên trong tệp ZIP
//         const folderNames = new Set(); // Tập hợp để lưu tên các thư mục con
//         const configFilePaths = new Set(); // Tập hợp để lưu các tệp config.json

//         for (const entry of checkDirectory.files) {
//             const parts = entry.path.split('/');
//             if (parts.length < 2) {
//                 continue; // Bỏ qua các tệp hoặc thư mục không phù hợp
//             }

//             const folderName = parts[0];
//             const fileName = parts[parts.length - 1];

//             // Kiểm tra nếu thư mục con là số
//             if (!/^\d+$/.test(folderName)) {
//                 return { success: false, message: `The zip file is invalid` };
//             }

//             folderNames.add(folderName);

//             // Kiểm tra nếu thư mục con chứa tệp config.json
//             if (fileName === 'config.json') {
//                 configFilePaths.add(folderName);
//             }
//         }

//         // Đảm bảo rằng tất cả các thư mục con đều có tệp config.json
//         for (const folderName of folderNames) {
//             if (!configFilePaths.has(folderName)) {
//                 return { success: false, message: `The zip file is invalid.` };
//             }
//         }

//         // 2. Kiểm tra giới hạn profile
//         if (profileLimit !== -1) {
//             const directoryCount = await countZip(zipFilePath) + numberProfile > profileLimit;

//             if (directoryCount) {
//                 return { success: false, message: `Exceeding the folder limit. Maximum: ${profileLimit}` };
//             }
//         }

//         // Tạo thư mục tạm thời nếu chưa tồn tại
//         const tempDir = path.join(destinationDir, 'temp_extracted');
//         if (!fs.existsSync(tempDir)) {
//             fs.mkdirSync(tempDir, { recursive: true });
//         } else {
//             fs.rmSync(tempDir, { recursive: true, force: true });
//             fs.mkdirSync(tempDir, { recursive: true }); // Tạo lại thư mục tạm thời
//         }

//         // 3. Giải nén tệp ZIP vào thư mục tạm thời
//         const directory = await unzipper.Open.file(zipFilePath);
//         let totalSteps = directory.files.length;
//         let currentStep = 0;
//         let lastSentProgress = 0;

//         // Lưu ID mới trong mảng để có thể đổi tên
//         const newProfileIds = [];

//         for (const entry of directory.files) {
//             if (entry.path.endsWith('config.json')) {
//                 // Đọc và xử lý file config.json
//                 const configData = await entry.buffer();
//                 const profile_Data = JSON.parse(configData.toString());

//                 const { resource, ...res } = profile_Data;

//                 // Xử lý proxy
//                 let proxy = res.proxy.type === "not_use" ? "" : `${res.proxy.type}://${res.proxy.host}:${res.proxy.port}:${res.proxy.user_name}:${res.proxy.password}`;

//                 // Tạo mới profile trong cơ sở dữ liệu
//                 const newProfile = await Profiles.create({
//                     profile_data: JSON.stringify(res),
//                     name: res.profile_name,
//                     resource: JSON.stringify(resource),
//                     status: 1,
//                     proxy: proxy,
//                     profile_group_id: res.group || null,
//                     version: res.browser.version.replace("chrome", "").replace("firefox", "")
//                 });

//                 // Lưu ID mới
//                 newProfileIds.push(newProfile.id.toString());
//             }

//             currentStep++;
//             const progress = Math.round((currentStep / totalSteps) * 100);

//             // Kiểm tra nếu tiến độ đã tăng thêm ít nhất 5% so với lần gửi trước đó
//             if (progress - lastSentProgress >= 5) {
//                 lastSentProgress = progress;
//                 event.sender.send('uploadProgress', progress); // Gửi tiến độ về phía front-end
//             }
//         }

//         // Giải nén và lưu các tệp trong thư mục mới với ID mới
//         for (const entry of directory.files) {
//             if (entry.path.endsWith('config.json')) {
//                 // Bỏ qua, đã xử lý trước đó
//                 continue;
//             }

//             // Lấy ID mới tương ứng với thư mục gốc
//             const oldDirName = entry.path.split('/')[0];
//             const newProfileId = newProfileIds[parseInt(oldDirName) - 1]; // Giả sử thư mục con bắt đầu từ 1

//             // Đảm bảo ID mới có giá trị
//             if (!newProfileId) {
//                 continue;
//             }

//             // Tạo thư mục đích cho ID mới
//             const destDirPath = path.join(destinationDir, newProfileId, path.dirname(entry.path).replace(oldDirName, ''));
//             // Tạo thư mục đích nếu chưa tồn tại
//             if (!fs.existsSync(destDirPath)) {
//                 fs.mkdirSync(destDirPath, { recursive: true });
//             }

//             // Đảm bảo lưu tệp vào thư mục mới theo ID mới và cấu trúc thư mục ban đầu
//             const destFilePath = path.join(destDirPath, path.basename(entry.path));

//             // Đọc nội dung tệp và lưu vào thư mục đích
//             const fileData = await entry.buffer();
//             fs.writeFileSync(destFilePath, fileData);
//         }

//         // Xóa thư mục tạm
//         fs.rmSync(tempDir, { recursive: true, force: true });

//         return { success: true, message: `Đã nhập dữ liệu từ: ${zipFilePath}` };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

module.exports.importBackup = async function (zipFilePath, destinationDir, Profiles, numberProfile, profileLimit, event) {
    try {
        if (!fs.existsSync(zipFilePath)) {
            return { success: false, message: `The zip file is not found at the link: ${zipFilePath}` };
        }
        if (path.extname(zipFilePath) !== '.zip') {
            return { success: false, message: `Wrong file type. Need a .zip file.` };
        }

        let checkDirectory;

        try {
            checkDirectory = await unzipper.Open.file(zipFilePath);
        } catch (err) {
            return { success: false, message: `The zip file is not valid or broken.` };
        }

        const folderNames = new Set();
        const configFilePaths = new Set();

        for (const entry of checkDirectory.files) {
            const parts = entry.path.split('/');
            if (parts.length < 2) {
                continue;
            }

            const folderName = parts[0];
            const fileName = parts[parts.length - 1];

            if (!/^\d+$/.test(folderName)) {
                return { success: false, message: `The zip file is invalid` };
            }

            folderNames.add(folderName);

            if (fileName === 'config.json') {
                configFilePaths.add(folderName);
            }
        }

        for (const folderName of folderNames) {
            if (!configFilePaths.has(folderName)) {
                return { success: false, message: `The zip file is invalid.` };
            }
        }

        if (profileLimit !== -1) {
            const directoryCount = await countZip(zipFilePath) + numberProfile > profileLimit;

            if (directoryCount) {
                return { success: false, message: `Exceeding the folder limit. Maximum: ${profileLimit}` };
            }
        }

        const tempDir = path.join(destinationDir, 'temp_extracted');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        } else {
            fs.rmSync(tempDir, { recursive: true, force: true });
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const directory = await unzipper.Open.file(zipFilePath);
        let totalSteps = directory.files.length;
        let currentStep = 0;
        let lastSentProgress = 0;

        const newProfileIds = [];
        const oldToNewIdMap = {};

        for (const entry of directory.files) {
            if (entry.path.endsWith('config.json')) {
                const configData = await entry.buffer();
                const profile_Data = JSON.parse(configData.toString());

                const { resource, ...res } = profile_Data;
                let proxy = res.proxy.type === "not_use" ? "" : `${res.proxy.type}://${res.proxy.host}:${res.proxy.port}:${res.proxy.user_name}:${res.proxy.password}`;

                const newProfile = await Profiles.create({
                    profile_data: JSON.stringify(res),
                    name: res.profile_name,
                    resource: JSON.stringify(resource),
                    status: 1,
                    proxy: proxy,
                    profile_group_id: res.group || null,
                    version: res.browser.version.replace("chrome", "").replace("firefox", "")
                });

                const oldDirName = entry.path.split('/')[0];
                newProfileIds.push(newProfile.id.toString());
                oldToNewIdMap[oldDirName] = newProfile.id.toString();
            }

            currentStep++;
            const progress = Math.round((currentStep / totalSteps) * 100);
            if (progress - lastSentProgress >= 5) {
                lastSentProgress = progress;
                event.sender.send('uploadProgress', progress);
            }
        }

        for (const entry of directory.files) {
            if (entry.path.endsWith('config.json')) {
                continue;
            }

            const oldDirName = entry.path.split('/')[0];
            const newProfileId = oldToNewIdMap[oldDirName];

            if (!newProfileId) {
                continue;
            }

            const destDirPath = path.join(destinationDir, newProfileId, path.dirname(entry.path).replace(oldDirName, ''));
            if (!fs.existsSync(destDirPath)) {
                fs.mkdirSync(destDirPath, { recursive: true });
            }

            const destFilePath = path.join(destDirPath, path.basename(entry.path));
            const fileData = await entry.buffer();
            fs.writeFileSync(destFilePath, fileData);
        }

        fs.rmSync(tempDir, { recursive: true, force: true });

        return { success: true, message: `Đã nhập dữ liệu từ: ${zipFilePath}` };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
