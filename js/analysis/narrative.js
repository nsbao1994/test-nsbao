function analyzeNarrativeStructure(content) {
            const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
            const totalLength = content.split(/\s+/).length;
            
            // Phân tích cấu trúc 3 hồi
            const structure = analyzeThreeActStructure(paragraphs, totalLength);
            
            // Phân tích các yếu tố cốt truyện
            const plotElements = analyzePlotElements(content);
            
            // Phân tích xung đột
            const conflictAnalysis = analyzeConflict(content);
            
            return {
                structure: structure,
                plotElements: plotElements,
                conflict: conflictAnalysis,
                pacing: analyzePacing(paragraphs),
                climax: identifyClimax(content)
            };
        }

        function analyzeThreeActStructure(paragraphs, totalLength) {
            const act1End = Math.floor(paragraphs.length * 0.25);
            const act2End = Math.floor(paragraphs.length * 0.75);
            
            return {
                act1: {
                    paragraphs: act1End,
                    percentage: '25%',
                    description: 'Mở đầu, giới thiệu'
                },
                act2: {
                    paragraphs: act2End - act1End,
                    percentage: '50%',
                    description: 'Phát triển, xung đột'
                },
                act3: {
                    paragraphs: paragraphs.length - act2End,
                    percentage: '25%',
                    description: 'Cao trào, kết thúc'
                }
            };
        }

        function analyzePlotElements(content) {
            const plotKeywords = {
                'Mở đầu': ['bắt đầu', 'khởi đầu', 'ngày xửa ngày xưa', 'một ngày', 'có một'],
                'Xung đột': ['vấn đề', 'khó khăn', 'trở ngại', 'thách thức', 'mâu thuẫn', 'xung đột'],
                'Cao trào': ['cuối cùng', 'quyết định', 'quan trọng', 'then chốt', 'lúc này'],
                'Giải quyết': ['giải quyết', 'kết thúc', 'hoàn thành', 'thành công', 'hạnh phúc'],
                'Kết thúc': ['cuối cùng', 'kết thúc', 'từ đó', 'và thế là', 'sau đó']
            };
            
            const elements = {};
            Object.entries(plotKeywords).forEach(([element, keywords]) => {
                const count = keywords.reduce((acc, keyword) => {
                    return acc + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
                }, 0);
                elements[element] = count;
            });
            
            return elements;
        }

        function analyzeConflict(content) {
            const conflictTypes = {
                'Nội tâm': ['suy nghĩ', 'băn khoăn', 'lo lắng', 'quyết định', 'lựa chọn'],
                'Nhân vật': ['cãi nhau', 'tranh cãi', 'bất đồng', 'mâu thuẫn', 'xung đột'],
                'Xã hội': ['xã hội', 'luật pháp', 'quy tắc', 'truyền thống', 'phản đối'],
                'Thiên nhiên': ['bão tố', 'lũ lụt', 'động đất', 'thiên tai', 'thời tiết']
            };
            
            const conflicts = [];
            Object.entries(conflictTypes).forEach(([type, keywords]) => {
                const mentions = keywords.reduce((count, keyword) => {
                    return count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
                }, 0);
                if (mentions > 0) {
                    conflicts.push({ type, mentions });
                }
            });
            
            return conflicts.sort((a, b) => b.mentions - a.mentions);
        }

        function analyzePacing(paragraphs) {
            const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0) / paragraphs.length;
            
            return {
                averageParagraphLength: Math.round(avgParagraphLength),
                pacing: avgParagraphLength > 100 ? 'Chậm' : avgParagraphLength > 50 ? 'Vừa phải' : 'Nhanh',
                rhythm: paragraphs.length > 10 ? 'Nhiều đoạn ngắn' : 'Ít đoạn dài'
            };
        }

    function identifyClimax(content) {
    const climaxIndicators = ['đột nhiên', 'bất ngờ', 'lúc này', 'cuối cùng', 'quyết định', 'quan trọng nhất'];
    const sentences = content.split(/[.!?]+/);
    
    let climaxSentence = '';
    let maxIndicators = 0;
    
    sentences.forEach(sentence => {
        const indicatorCount = climaxIndicators.reduce((count, indicator) => {
            return count + (sentence.toLowerCase().includes(indicator) ? 1 : 0);
        }, 0); // <-- Added missing closing parenthesis
        
        if (indicatorCount > maxIndicators) {
            maxIndicators = indicatorCount;
            climaxSentence = sentence.trim();
        }
    });
    
    return {
        identified: maxIndicators > 0,
        sentence: climaxSentence,
        indicatorCount: maxIndicators
    };
} // <-- Added missing closing brace