// drive.js - Tương tác với Google Drive
const ANALYSIS_CACHE_NAME = 'StoryAnalysisCache';
const STORY_FOLDER_NAME = 'QuanLyTruyen';

// Quét thư mục để tìm file TXT
async function scanFolder() {
    if (!gapi.client.getToken()) {
        updateStatus('❌ Vui lòng đăng nhập Google Drive trước');
        return;
    }
    
    updateStatus('🔍 Đang quét thư mục...');
    
    try {
        // Tìm tất cả file TXT
        const response = await gapi.client.drive.files.list({
            q: "mimeType='text/plain' and trashed=false",
            fields: 'files(id, name, parents, modifiedTime)',
            pageSize: 100
        });
        
        const files = response.result.files;
        if (files.length === 0) {
            updateStatus('❌ Không tìm thấy file TXT nào');
            return;
        }
        
        // Lấy thông tin thư mục cha cho mỗi file
        const filesWithFolder = await Promise.all(files.map(async file => {
            let folderPath = 'Không xác định';
            if (file.parents && file.parents.length > 0) {
                const folderResponse = await gapi.client.drive.files.get({
                    fileId: file.parents[0],
                    fields: 'name'
                });
                folderPath = folderResponse.result.name;
            }
            
            return {
                id: file.id,
                name: file.name,
                folder: folderPath,
                modifiedTime: file.modifiedTime
            };
        }));
        
        // Hiển thị danh sách file
        displayFileList(filesWithFolder);
        window.scannedFiles = filesWithFolder;
        
        updateStatus(`✅ Đã tìm thấy ${files.length} file TXT`);
        document.getElementById('analyzeBtn').disabled = false;
        
    } catch (error) {
        console.error('Lỗi khi quét thư mục:', error);
        updateStatus(`❌ Lỗi khi quét: ${error.message}`);
    }
}

// Hiển thị danh sách file
function displayFileList(files) {
    const fileListDiv = document.getElementById('fileList');
    fileListDiv.innerHTML = '';
    
    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-name">${file.name}</div>
            <div class="file-actions">
                <small>${file.folder}</small>
            </div>
        `;
        fileListDiv.appendChild(fileItem);
    });
}

// Phân tích các file đã chọn
async function analyzeFiles() {
    if (!window.scannedFiles || window.scannedFiles.length === 0) {
        updateStatus('❌ Không có file nào để phân tích');
        return;
    }
    
    updateStatus('🧠 Đang phân tích...');
    
    try {
        // Đọc nội dung từng file
        const fileContents = await Promise.all(
            window.scannedFiles.map(async file => {
                const response = await gapi.client.drive.files.get({
                    fileId: file.id,
                    alt: 'media'
                });
                return {
                    name: file.name,
                    content: response.body
                };
            })
        );
        
        // Phân tích nâng cao
        const analysisResults = await performAdvancedAnalysis(fileContents);
        window.analysisData = analysisResults;
        
        // Hiển thị kết quả
        displayAdvancedAnalysisResults();
        
        // Lưu vào cache
        cacheManager.saveToLocalCache(CACHE_KEYS.ANALYSIS_DATA, analysisResults);
        
        updateStatus(`✅ Đã phân tích ${fileContents.length} file`);
        document.getElementById('saveBtn').disabled = false;
        document.getElementById('generateBtn').disabled = false;
        
    } catch (error) {
        console.error('Lỗi khi phân tích:', error);
        updateStatus(`❌ Lỗi khi phân tích: ${error.message}`);
    }
}

// Hiển thị kết quả phân tích nâng cao
function displayAdvancedAnalysisResults() {
    if (!window.analysisData) return;
    
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = '';
    
    // Tạo giao diện hiển thị kết quả chi tiết
    const analysis = window.analysisData;
    
    // Tổng quan
    const overviewSection = createCollapsibleSection('📊 Tổng quan phân tích', `
        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-number">${analysis.totalFiles}</div>
                <div class="stat-label">Tổng số file</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${analysis.totalWords.toLocaleString()}</div>
                <div class="stat-label">Tổng số từ</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${analysis.totalCharacters.toLocaleString()}</div>
                <div class="stat-label">Tổng số ký tự</div>
            </div>
        </div>
    `);
    resultsDiv.appendChild(overviewSection);
    
    // Phân tích ngôn ngữ
    const languageSection = createCollapsibleSection('🔤 Phân tích ngôn ngữ', `
        <p><strong>Độ phức tạp câu:</strong> ${analysis.language.complexity}</p>
        <p><strong>Từ vựng đa dạng:</strong> ${analysis.language.vocabularyDiversity}</p>
        <p><strong>Tỷ lệ từ cảm xúc:</strong> ${analysis.language.emotionWordRatio}</p>
        <p><strong>Phong cách viết:</strong> ${analysis.language.writingStyle}</p>
    `);
    resultsDiv.appendChild(languageSection);
    
    // Nhân vật
    if (analysis.characters && analysis.characters.length > 0) {
        const charactersHTML = analysis.characters.map(char => `
            <div class="character-item">
                <strong>${char.name}</strong>: ${char.description}
                <br><small>Tần suất: ${char.frequency} lần xuất hiện</small>
            </div>
        `).join('');
        
        const characterSection = createCollapsibleSection('👥 Nhân vật chính', charactersHTML);
        resultsDiv.appendChild(characterSection);
    }
    
    // Chủ đề
    if (analysis.themes && analysis.themes.length > 0) {
        const themesHTML = analysis.themes.map(theme => `
            <div class="theme-item">
                <strong>${theme.name}</strong>: ${theme.strength}
            </div>
        `).join('');
        
        const themeSection = createCollapsibleSection('🎯 Chủ đề chính', themesHTML);
        resultsDiv.appendChild(themeSection);
    }
    
    // Cốt truyện
    if (analysis.plot && analysis.plot.structure) {
        const plotSection = createCollapsibleSection('📖 Cấu trúc cốt truyện', `
            <p><strong>Kiểu cốt truyện:</strong> ${analysis.plot.type}</p>
            <p><strong>Độ phức tạp:</strong> ${analysis.plot.complexity}</p>
            <p><strong>Điểm cao trào:</strong> ${analysis.plot.climaxPoints.join(', ')}</p>
        `);
        resultsDiv.appendChild(plotSection);
    }
}

// Tạo section có thể thu gọn
function createCollapsibleSection(title, content) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';
    
    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = title;
    header.addEventListener('click', () => {
        contentDiv.classList.toggle('hidden');
    });
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'collapsible-content';
    contentDiv.innerHTML = content;
    
    section.appendChild(header);
    section.appendChild(contentDiv);
    
    return section;
}