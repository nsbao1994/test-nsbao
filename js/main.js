// main.js - entry point
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tab
    initTabs();
    
    // Xử lý authentication
    document.getElementById('loginBtn')?.addEventListener('click', handleAuthClick);
    document.getElementById('logoutBtn')?.addEventListener('click', handleSignoutClick);
    
    // Xử lý phân tích
    document.getElementById('scanBtn')?.addEventListener('click', scanFolder);
    document.getElementById('analyzeBtn')?.addEventListener('click', analyzeFiles);
    document.getElementById('saveBtn')?.addEventListener('click', saveAnalysisResults);
    document.getElementById('loadBtn')?.addEventListener('click', loadAnalysisResults);
    
    // Xử lý tạo truyện
    document.getElementById('generateBtn')?.addEventListener('click', generateStory);
    document.getElementById('saveStoryBtn')?.addEventListener('click', saveStoryToDrive);
    
    // Xử lý cài đặt
    document.getElementById('clearCacheBtn')?.addEventListener('click', clearCache);
    
    // Kiểm tra cache khi khởi động
    checkCacheOnStartup();
});

// Khởi tạo tab system
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Ẩn tất cả tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Bỏ active tất cả tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Hiển thị tab được chọn
            document.getElementById(`${tabId}-tab`).classList.add('active');
            button.classList.add('active');
        });
    });
}

// Kiểm tra cache khi khởi động
function checkCacheOnStartup() {
    const analysisData = cacheManager.getFromLocalCache(CACHE_KEYS.ANALYSIS_DATA);
    if (analysisData) {
        window.analysisData = analysisData;
        document.getElementById('analyzeBtn').disabled = false;
        document.getElementById('saveBtn').disabled = false;
        updateStatus('📂 Đã tải dữ liệu phân tích từ cache');
        displayAdvancedAnalysisResults();
    }
    
    const settings = cacheManager.getFromLocalCache(CACHE_KEYS.SETTINGS);
    if (settings) {
        document.getElementById('enableDeepAnalysis').checked = settings.enableDeepAnalysis;
        document.getElementById('enableVietnameseAnalysis').checked = settings.enableVietnameseAnalysis;
        document.getElementById('autoSaveResults').checked = settings.autoSaveResults;
    }
    
    updateCacheInfo();
}

// Cập nhật thông tin cache
function updateCacheInfo() {
    let totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length * 2; // Xấp xỉ kích thước byte
        }
    }
    
    const cacheInfo = document.getElementById('cacheInfo');
    cacheInfo.textContent = `Bộ nhớ cache: ${(totalSize / 1024).toFixed(2)} KB`;
}

