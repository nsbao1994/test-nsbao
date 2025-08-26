// generator.js - Tạo truyện tự động
class StoryGenerator {
    constructor() {
        this.storyTemplates = {
            fantasy: {
                themes: ['phiêu lưu', 'phép thuật', 'chiến đấu', 'tình bạn'],
                settings: ['thế giới giả tưởng', 'vương quốc cổ', 'vùng đất bí ẩn'],
                characters: ['pháp sư', 'hiệp sĩ', 'người hùng', 'sinh vật huyền bí']
            },
            romance: {
                themes: ['tình yêu', 'gia đình', 'tình bạn', 'hy sinh'],
                settings: ['thành phố hiện đại', 'vùng quê', 'trường học'],
                characters: ['sinh viên', 'nghệ sĩ', 'doanh nhân', 'giáo viên']
            },
            mystery: {
                themes: ['bí ẩn', 'trinh thám', 'tội phạm', 'khám phá'],
                settings: ['thành phố', 'làng quê', 'tòa nhà bí ẩn'],
                characters: ['thám tử', 'cảnh sát', 'nhân chứng', 'nghi phạm']
            }
        };
        
        this.vietnameseNames = {
            male: ['An', 'Bình', 'Cường', 'Dũng', 'Hải', 'Hoàng', 'Hùng', 'Khải', 'Long', 'Minh', 'Nam', 'Phong', 'Quân', 'Sơn', 'Thành', 'Trung', 'Tuấn', 'Việt'],
            female: ['An', 'Chi', 'Diễm', 'Giang', 'Hà', 'Hương', 'Lan', 'Linh', 'Mai', 'Nga', 'Ngọc', 'Như', 'Phương', 'Thảo', 'Trang', 'Uyên', 'Yến'],
            surname: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý']
        };
        
        this.vietnameseWords = {
            places: ['làng', 'phố', 'chợ', 'đình', 'chùa', 'sông', 'núi', 'rừng', 'biển', 'đồng', 'bãi'],
            emotions: ['vui', 'buồn', 'giận', 'yêu', 'ghét', 'thương', 'nhớ', 'sợ', 'ngạc nhiên', 'xúc động'],
            actions: ['đi', 'chạy', 'nhảy', 'ăn', 'uống', 'ngủ', 'nói', 'cười', 'khóc', 'hát', 'học', 'làm']
        };
    }
    
    // Tạo tên nhân vật ngẫu nhiên
    generateCharacterName(gender = null) {
        const actualGender = gender || (Math.random() > 0.5 ? 'male' : 'female');
        const surname = this.vietnameseNames.surname[Math.floor(Math.random() * this.vietnameseNames.surname.length)];
        const givenName = this.vietnameseNames[actualGender][Math.floor(Math.random() * this.vietnameseNames[actualGender].length)];
        
        return `${surname} ${givenName}`;
    }
    
    // Tạo tiêu đề truyện
    generateStoryTitle(theme) {
        const prefixes = ['Cuộc phiêu lưu của', 'Hành trình', 'Tình yêu', 'Bí mật', 'Câu chuyện về'];
        const suffixes = ['bất tận', 'vĩ đại', 'đêm trăng', 'mùa thu', 'vùng đất lạ', 'trái tim'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${prefix} ${suffix}`;
    }
    
    // Tạo tên chương
    generateChapterTitle(chapterNumber, storyTheme) {
        const chapterTypes = [
            'Khởi đầu', 'Bí mật hé lộ', 'Bước ngoặt', 'Thử thách', 'Hy sinh',
            'Đối mặt', 'Đoàn tụ', 'Lựa chọn', 'Chiến thắng', 'Kết thúc'
        ];
        
        const type = chapterTypes[Math.floor(Math.random() * chapterTypes.length)];
        return `Chương ${chapterNumber}: ${type}`;
    }
    
    // Tạo nội dung chương
    async generateChapter(storyData, chapterNumber, chapterTitle) {
        const chapterLength = 2000 + Math.floor(Math.random() * 1000); // 2000-3000 từ
        let content = `# ${chapterTitle}\n\n`;
        
        // Xác định loại truyện để chọn template phù hợp
        const storyType = this.determineStoryType(storyData.themes);
        const template = this.storyTemplates[storyType];
        
        // Tạo đoạn mở đầu
        content += await this.generateParagraph('intro', template, storyData);
        
        // Tạo các đoạn phát triển
        const developmentParagraphs = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < developmentParagraphs; i++) {
            content += await this.generateParagraph('development', template, storyData);
        }
        
        // Tạo đoạn kết
        content += await this.generateParagraph('conclusion', template, storyData);
        
        // Đảm bảo độ dài chương
        while (this.countWords(content) < chapterLength) {
            content += await this.generateParagraph('extra', template, storyData);
        }
        
        return content;
    }
    
