function analyzeWritingStyleAdvanced(content) {
            const sentences = content.split(/[.!?]+/).filter(s => s.trim());
            const words = content.split(/\s+/);
            const avgSentenceLength = words.length / sentences.length;
            
            // Phân tích góc nhìn
            const perspective = analyzePerspective(content);
            
            // Phân tích thì
            const tenseAnalysis = analyzeTense(content);
            
            // Phân tích giọng điệu
            const toneAnalysis = analyzeTone(content);
            
            // Phân tích độ phức tạp
            const complexityAnalysis = analyzeComplexity(content, avgSentenceLength);
            
            return {
                perspective: perspective,
                tense: tenseAnalysis,
                tone: toneAnalysis,
                complexity: complexityAnalysis,
                averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
                writingStyle: determineWritingStyle(avgSentenceLength, perspective, toneAnalysis)
            };
        }

        function analyzePerspective(content) {
            const firstPerson = (content.match(/\b(tôi|mình|ta)\b/gi) || []).length;
            const secondPerson = (content.match(/\b(bạn|anh|chị|em)\b/gi) || []).length;
            const thirdPerson = (content.match(/\b(họ|cô ấy|anh ấy|chúng)\b/gi) || []).length;
            
            const total = firstPerson + secondPerson + thirdPerson;
            if (total === 0) return 'Không xác định';
            
            const max = Math.max(firstPerson, secondPerson, thirdPerson);
            if (max === firstPerson) return 'Ngôi thứ nhất';
            if (max === secondPerson) return 'Ngôi thứ hai';
            return 'Ngôi thứ ba';
        }

        function analyzeTense(content) {
            const pastTense = (content.match(/\b(đã|đã từng|trước đây|hôm qua)\b/gi) || []).length;
            const presentTense = (content.match(/\b(đang|hiện tại|bây giờ|hôm nay)\b/gi) || []).length;
            const futureTense = (content.match(/\b(sẽ|sắp|mai|tương lai)\b/gi) || []).length;
            
            const total = pastTense + presentTense + futureTense;
            if (total === 0) return 'Không xác định';
            
            return {
                past: { count: pastTense, percentage: ((pastTense / total) * 100).toFixed(1) + '%' },
                present: { count: presentTense, percentage: ((presentTense / total) * 100).toFixed(1) + '%' },
                future: { count: futureTense, percentage: ((futureTense / total) * 100).toFixed(1) + '%' }
            };
        }

        function analyzeTone(content) {
            const formalWords = ['kính thưa', 'xin chào', 'cảm ơn', 'xin lỗi', 'kính trọng'];
            const informalWords = ['ủa', 'ơi', 'nè', 'à', 'hả', 'thế à'];
            const questionMarks = (content.match(/\?/g) || []).length;
            const exclamationMarks = (content.match(/!/g) || []).length;
            
            const formalCount = formalWords.reduce((count, word) => {
                return count + (content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
            }, 0);
            
            const informalCount = informalWords.reduce((count, word) => {
                return count + (content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
            }, 0);
            
            return {
                formality: formalCount > informalCount ? 'Trang trọng' : informalCount > formalCount ? 'Thân mật' : 'Trung tính',
                questionCount: questionMarks,
                exclamationCount: exclamationMarks,
                expressiveness: exclamationMarks > questionMarks ? 'Cảm xúc' : questionMarks > 0 ? 'Tương tác' : 'Tường thuật'
            };
        }

        function analyzeComplexity(content, avgSentenceLength) {
            const complexWords = content.split(/\s+/).filter(word => word.length > 8).length;
            const totalWords = content.split(/\s+/).length;
            const complexityRatio = (complexWords / totalWords) * 100;
            
            return {
                lexicalComplexity: complexityRatio.toFixed(1) + '%',
                syntacticComplexity: avgSentenceLength > 20 ? 'Cao' : avgSentenceLength > 12 ? 'Trung bình' : 'Thấp',
                overallComplexity: complexityRatio > 15 && avgSentenceLength > 20 ? 'Phức tạp' : 
                                 complexityRatio > 10 || avgSentenceLength > 15 ? 'Trung bình' : 'Đơn giản'
            };
        }

        function determineWritingStyle(avgSentenceLength, perspective, toneAnalysis) {
            const styles = [];
            
            if (avgSentenceLength > 20) styles.push('Văn xuôi dài');
            else if (avgSentenceLength < 10) styles.push('Văn xuôi ngắn');
            
            if (toneAnalysis.formality === 'Trang trọng') styles.push('Trang trọng');
            else if (toneAnalysis.formality === 'Thân mật') styles.push('Thân mật');
            
            if (toneAnalysis.expressiveness === 'Cảm xúc') styles.push('Biểu cảm');
            
            if (perspective === 'Ngôi thứ nhất') styles.push('Tự sự');
            
            return styles.length > 0 ? styles.join(', ') : 'Trung tính';
        }