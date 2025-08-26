function analyzeBasicStats(content) {
            const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
            const words = content.split(/\s+/).filter(w => w.length > 0);
            const characters = content.length;
            const charactersNoSpaces = content.replace(/\s/g, '').length;
            
            return {
                wordCount: words.length,
                sentenceCount: sentences.length,
                paragraphCount: paragraphs.length,
                characterCount: characters,
                characterCountNoSpaces: charactersNoSpaces,
                avgWordsPerSentence: Math.round(words.length / sentences.length * 10) / 10,
                avgSentencesPerParagraph: Math.round(sentences.length / paragraphs.length * 10) / 10,
                avgWordLength: Math.round(charactersNoSpaces / words.length * 10) / 10
            }