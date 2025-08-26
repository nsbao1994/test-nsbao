function analyzeLinguistics(content) {
            const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            
            // Phân loại từ loại (đơn giản)
            const wordTypes = classifyWordTypes(words);
            
            // Phân tích tần suất từ
            const wordFrequency = analyzeWordFrequency(words);
            
            // Độ phức tạp từ vựng
            const vocabularyComplexity = analyzeVocabularyComplexity(words);
            
            return {
                wordTypes: wordTypes,
                topWords: wordFrequency.slice(0, 20),
                vocabularyComplexity: vocabularyComplexity,
                uniqueWordRatio: (new Set(words).size / words.length * 100).toFixed(2) + '%'
            }
// Phân tích ngôn ngữ tiếng Việt
class LinguisticAnalyzer {
    analyzeText(text) {
        const sentences = this.splitIntoSentences(text);
        const words = this.splitIntoWords(text);
        
        return {
            sentenceCount: sentences.length,
            wordCount: words.length,
            avgSentenceLength: words.length / sentences.length,
            vocabularyDiversity: this.calculateVocabularyDiversity(words),
            emotionWordRatio: this.calculateEmotionWordRatio(words),
            writingStyle: this.analyzeWritingStyle(sentences, words)
        };
    }
    
    splitIntoSentences(text) {
        // Tách câu tiếng Việt
        return text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s/);
    }
    
    splitIntoWords(text) {
        // Tách từ tiếng Việt
        return text.split(/\s+/).filter(word => word.length > 0);
    }
    
    calculateVocabularyDiversity(words) {
        const uniqueWords = new Set(words.map(word => word.toLowerCase()));
        return (uniqueWords.size / words.length) * 100;
    }
    
    calculateEmotionWordRatio(words) {
        const emotionWords = words.filter(word => 
            vietnameseEmotionWords.includes(word.toLowerCase())
        );
        return (emotionWords.length / words.length) * 100;
    }
    
    analyzeWritingStyle(sentences, words) {
        const avgWordLength = words.join('').length / words.length;
        const avgSentenceLength = words.length / sentences.length;
        
        if (avgSentenceLength > 20 && avgWordLength > 5) {
            return "Phức tạp, trang trọng";
        } else if (avgSentenceLength > 15 && avgWordLength > 4) {
            return "Trung bình, mô tả";
        } else {
            return "Đơn giản, trực tiếp";
        }
    }
}