// cache.js - Quản lý cache và đồng bộ với Google Drive
const CACHE_KEYS = {
    ANALYSIS_DATA: 'story_analysis_data',
    SETTINGS: 'analysis_settings',
    STORY_DATA: 'generated_stories'
};

class CacheManager {
    constructor() {
        this.isDriveConnected = false;
        this.cacheEnabled = true;
    }

    // Lưu dữ liệu vào cache local
    saveToLocalCache(key, data) {
        if (!this.cacheEnabled) return false;
        
        try {
            const dataToStore = {
                data: data,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(key, JSON.stringify(dataToStore));
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu cache:', error);
            return false;
        }
    }

    // Lấy dữ liệu từ cache local
    getFromLocalCache(key) {
        if (!this.cacheEnabled) return null;
        
        try {
            const storedData = localStorage.getItem(key);
            if (!storedData) return null;
            
            const parsedData = JSON.parse(storedData);
            
            // Kiểm tra phiên bản và thời gian (dữ liệu cũ hơn 7 ngày sẽ bị bỏ qua)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const cacheDate = new Date(parsedData.timestamp);
            
            if (cacheDate < oneWeekAgo) {
                this.clearCache(key);
                return null;
            }
            
            return parsedData.data;
        } catch (error) {
            console.error('Lỗi khi đọc cache:', error);
            return null;
        }
    }

    // Xóa cache
    clearCache(key = null) {
        try {
            if (key) {
                localStorage.removeItem(key);
            } else {
                localStorage.clear();
            }
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa cache:', error);
            return false;
        }
    }

    // Đồng bộ với Google Drive
    async syncWithDrive() {
        if (!this.isDriveConnected) return false;
        
        try {
            // Kiểm tra xem thư mục QuanLyTruyen đã tồn tại chưa
            let folderId = await this.findOrCreateFolder('QuanLyTruyen');
            
            if (!folderId) {
                console.error('Không thể tạo thư mục QuanLyTruyen');
                return false;
            }
            
            // Đồng bộ tất cả dữ liệu cache
            const keys = Object.values(CACHE_KEYS);
            for (const key of keys) {
                const data = this.getFromLocalCache(key);
                if (data) {
                    await this.saveToDrive(key, data, folderId);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Lỗi khi đồng bộ với Drive:', error);
            return false;
        }
    }

    // Tìm hoặc tạo thư mục trên Drive
    async findOrCreateFolder(folderName, parentId = null) {
        try {
            // Tìm thư mục
            let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
            if (parentId) {
                query += ` and '${parentId}' in parents`;
            }
            
            const response = await gapi.client.drive.files.list({
                q: query,
                fields: 'files(id, name)'
            });
            
            if (response.result.files.length > 0) {
                return response.result.files[0].id;
            }
            
            // Tạo thư mục mới nếu không tìm thấy
            const folderMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: parentId ? [parentId] : []
            };
            
            const createResponse = await gapi.client.drive.files.create({
                resource: folderMetadata,
                fields: 'id'
            });
            
            return createResponse.result.id;
        } catch (error) {
            console.error('Lỗi khi tạo thư mục:', error);
            return null;
        }
    }

    // Lưu dữ liệu lên Drive
    async saveToDrive(fileName, data, parentFolderId = null) {
        try {
            const fileContent = JSON.stringify(data, null, 2);
            const fileMetadata = {
                name: `${fileName}.json`,
                mimeType: 'application/json',
                parents: parentFolderId ? [parentFolderId] : []
            };
            
            // Kiểm tra xem file đã tồn tại chưa
            const existingResponse = await gapi.client.drive.files.list({
                q: `name='${fileName}.json' and trashed=false`,
                fields: 'files(id)'
            });
            
            if (existingResponse.result.files.length > 0) {
                // Cập nhật file đã tồn tại
                const fileId = existingResponse.result.files[0].id;
                await gapi.client.request({
                    path: `/upload/drive/v3/files/${fileId}`,
                    method: 'PATCH',
                    params: { uploadType: 'media' },
                    body: fileContent
                });
            } else {
                // Tạo file mới
                await gapi.client.request({
                    path: '/upload/drive/v3/files',
                    method: 'POST',
                    params: {
                        uploadType: 'multipart',
                        supportsAllDrives: true
                    },
                    headers: {
                        'Content-Type': 'multipart/related; boundary="boundary"'
                    },
                    body: this.createMultipartBody(fileMetadata, fileContent)
                });
            }
            
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu lên Drive:', error);
            return false;
        }
    }

    createMultipartBody(metadata, fileContent) {
        const boundary = 'boundary';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        
        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            fileContent +
            close_delim;
        
        return multipartRequestBody;
    }

    // Tải dữ liệu từ Drive
    async loadFromDrive(fileName) {
        try {
            const response = await gapi.client.drive.files.list({
                q: `name='${fileName}.json' and trashed=false`,
                fields: 'files(id, name)'
            });
            
            if (response.result.files.length === 0) {
                return null;
            }
            
            const fileId = response.result.files[0].id;
            const fileResponse = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });
            
            return fileResponse.result;
        } catch (error) {
            console.error('Lỗi khi tải từ Drive:', error);
            return null;
        }
    }
}

// Khởi tạo cache manager
const cacheManager = new CacheManager();