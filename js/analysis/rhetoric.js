function analyzeRhetoricalDevices(content) {
            const devices = {};
            
            // Phân tích ẩn dụ
            devices.metaphor = analyzeMetaphor(content);
            
            // Phân tích nhân hóa
            devices.personification = analyzePersonification(content);
            
            // Phân tích so sánh
            devices.simile = analyzeSimile(content);
            
            // Phân tích lặp từ
            devices.repetition = analyzeRepetition(content);
            
            // Phân tích câu hỏi tu từ
            devices.rhetorical_question = analyzeRhetoricalQuestion(content);
            
            // Phân tích tương phản
            devices.contrast = analyzeContrast(content);
            
            return devices;
        }

        function analyzeMetaphor(content) {
            const metaphorIndicators = ['là', 'như', 'tựa như', 'giống như', 'chính là'];
            const metaphors = [];
            const sentences = content.split(/[.!?]+/);
            
            sentences.forEach(sentence => {
                metaphorIndicators.forEach(indicator => {
                    if (sentence.toLowerCase().includes(indicator)) {
                        const words = sentence.split(/\s+/);
                        if (words.length > 5 && words.length < 20) {
                            metaphors.push(sentence.trim());
                        }
                    }
                });
            });
            
            return {
                count: metaphors.length,
                examples: metaphors.slice(0, 3)
            };
        }

        function analyzePersonification(content) {
            const personificationPatterns = [
                /\b(mặt trời|trăng|gió|nước|cây|hoa|lá)\s+(cười|khóc|nói|hát|thì thầm|buồn|vui)/gi,
                /\b(rừng|núi|sông|biển)\s+(gọi|kêu|la|hét|thở)/gi
            ];
            
            const personifications = [];
            personificationPatterns.forEach(pattern => {
                const matches = content.match(pattern);
                if (matches) {
                    personifications.push(...matches);
                }
            });
            
            return {
                count: personifications.length,
                examples: personifications.slice(0, 3)
            };
        }

        function analyzeSimile(content) {
            const similePatterns = [
                /\w+\s+(như|tựa|giống)\s+\w+/gi,
                /\w+\s+(bằng|hơn)\s+\w+/gi
            ];
            
            const similes = [];
            similePatterns.forEach(pattern => {
                const matches = content.match(pattern);
                if (matches) {
                    similes.push(...matches);
                }
            });
            
            return {
                count: similes.length,
                examples: similes.slice(0, 3)
            };
        }

        function analyzeRepetition(content) {
            const words = content.toLowerCase().split(/\s+/);
            const wordCount = {};
            
            words.forEach(word => {
                const cleanWord = word.replace(/[^\wàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi, '');
                if (cleanWord.length > 3 && !vietnameseStopWords.includes(cleanWord)) {
                    wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
                }
            });
            
            const repeatedWords = Object.entries(wordCount)
                .filter(([word, count]) => count >= 3)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5);
            
            return {
                count: repeatedWords.length,
                words: repeatedWords.map(([word, count]) => ({ word, count }))
            };
        }

        function analyzeRhetoricalQuestion(content) {
            const questions = content.match(/[^.!?]*\?/g) || [];
            const rhetoricalIndicators = ['há', 'chẳng', 'không phải', 'có phải', 'sao'];
            
            const rhetoricalQuestions = questions.filter(q => {
                return rhetoricalIndicators.some(indicator => 
                    q.toLowerCase().includes(indicator)
                );
            });
            
            return {
                totalQuestions: questions.length,
                rhetoricalCount: rhetoricalQuestions.length,
                examples: rhetoricalQuestions.slice(0, 2)
            };
        }

        function analyzeContrast(content) {
            const contrastWords = ['nhưng', 'tuy nhiên', 'trái lại', 'ngược lại', 'khác với', 'mặt khác'];
            const contrasts = [];
            
            contrastWords.forEach(word => {
                const matches = content.toLowerCase().match(new RegExp(word, 'g'));
                if (matches) {
                    contrasts.push(...matches);
                }