    // Tạo đoạn văn
    async generateParagraph(type, template, storyData) {
        let paragraph = '';
        
        switch (type) {
            case 'intro':
                paragraph = this.generateIntroduction(template, storyData);
                break;
            case 'development':
                paragraph = this.generateDevelopment(template, storyData);
                break;
            case 'conclusion':
                paragraph = this.generateConclusion(template, storyData);
                break;
            default:
                paragraph = this.generateExtraContent(template, storyData);
        }
        
        return paragraph + '\n\n';
    }
    
    // Đếm số từ
    countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }
    
    // Xác định loại truyện dựa trên chủ đề
    determineStoryType(themes) {
        if (themes.some(theme => ['phiêu lưu', 'phép thuật', 'chiến đấu'].includes(theme))) {
            return 'fantasy';
        } else if (themes.some(theme => ['tình yêu', 'gia đình', 'tình bạn'].includes(theme))) {
            return 'romance';
        } else {
            return 'mystery';
        }
    }
    
    // Các hàm tạo nội dung cụ thể
    generateIntroduction(template, storyData) {
        const settings = template.settings[Math.floor(Math.random() * template.settings.length)];
        const characters = template.characters[Math.floor(Math.random() * template.characters.length)];
        
        const introductions = [
            `Tại một ${settings} xa xôi, có một ${characters} tên là ${this.generateCharacterName()}. `,
            `Câu chuyện bắt đầu từ ${settings}, nơi ${this.generateCharacterName()} đang đối mặt với một thử thách lớn. `,
            `Trong thế giới đầy ${template.themes[0]}, ${this.generateCharacterName()} phải lên đường thực hiện sứ mệnh. `
        ];
        
        return introductions[Math.floor(Math.random() * introductions.length)];
    }
    
    generateDevelopment(template, storyData) {
        const developments = [
            `Trên hành trình, ${this.generateCharacterName()} gặp được ${this.generateCharacterName()} và cùng nhau vượt qua khó khăn. `,
            `Bí mật dần được hé lộ, ${this.generateCharacterName()} nhận ra sự thật đằng sau mọi chuyện. `,
            `Với sự giúp đỡ của ${this.generateCharacterName()}, nhân vật chính đã tìm ra cách giải quyết vấn đề. `,
            `Tình cảm giữa ${this.generateCharacterName()} và ${this.generateCharacterName()} ngày càng sâu đậm. `,
            `Khó khăn chồng chất khó khăn, nhưng ${this.generateCharacterName()} không hề từ bỏ. `
        ];
        
        return developments[Math.floor(Math.random() * developments.length)];
    }
    
    generateConclusion(template, storyData) {
        const conclusions = [
            `Sau tất cả, ${this.generateCharacterName()} đã học được bài học quý giá về ${template.themes[0]}. `,
            `Kết thúc có hậu đã đến, mọi người cùng nhau sống hạnh phúc. `,
            `Dù câu chuyện đã kết thúc, nhưng hành trình thực sự mới chỉ bắt đầu. `,
            `Với trái tim đầy ${this.vietnameseWords.emotions[Math.floor(Math.random() * this.vietnameseWords.emotions.length)]}, ${this.generateCharacterName()} bước tiếp trên con đường mới. `
        ];
        
        return conclusions[Math.floor(Math.random() * conclusions.length)];
    }
    
    generateExtraContent(template, storyData) {
        const extras = [
            `Bầu trời đầy sao tỏa sáng trên ${this.vietnameseWords.places[Math.floor(Math.random() * this.vietnameseWords.places.length)]}. `,
            `Tiếng ${this.vietnameseWords.actions[Math.floor(Math.random() * this.vietnameseWords.actions.length)]} vang lên khắp nơi. `,
            `Mùi hương của hoa cỏ lan tỏa trong không khí. `,
            `Ánh nắng ban mai chiếu rọi khung cảnh tuyệt đẹp. `,
            `Cơn mưa rào bất chợt ập đến, mang theo sự mát mẻ. `
        ];
        
        return extras[Math.floor(Math.random() * extras.length)];
    }
}

// Khởi tạo story generator
const storyGenerator = new StoryGenerator();