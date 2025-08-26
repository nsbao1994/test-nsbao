function analyzeCharactersAdvanced(content) {
            const characters = [];
            
            // Tìm tên nhân vật (cải tiến)
            const namePattern = /\b[A-ZÀ-Ỹ][a-zà-ỹ]{2,15}(?:\s[A-ZÀ-Ỹ][a-zà-ỹ]{2,15})*\b/g;
            const potentialNames = content.match(namePattern) || [];
            
            // Đếm tần suất xuất hiện
            const nameCounts = {};
            potentialNames.forEach(name => {
                if (name.length > 2 && name.length < 30 && !isCommonWord(name)) {
                    nameCounts[name] = (nameCounts[name] || 0) + 1;
                }
            });
            
            // Lọc và phân tích nhân vật
            Object.entries(nameCounts)
                .filter(([name, count]) => count >= 2)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .forEach(([name, count]) => {
                    const characterInfo = analyzeCharacterTraits(content, name);
                    characters.push({
                        name: name,
                        appearances: count,
                        importance: count > 5 ? 'Chính' : count > 2 ? 'Phụ' : 'Nền',
                        traits: characterInfo.traits,
                        emotions: characterInfo.emotions,
                        relationships: characterInfo.relationships
                    });
                });
            
            return {
                characterCount: characters.length,
                characters: characters,
                characterDevelopment: analyzeCharacterDevelopment(content, characters)
            };
        }

        function isCommonWord(word) {
            const commonWords = ['Việt', 'Nam', 'Hà', 'Nội', 'Sài', 'Gòn', 'Thành', 'Phố', 'Chúa', 'Phật', 'Tháng', 'Năm'];
            return commonWords.some(common => word.includes(common));
        }

        function analyzeCharacterTraits(content, characterName) {
            const traitKeywords = {
                'Tốt bụng': ['tốt bụng', 'tử tế', 'hảo tâm', 'nhân hậu', 'tốt'],
                'Thông minh': ['thông minh', 'khôn ngoan', 'sáng suốt', 'trí tuệ', 'học giỏi'],
                'Dũng cảm': ['dũng cảm', 'can đảm', 'anh hùng', 'gan dạ', 'không sợ'],
                'Tình cảm': ['yêu thương', 'quan tâm', 'chăm sóc', 'ấm áp', 'tình cảm'],
                'Quyết đoán': ['quyết đoán', 'mạnh mẽ', 'kiên quyết', 'cương quyết']
            };
            
            const traits = [];
            const emotions = [];
            
            // Tìm câu chứa tên nhân vật
            const sentences = content.split(/[.!?]+/);
            const characterSentences = sentences.filter(s => s.includes(characterName));
            
            Object.entries(traitKeywords).forEach(([trait, keywords]) => {
                const mentions = keywords.reduce((count, keyword) => {
                    return count + characterSentences.reduce((acc, sentence) => {
                        return acc + (sentence.toLowerCase().includes(keyword) ? 1 : 0);
                    }, 0);
                }, 0);
                if (mentions > 0) {
                    traits.push({ trait, mentions });
                }
            });
            
            // Phân tích cảm xúc của nhân vật
            Object.entries(emotionalWords).forEach(([emotion, words]) => {
                const mentions = words.reduce((count, word) => {
                    return count + characterSentences.reduce((acc, sentence) => {
                        return acc + (sentence.toLowerCase().includes(word) ? 1 : 0);
                    }, 0);
                }, 0);
                if (mentions > 0) {
                    emotions.push({ emotion, mentions });
                }
            });
            
            return {
                traits: traits.sort((a, b) => b.mentions - a.mentions),
                emotions: emotions.sort((a, b) => b.mentions - a.mentions),
                relationships: analyzeRelationships(content, characterName)
            };
        }

        function analyzeRelationships(content, characterName) {
            const relationshipKeywords = ['và', 'cùng', 'với', 'yêu', 'thương', 'bạn', 'người yêu', 'vợ', 'chồng', 'con', 'mẹ', 'bố'];
            const sentences = content.split(/[.!?]+/);
            const relationships = [];
            
            sentences.forEach(sentence => {
                if (sentence.includes(characterName)) {
                    relationshipKeywords.forEach(keyword => {
                        if (sentence.toLowerCase().includes(keyword)) {
                            relationships.push({
                                type: keyword,
                                context: sentence.trim().substring(0, 100)
                            });
                        }
                    });
                }
            });
            
            return relationships.slice(0, 5);
        }

        function analyzeCharacterDevelopment(content, characters) {
            if (characters.length === 0) return 'Không có nhân vật rõ ràng';
            
            const mainCharacter = characters[0];
            const developmentIndicators = ['học được', 'thay đổi', 'trưởng thành', 'nhận ra', 'hiểu được'];
            
            const developmentMentions = developmentIndicators.reduce((count, indicator) => {
                return count + (content.toLowerCase().match(new RegExp(indicator, 'g')) || []).length;
            }