// Xóa cache
function clearCache() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu cache?')) {
        cacheManager.clearCache();
        updateCacheInfo();
        updateStatus('✅ Đã xóa cache thành công');
    }
}
// Thực hiện phân tích nâng cao
async function performAdvancedAnalysis(fileContents) {
    const analyzers = {
        basic: new BasicAnalyzer(),
        linguistic: new LinguisticAnalyzer(),
        character: new CharacterAnalyzer(),
        emotion: new EmotionAnalyzer(),
        theme: new ThemeAnalyzer(),
        style: new StyleAnalyzer(),
        narrative: new NarrativeAnalyzer(),
        context: new ContextAnalyzer(),
        rhetoric: new RhetoricAnalyzer()
    };
    
    const allContent = fileContents.map(f => f.content).join('\n\n');
    const fileNames = fileContents.map(f => f.name);
    
    // Thực hiện các phân tích
    const results = {
        totalFiles: fileContents.length,
        fileNames: fileNames,
        totalWords: analyzers.basic.countWords(allContent),
        totalCharacters: allContent.length,
        language: analyzers.linguistic.analyzeText(allContent),
        characters: analyzers.character.analyzeCharacters(allContent),
        emotions: analyzers.emotion.analyzeEmotions(allContent),
        themes: analyzers.theme.analyzeThemes(allContent),
        writingStyle: analyzers.style.analyzeStyle(allContent),
        plot: analyzers.narrative.analyzePlot(allContent),
        context: analyzers.context.analyzeContext(allContent),
        rhetoric: analyzers.rhetoric.analyzeRhetoric(allContent),
        timestamp: new Date().toISOString()
    };
    
    return results;
}
// Tạo truyện tự động
async function generateStory() {
    if (!window.analysisData) {
        updateStatus('❌ Vui lòng phân tích file trước khi tạo truyện');
        return;
    }
    
    const storyTitle = document.getElementById('storyTitle').value || 
                      storyGenerator.generateStoryTitle(window.analysisData.themes[0]?.name);
    const chapterCount = parseInt(document.getElementById('chapterCount').value) || 50;
    
    updateStatus(`📖 Đang tạo truyện "${storyTitle}" với ${chapterCount} chương...`);
    
    try {
        window.generatedStory = {
            title: storyTitle,
            chapters: [],
            generatedAt: new Date().toISOString(),
            basedOnAnalysis: window.analysisData.timestamp
        };
        
        // Tạo từng chương
        for (let i = 1; i <= chapterCount; i++) {
            const chapterTitle = storyGenerator.generateChapterTitle(i, window.analysisData.themes[0]?.name);
            updateStatus(`📝 Đang tạo chương ${i}: ${chapterTitle}`);
            
            // Cập nhật progress bar
            const progressPercent = (i / chapterCount) * 100;
            document.getElementById('generationProgress').style.width = `${progressPercent}%`;
            
            const chapterContent = await storyGenerator.generateChapter(
                window.analysisData, i, chapterTitle
            );
            
            window.generatedStory.chapters.push({
                number: i,
                title: chapterTitle,
                content: chapterContent,
                wordCount: storyGenerator.countWords(chapterContent)
            });
            
            // Hiển thị xem trước chương mới nhất
            document.getElementById('storyPreview').innerHTML = `
                <h4>${chapterTitle}</h4>
                <p>${chapterContent.substring(0, 200)}...</p>
                <small>${storyGenerator.countWords(chapterContent)} từ</small>
            `;
            
            // Nghỉ một chút để tránh block UI
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        updateStatus(`✅ Đã tạo xong truyện "${storyTitle}"`);
        document.getElementById('saveStoryBtn').disabled = false;
        
    } catch (error) {
        console.error('Lỗi khi tạo truyện:', error);
        updateStatus(`❌ Lỗi khi tạo truyện: ${error.message}`);
    }
}

// Lưu truyện lên Google Drive
async function saveStoryToDrive() {
    if (!window.generatedStory) {
        updateStatus('❌ Không có truyện nào để lưu');
        return;
    }
    
    updateStatus('📚 Đang lưu truyện lên Google Drive...');
    
    try {
        // Tạo thư mục chính QuanLyTruyen nếu chưa có
        const mainFolderId = await cacheManager.findOrCreateFolder('QuanLyTruyen');
        if (!mainFolderId) {
            throw new Error('Không thể tạo thư mục QuanLyTruyen');
        }
        
        // Tạo thư mục con với tên truyện
        const storyFolderId = await cacheManager.findOrCreateFolder(
            window.generatedStory.title, mainFolderId
        );
        
        if (!storyFolderId) {
            throw new Error('Không thể tạo thư mục truyện');
        }
        
        // Lưu metadata truyện
        await cacheManager.saveToDrive(
            `${window.generatedStory.title}_metadata`,
            window.generatedStory,
            storyFolderId
        );
        
        // Lưu từng chương
        for (const chapter of window.generatedStory.chapters) {
            const chapterFileName = `Chương ${chapter.number} - ${chapter.title}.txt`;
            await cacheManager.saveToDrive(
                chapterFileName,
                chapter.content,
                storyFolderId
            );
        }
        
        updateStatus(`✅ Đã lưu truyện "${window.generatedStory.title}" thành công!`);
        
    } catch (error) {
        console.error('Lỗi khi lưu truyện:', error);
        updateStatus(`❌ Lỗi khi lưu truyện: ${error.message}`);
    }
}
// Lưu kết quả phân tích
async function saveAnalysisResults() {
    if (!window.analysisData) {
        updateStatus('❌ Không có dữ liệu phân tích để lưu');
        return;
    }
    
    updateStatus('💾 Đang lưu kết quả phân tích...');
    
    try {
        // Lưu vào cache local
        cacheManager.saveToLocalCache(CACHE_KEYS.ANALYSIS_DATA, window.analysisData);
        
        // Lưu cài đặt
        const settings = {
            enableDeepAnalysis: document.getElementById('enableDeepAnalysis').checked,
            enableVietnameseAnalysis: document.getElementById('enableVietnameseAnalysis').checked,
            autoSaveResults: document.getElementById('autoSaveResults').checked
        };
        cacheManager.saveToLocalCache(CACHE_KEYS.SETTINGS, settings);
        
        // Đồng bộ với Google Drive nếu được kết nối
        if (gapi.client.getToken()) {
            await cacheManager.syncWithDrive();
            updateStatus('✅ Đã lưu và đồng bộ kết quả phân tích');
        } else {
            updateStatus('✅ Đã lưu kết quả phân tích vào cache local');
        }
        
    } catch (error) {
        console.error('Lỗi khi lưu kết quả:', error);
        updateStatus(`❌ Lỗi khi lưu: ${error.message}`);
    }
}

// Tải kết quả phân tích
async function loadAnalysisResults() {
    updateStatus('📂 Đang tải kết quả phân tích...');
    
    try {
        let analysisData = null;
        
        // Ưu tiên tải từ Google Drive nếu được kết nối
        if (gapi.client.getToken()) {
            analysisData = await cacheManager.loadFromDrive(CACHE_KEYS.ANALYSIS_DATA);
        }
        
        // Nếu không có từ Drive, thử tải từ cache local
        if (!analysisData) {
            analysisData = cacheManager.getFromLocalCache(CACHE_KEYS.ANALYSIS_DATA);
        }
        
        if (analysisData) {
            window.analysisData = analysisData;
            displayAdvancedAnalysisResults();
            updateStatus('✅ Đã tải kết quả phân tích thành công');
            document.getElementById('generateBtn').disabled = false;
        } else {
            updateStatus('❌ Không tìm thấy dữ liệu phân tích');
        }
        
    } catch (error) {
        console.error('Lỗi khi tải kết quả:', error);
        updateStatus(`❌ Lỗi khi tải: ${error.message}`);
    }
}
