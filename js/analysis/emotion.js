function analyzeEmotionsAdvanced(content) {
            const emotionAnalysis = {};
            const sentences = content.split(/[.!?]+/).filter(s => s.trim());
            
            // Phân tích cảm xúc tổng thể
            Object.entries(emotionalWords).forEach(([category, words]) => {
                const mentions = words.reduce((count, word) => {
                    return count + (content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
                }, 0);
                emotionAnalysis[category] = {
                    count: mentions,
                    percentage: ((mentions / sentences.length) * 100).toFixed(1) + '%'
                };
            });
            
            // Phân tích biến thiên cảm xúc
            const emotionalJourney = analyzeEmotionalJourney(content);
            
            // Cường độ cảm xúc
            const emotionalIntensity = analyzeEmotionalIntensity(content);
            
            return {
                overallTone: determineOverallTone(emotionAnalysis),
                emotionBreakdown: emotionAnalysis,
                emotionalJourney: emotionalJourney,
                emotionalIntensity: emotionalIntensity,
                sentimentScore: calculateSentimentScore(emotionAnalysis)
            };
        }

        function analyzeEmotionalJourney(content) {
            const sections = content.split(/\n\s*\n/);
            const journey = [];
            
            sections.forEach((section, index) => {
                const sectionEmotions = {};
                Object.entries(emotionalWords).forEach(([category, words]) => {
                    const count = words.reduce((acc, word) => {
                        return acc + (section.toLowerCase().match(new RegExp(word, 'g')) || []).length;
                    }, 0);
                    sectionEmotions[category] = count;
                });
                
                const dominantEmotion = Object.entries(sectionEmotions)
                    .sort(([,a], [,b]) => b - a)[0];
                
                if (dominantEmotion && dominantEmotion[1] > 0) {
                    journey.push({
                        section: index + 1,
                        emotion: dominantEmotion[0],
                        intensity: dominantEmotion[1]
                    });
                }
            });
            
            return journey;
        }

        function analyzeEmotionalIntensity(content) {
            const intensifiers = ['rất', 'quá', 'cực kỳ', 'vô cùng', 'hết sức', 'tuyệt vời', 'kinh khủng'];
            const intensityCount = intensifiers.reduce((count, word) => {
                return count + (content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
            }, 0);
            
            const words = content.split(/\s+/).length;
            const intensityRatio = (intensityCount / words) * 100;
            
            return {
                intensifierCount: intensityCount,
                intensityLevel: intensityRatio > 2 ? 'Cao' : intensityRatio > 1 ? 'Trung bình' : 'Thấp',
                intensityRatio: intensityRatio.toFixed(2) + '%'
            };
        }

        function determineOverallTone(emotionAnalysis) {
            const positive = emotionAnalysis.positive?.count || 0;
            const negative = emotionAnalysis.negative?.count || 0;
            const neutral = emotionAnalysis.neutral?.count || 0;
            
            if (positive > negative && positive > neutral) return 'Tích cực';
            if (negative > positive && negative > neutral) return 'Tiêu cực';
            return 'Trung tính';
        }

        function calculateSentimentScore(emotionAnalysis) {
            const positive = emotionAnalysis.positive?.count || 0;
            const negative = emotionAnalysis.negative?.count || 0;
            const total = positive + negative;
            
            if (total === 0) return 0;
            return ((positive - negative) / total * 100).toFixed(1);
        }