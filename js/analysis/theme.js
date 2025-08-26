// Phân tích chủ đề tiếng Việt
class ThemeAnalyzer {
    constructor() {
        this.vietnameseThemes = {
            'tình yêu': ['yêu', 'thương', 'trái tim', 'tình cảm', 'lãng mạn'],
            'gia đình': ['gia đình', 'cha', 'mẹ', 'anh', 'chị', 'em', 'con'],
            'bạn bè': ['bạn', 'bè', 'đồng hành', 'tri kỷ', 'bạn thân'],
            'phiêu lưu': ['phiêu lưu', 'khám phá', 'hành trình', 'thám hiểm'],
            'chiến đấu': ['chiến đấu', 'chiến tranh', 'vũ khí', 'trận đánh'],
            'phép thuật': ['phép thuật', 'phù thủy', 'ma thuật', 'bùa chú']
        };
    }
    
    analyzeThemes(text) {
        const themes = [];
        const textLower = text.toLowerCase();
        
        for (const [theme, keywords] of Object.entries(this.vietnameseThemes)) {
            const frequency = keywords.filter(keyword => 
                textLower.includes(keyword)
            ).length;
            
            if (frequency > 0) {
                const strength = this.calculateThemeStrength(frequency, keywords.length);
                themes.push({
                    name: theme,
                    frequency: frequency,
                    strength: strength,
                    keywords: keywords.filter(keyword => textLower.includes(keyword))
                });
            }
        }
        
        // Sắp xếp theo tần suất giảm dần
        return themes.sort((a, b) => b.frequency - a.frequency);
    }
    
    calculateThemeStrength(frequency, totalKeywords) {
        const ratio = frequency / totalKeywords;
        if (ratio > 0.7) return "Rất mạnh";
        if (ratio > 0.4) return "Mạnh";
        if (ratio > 0.2) return "Trung bình";
        return "Yếu";
    }
}