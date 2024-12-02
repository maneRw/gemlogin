// const fs = require('fs');
// const path = require('path');
// const AdmZip = require('adm-zip');

// module.exports.createBackup = async function (sourceDir, outputZip, profileIds, Profiles, event) {

//     const zip = new AdmZip();
//     let totalProfiles = profileIds.length; // Số lượng hồ sơ cần sao lưu
//     let processedProfiles = 0; // Số lượng hồ sơ đã xử lý

//     // Hàm đệ quy để thêm file và thư mục vào zip
//     function addFilesToZip(dir, baseDir) {
//         const files = fs.readdirSync(dir);

//         files.forEach(file => {
//             const fullPath = path.join(dir, file);
//             const stat = fs.statSync(fullPath);

//             if (stat.isDirectory()) {
//                 // Nếu là thư mục, kiểm tra tên thư mục trước khi thêm
//                 if (file === 'IndexedDB' || file === 'GPUCache' || file === 'Code Cache' || file === 'Cache' || file === 'component_crx_cache' || file === 'ShaderCache') {
//                     return; // Bỏ qua các thư mục này
//                 }
//                 if (file === 'Service Worker') {
//                     // Nếu là thư mục Service Worker, kiểm tra các thư mục con
//                     const serviceWorkerFiles = fs.readdirSync(fullPath);
//                     serviceWorkerFiles.forEach(subFile => {
//                         if (subFile === 'CacheStorage') {
//                             return; // Bỏ qua CacheStorage
//                         }
//                     });
//                 }
//                 // Nếu không phải là các thư mục bị loại trừ, thêm vào zip
//                 const newBaseDir = path.join(baseDir, file);
//                 addFilesToZip(fullPath, newBaseDir);
//             } else {
//                 // Nếu là file, thêm file vào zip
//                 const zipPath = path.join(baseDir, file);
//                 zip.addLocalFile(fullPath, path.dirname(zipPath));
//             }
//         });
//     }

//     try {
//         // Lặp qua từng thư mục con trong thư mục profile
//         const subDirs = fs.readdirSync(sourceDir).filter(subDir => {
//             const fullPath = path.join(sourceDir, subDir);
//             return fs.statSync(fullPath).isDirectory();
//         });

//         for (const subDir of subDirs) {
//             const subDirPath = path.join(sourceDir, subDir);

//             if (profileIds.includes(parseInt(subDir))) {

//                 const profile = await Profiles.findByPk(subDir);

//                 if (profile) {
//                     // Tạo file config.json và lưu vào thư mục tương ứng
//                     const configFilePath = path.join(subDirPath, 'config.json');

//                     const profileData = profile.profile_data ? JSON.parse(profile.profile_data) : {};
//                     profileData.group = profile.profile_group_id;

//                     const configData = {
//                         ...profileData, // Bao gồm nội dung của profile_data
//                         resource: JSON.parse(profile.resource) // Thêm resource riêng biệt
//                     };

//                     fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
//                     // Thêm config.json vào file zip
//                     zip.addLocalFile(configFilePath, subDir);

//                     fs.unlinkSync(configFilePath); // Xóa file config.json sau khi thêm vào zip
//                 }

//                 // Thêm tất cả các tệp và thư mục trong subDirPath (trừ các thư mục được chỉ định)
//                 addFilesToZip(subDirPath, subDir);

//                 processedProfiles++; // Tăng số hồ sơ đã xử lý
//                 const progress = Math.round((processedProfiles / totalProfiles) * 100); // Tính toán tiến trình
//                 event.sender.send('backupProgress', progress); // Gửi tiến trình
//             }
//         }

//         // Lưu zip vào file
//         zip.writeZip(outputZip);
//         console.log(`Backup has been created at: ${outputZip}`);
//         return { success: true, message: `Backup has been created at: ${outputZip}` };
//     } catch (error) {
//         console.error(`Error while creating backup: ${error.message}`);
//         return { success: false, message: error.message };
//     }
// };

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

module.exports.createBackup = async function (sourceDir, outputZip, profileIds, Profiles, event) {
    try {
        const output = fs.createWriteStream(outputZip);
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Xử lý lỗi nén
        archive.on('error', function (err) {
            console.log("err=>", err)
            throw err;
        });

        output.on('close', function () {
            console.log(`Backup has been created at: ${outputZip}, total bytes: ${archive.pointer()}`);
        });

        // Kết nối stream đầu ra (file zip) với archive
        archive.pipe(output);

        let totalProfiles = profileIds.length;
        let processedProfiles = 0;

        // Hàm đệ quy để thêm file và thư mục vào zip bằng stream
        async function addFilesToArchive(dir, baseDir) {
            const files = await fs.promises.readdir(dir);

            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = await fs.promises.stat(fullPath);
                if (stat.isDirectory()) {
                    if (['IndexedDB', 'GPUCache', 'Code Cache', 'Cache', 'component_crx_cache', 'ShaderCache', 'BrowserMetrics', 'GraphiteDawnCache'].includes(file)) {
                        continue;
                    }
                    if (file === 'Service Worker') {
                        const serviceWorkerFiles = await fs.promises.readdir(fullPath);
                        if (serviceWorkerFiles.includes('CacheStorage')) {
                            continue;
                        }
                    }
                    const newBaseDir = path.join(baseDir, file);
                    await addFilesToArchive(fullPath, newBaseDir);
                } else {
                    const zipPath = path.join(baseDir, file);
                    archive.file(fullPath, { name: zipPath });
                }
            }
        }

        // Lặp qua từng thư mục con trong thư mục profile
        const subDirs = (await fs.promises.readdir(sourceDir)).filter(async (subDir) => {
            const fullPath = path.join(sourceDir, subDir);
            return (await fs.promises.stat(fullPath)).isDirectory();
        });

        // Xử lý từng profile
        for (const subDir of subDirs) {
            const subDirPath = path.join(sourceDir, subDir);

            if (profileIds.includes(parseInt(subDir))) {

                const profile = await Profiles.findByPk(subDir);
                if (profile) {
                    // Trực tiếp thêm config.json vào zip mà không ghi ra file tạm
                    const profileData = profile.profile_data ? JSON.parse(profile.profile_data) : {};
                    profileData.group = profile.profile_group_id;

                    const configData = {
                        ...profileData,
                        resource: JSON.parse(profile.resource)
                    };

                    archive.append(Buffer.from(JSON.stringify(configData, null, 2)), { name: path.join(subDir, 'config.json') });
                }

                // Thêm tất cả các tệp và thư mục trong subDirPath
                await addFilesToArchive(subDirPath, subDir);

                processedProfiles++;
                const progress = Math.round((processedProfiles / totalProfiles) * 100);
                event.sender.send('backupProgress', progress);
            }
        }

        // Đóng và hoàn tất việc nén
        await archive.finalize();

        return { success: true, message: `Backup has been created at: ${outputZip}` };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
