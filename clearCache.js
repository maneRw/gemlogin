const fs = require('fs');
const path = require('path');

// Hàm xóa thư mục và trả về kết quả
function deleteFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            return { success: true, message: `Deleted folder: ${folderPath}` };
        } catch (error) {
            return { success: false, message: `Failed to delete folder: ${folderPath}` };
        }
    } else {
        return { success: false, message: `Folder does not exist: ${folderPath}` };
    }
}

// Hàm chính để xóa cache dựa trên profile path và danh sách profile IDs
module.exports.clearCache = (profilePath, profileIds) => {
    let results = [];  // Lưu kết quả của mỗi lần xóa

    profileIds.forEach(profileId => {
        // Tạo đường dẫn tới thư mục của profile dựa trên profileId
        const currentProfilePath = path.join(profilePath, profileId.toString());

        // Xóa các thư mục con cần thiết trong mỗi profile và lưu kết quả
        results.push(deleteFolder(path.join(currentProfilePath, 'Default', 'Cache')));
        results.push(deleteFolder(path.join(currentProfilePath, 'Default', 'Code Cache')));
        results.push(deleteFolder(path.join(currentProfilePath, 'OptimizationGuidePredictionModels')));
        results.push(deleteFolder(path.join(currentProfilePath, 'Default', 'optimization_guide_prediction_model_downloads')));
        results.push(deleteFolder(path.join(currentProfilePath, 'SwReporter')));
        results.push(deleteFolder(path.join(currentProfilePath, 'pnacl')));
    });

    // Kiểm tra nếu tất cả đều thành công
    const allSuccessful = results.every(result => result.success);

    if (allSuccessful) {
        return { success: true, message: 'All folders deleted successfully.' };
    } else {
        const failedResults = results.filter(result => !result.success).map(result => result.message);
        return { success: false, message: `Some folders failed to delete: ${failedResults.join('; ')}` };
    }
}