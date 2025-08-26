// Display advanced analysis results
        function displayAdvancedAnalysisResults() {
            const container = document.getElementById('analysisResults');
            container.innerHTML = '';
            
            // Add summary statistics
            const summary = generateDisplaySummary();
            container.appendChild(summary);
            
            analysisData.forEach((analysis, index) => {
                if (analysis.error) {
                    container.innerHTML += `
                        <div class="file-card">
                            <div class="file-header">
                                <span class="file-name">❌ ${analysis.fileName}</span>
                            </div>
                            <div class="error">Lỗi: ${analysis.error}</div>
                        </div>
                    `;
                    return;
                }
                
                const card = createAnalysisCard(analysis, index);
                container.appendChild(card);
            });
        }

        function generateDisplaySummary() {
            const summary = document.createElement('div');
            summary.className = 'file-card';
            
            const totalFiles = analysisData.filter(a => !a.error).length;
            const totalWords = analysisData.reduce((sum, a) => 
                sum + (a.basicStats?.wordCount || 0), 0);
            const avgWordsPerFile = Math.round(totalWords / totalFiles);
            
            summary.innerHTML = `
                <div class="file-header">
                    <span class="file-name">📊 Tổng quan kết quả phân tích</span>
                    <small>Cập nhật: ${new Date().toLocaleString('vi-VN')}</small>
                </div>
                <div class="stats-summary">
                    <div class="stat-card">
                        <div class="stat-number">${totalFiles}</div>
                        <div class="stat-label">File đã phân tích</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalWords.toLocaleString()}</div>
                        <div class="stat-label">Tổng từ vựng</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${avgWordsPerFile}</div>
                        <div class="stat-label">Trung bình từ/file</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Math.round(totalWords / 250)}</div>
                        <div class="stat-label">Phút đọc ước tính</div>
                    </div>
                </div>
            `;
            
            return summary;
        }

        function createAnalysisCard(analysis, index) {
            const card = document.createElement('div');
            card.className = 'file-card';
            
            card.innerHTML = `
                <div class="file-header">
                    <span class="file-name">📄 ${analysis.fileName}</span>
                    <small>📁 ${analysis.folderPath} | ⏰ ${analysis.timestamp}</small>
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    📊 Thống kê cơ bản
                </button>
                <div class="collapsible-content">
                    ${createBasicStatsSection(analysis.basicStats)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    🔤 Phân tích ngôn ngữ học
                </button>
                <div class="collapsible-content">
                    ${createLinguisticSection(analysis.linguisticAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    👥 Phân tích nhân vật
                </button>
                <div class="collapsible-content">
                    ${createCharacterSection(analysis.characterAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    😊 Phân tích cảm xúc
                </button>
                <div class="collapsible-content">
                    ${createEmotionalSection(analysis.emotionalAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    🎭 Chủ đề và ý nghĩa
                </button>
                <div class="collapsible-content">
                    ${createThematicSection(analysis.thematicAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    ✍️ Phong cách viết
                </button>
                <div class="collapsible-content">
                    ${createStyleSection(analysis.styleAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    📖 Cấu trúc cốt truyện
                </button>
                <div class="collapsible-content">
                    ${createNarrativeSection(analysis.narrativeAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    🌍 Bối cảnh
                </button>
                <div class="collapsible-content">
                    ${createContextSection(analysis.contextAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    🎨 Biện pháp tu từ
                </button>
                <div class="collapsible-content">
                    ${createRhetoricSection(analysis.rhetoricAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    📚 Phân tích từ vựng
                </button>
                <div class="collapsible-content">
                    ${createVocabularySection(analysis.vocabularyAnalysis)}
                </div>
                
                <button class="collapsible" onclick="toggleCollapsible(this)">
                    📝 Đoạn trích gốc
                </button>
                <div class="collapsible-content">
                    <div class="story-output">${analysis.contentSample}</div>
                </div>
            `;
            
            return card;
        }

        // Section creators for different analysis types
        function createBasicStatsSection(stats) {
            if (!stats) return '<p>Không có dữ liệu thống kê cơ bản</p>';
            
            return `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>📝 Số từ</h5>
                        <p>${stats.wordCount} từ</p>
                    </div>
                    <div class="analysis-item">
                        <h5>📄 Số câu</h5>
                        <p>${stats.sentenceCount} câu</p>
                    </div>
                    <div class="analysis-item">
                        <h5>📑 Số đoạn văn</h5>
                        <p>${stats.paragraphCount} đoạn</p>
                    </div>
                    <div class="analysis-item">
                        <h5>🔤 Số ký tự</h5>
                        <p>${stats.characterCount} ký tự</p>
                    </div>
                    <div class="analysis-item">
                        <h5>📏 Trung bình từ/câu</h5>
                        <p>${stats.avgWordsPerSentence} từ</p>
                    </div>
                    <div class="analysis-item">
                        <h5>📊 Trung bình câu/đoạn</h5>
                        <p>${stats.avgSentencesPerParagraph} câu</p>
                    </div>
                </div>
            `;
        }

        function createLinguisticSection(linguistic) {
            if (!linguistic) return '<p>Không có dữ liệu phân tích ngôn ngữ</p>';
            
            let html = '<div class="linguistic-chart"><h5>Phân loại từ loại</h5>';
            linguistic.wordTypes.forEach(type => {
                html += `
                    <div class="chart-bar">
                        <div class="chart-label">${type.type}</div>
                        <div class="chart-progress">
                            <div class="chart-fill" style="width: ${type.percentage}"></div>
                        </div>
                        <div class="chart-value">${type.count}</div>
                    </div>
                `;
            });
            html += '</div>';
            
            // Top words
            html += '<div class="linguistic-chart"><h5>Từ xuất hiện nhiều nhất</h5>';
            html += '<div class="word-cloud">';
            linguistic.topWords.slice(0, 15).forEach(wordData => {
                html += `<span class="word-item">${wordData.word} (${wordData.count})</span>`;
            });
            html += '</div></div>';
            
            // Vocabulary complexity
            html += `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>Độ phong phú từ vựng</h5>
                        <p>${linguistic.uniqueWordRatio}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Độ phức tạp từ vựng</h5>
                        <p>${linguistic.vocabularyComplexity.lexicalDiversity}</p>
                    </div>
                </div>
            `;
            
            return html;
        }

        function createCharacterSection(characterAnalysis) {
            if (!characterAnalysis || !characterAnalysis.characters) return '<p>Không tìm thấy nhân vật rõ ràng</p>';
            
            let html = `<p><strong>Số nhân vật:</strong> ${characterAnalysis.characterCount}</p>`;
            html += `<p><strong>Sự phát triển:</strong> ${characterAnalysis.characterDevelopment}</p>`;
            
            if (characterAnalysis.characters.length > 0) {
                html += '<div class="analysis-grid">';
                characterAnalysis.characters.forEach(char => {
                    html += `
                        <div class="analysis-item">
                            <h5>${char.name}</h5>
                            <p><strong>Xuất hiện:</strong> ${char.appearances} lần</p>
                            <p><strong>Vai trò:</strong> ${char.importance}</p>
                            ${char.traits.length > 0 ? `<p><strong>Tính cách:</strong> ${char.traits.map(t => t.trait).join(', ')}</p>` : ''}
                            ${char.emotions.length > 0 ? `<p><strong>Cảm xúc:</strong> ${char.emotions.map(e => e.emotion).join(', ')}</p>` : ''}
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            return html;
        }

        function createEmotionalSection(emotional) {
            if (!emotional) return '<p>Không có dữ liệu cảm xúc</p>';
            
            let html = `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>Tông điệu tổng thể</h5>
                        <p><span class="sentiment-indicator sentiment-${emotional.overallTone === 'Tích cực' ? 'positive' : emotional.overallTone === 'Tiêu cực' ? 'negative' : 'neutral'}"></span>${emotional.overallTone}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Điểm cảm xúc</h5>
                        <p>${emotional.sentimentScore}%</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Cường độ cảm xúc</h5>
                        <p>${emotional.emotionalIntensity?.intensityLevel || 'Không xác định'}</p>
                    </div>
                </div>
            `;
            
            // Emotion breakdown chart
            html += '<div class="linguistic-chart"><h5>Phân tích cảm xúc chi tiết</h5>';
            Object.entries(emotional.emotionBreakdown).forEach(([emotion, data]) => {
                if (data.count > 0) {
                    html += `
                        <div class="chart-bar">
                            <div class="chart-label">${emotion}</div>
                            <div class="chart-progress">
                                <div class="chart-fill" style="width: ${data.percentage}"></div>
                            </div>
                            <div class="chart-value">${data.count}</div>
                        </div>
                    `;
                }
            });
            html += '</div>';
            
            // Emotional journey
            if (emotional.emotionalJourney && emotional.emotionalJourney.length > 0) {
                html += '<div class="analysis-item"><h5>Hành trình cảm xúc</h5>';
                emotional.emotionalJourney.forEach(journey => {
                    html += `<span class="tag">Phần ${journey.section}: ${journey.emotion} (${journey.intensity})</span>`;
                });
                html += '</div>';
            }
            
            return html;
        }

        function createThematicSection(thematic) {
            if (!thematic || !thematic.mainThemes) return '<p>Không có dữ liệu chủ đề</p>';
            
            let html = `<p><strong>Độ phức tạp chủ đề:</strong> ${thematic.thematicComplexity}</p>`;
            
            if (thematic.mainThemes.length > 0) {
                html += '<div class="linguistic-chart"><h5>Chủ đề chính</h5>';
                thematic.mainThemes.forEach(theme => {
                    const percentage = (theme.mentions * 5).toString(); // Scale for visualization
                    html += `
                        <div class="chart-bar">
                            <div class="chart-label">${theme.theme}</div>
                            <div class="chart-progress">
                                <div class="chart-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                            </div>
                            <div class="chart-value">${theme.mentions}</div>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            return html;
        }

        function createStyleSection(style) {
            if (!style) return '<p>Không có dữ liệu phong cách</p>';
            
            return `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>Góc nhìn</h5>
                        <p>${style.perspective}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Giọng điệu</h5>
                        <p>${style.tone?.formality || 'Không xác định'}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Độ phức tạp</h5>
                        <p>${style.complexity?.overallComplexity || 'Không xác định'}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Độ dài câu TB</h5>
                        <p>${style.averageSentenceLength} từ</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Phong cách viết</h5>
                        <p>${style.writingStyle}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Tính biểu cảm</h5>
                        <p>${style.tone?.expressiveness || 'Không xác định'}</p>
                    </div>
                </div>
            `;
        }

        function createNarrativeSection(narrative) {
            if (!narrative) return '<p>Không có dữ liệu cốt truyện</p>';
            
            let html = '';
            
            // Plot structure
            if (narrative.structure) {
                html += '<div class="linguistic-chart"><h5>Cấu trúc ba hồi</h5>';
                Object.entries(narrative.structure).forEach(([act, info]) => {
                    html += `
                        <div class="chart-bar">
                            <div class="chart-label">${act.toUpperCase()}</div>
                            <div class="chart-progress">
                                <div class="chart-fill" style="width: ${info.percentage}"></div>
                            </div>
                            <div class="chart-value">${info.paragraphs}</div>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            // Plot elements and pacing
            html += `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>Nhịp độ</h5>
                        <p>${narrative.pacing?.pacing || 'Không xác định'}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Cấu trúc đoạn văn</h5>
                        <p>${narrative.pacing?.rhythm || 'Không xác định'}</p>
                    </div>
                </div>
            `;
            
            // Conflicts
            if (narrative.conflict && narrative.conflict.length > 0) {
                html += '<div class="analysis-item"><h5>Loại xung đột</h5>';
                narrative.conflict.forEach(conflict => {
                    html += `<span class="tag">${conflict.type} (${conflict.mentions})</span>`;
                });
                html += '</div>';
            }
            
            // Climax
            if (narrative.climax?.identified) {
                html += `
                    <div class="analysis-item">
                        <h5>Cao trào được xác định</h5>
                        <p style="font-style: italic; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                            "${narrative.climax.sentence}"
                        </p>
                    </div>
                `;
            }
            
            return html;
        }

        function createContextSection(context) {
            if (!context) return '<p>Không có dữ liệu bối cảnh</p>';
            
            let html = `<p><strong>Bối cảnh tổng thể:</strong> ${context.overall}</p>`;
            
            // Time context
            if (context.time && Object.keys(context.time).length > 0) {
                html += '<div class="analysis-item"><h5>Bối cảnh thời gian</h5>';
                Object.entries(context.time).forEach(([category, count]) => {
                    html += `<span class="tag">${category}: ${count}</span>`;
                });
                html += '</div>';
            }
            
            // Space context
            if (context.space && Object.keys(context.space).length > 0) {
                html += '<div class="analysis-item"><h5>Bối cảnh không gian</h5>';
                Object.entries(context.space).forEach(([category, count]) => {
                    html += `<span class="tag">${category}: ${count}</span>`;
                });
                html += '</div>';
            }
            
            // Cultural context
            if (context.cultural && Object.keys(context.cultural).length > 0) {
                html += '<div class="analysis-item"><h5>Bối cảnh văn hóa</h5>';
                Object.entries(context.cultural).forEach(([category, count]) => {
                    html += `<span class="tag">${category}: ${count}</span>`;
                });
                html += '</div>';
            }
            
            return html;
        }

        function createRhetoricSection(rhetoric) {
            if (!rhetoric) return '<p>Không có dữ liệu tu từ</p>';
            
            return `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>Ẩn dụ</h5>
                        <p>${rhetoric.metaphor?.count || 0} lần</p>
                        ${rhetoric.metaphor?.examples ? `<small>${rhetoric.metaphor.examples.slice(0, 1).join(', ')}</small>` : ''}
                    </div>
                    <div class="analysis-item">
                        <h5>Nhân hóa</h5>
                        <p>${rhetoric.personification?.count || 0} lần</p>
                        ${rhetoric.personification?.examples ? `<small>${rhetoric.personification.examples.slice(0, 1).join(', ')}</small>` : ''}
                    </div>
                    <div class="analysis-item">
                        <h5>So sánh</h5>
                        <p>${rhetoric.simile?.count || 0} lần</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Lặp từ</h5>
                        <p>${rhetoric.repetition?.count || 0} từ</p>
                        ${rhetoric.repetition?.words ? `<small>${rhetoric.repetition.words.slice(0, 3).map(w => w.word).join(', ')}</small>` : ''}
                    </div>
                    <div class="analysis-item">
                        <h5>Câu hỏi tu từ</h5>
                        <p>${rhetoric.rhetorical_question?.rhetoricalCount || 0}/${rhetoric.rhetorical_question?.totalQuestions || 0}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Tương phản</h5>
                        <p>${rhetoric.contrast?.count || 0} (${rhetoric.contrast?.density || '0%'})</p>
                    </div>
                </div>
            `;
        }

        function createVocabularySection(vocab) {
            if (!vocab) return '<p>Không có dữ liệu từ vựng</p>';
            
            let html = `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>Tổng từ vựng</h5>
                        <p>${vocab.totalWords}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Từ duy nhất</h5>
                        <p>${vocab.uniqueWords}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Độ phong phú</h5>
                        <p>${vocab.vocabularyRichness}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Độ dài từ TB</h5>
                        <p>${vocab.averageWordLength}</p>
                    </div>
                    <div class="analysis-item">
                        <h5>Độ khó đọc</h5>
                        <p>${vocab.readabilityLevel}</p>
                    </div>
                </div>
            `;
            
            // Specialized vocabulary
            if (vocab.specializedVocabulary && Object.keys(vocab.specializedVocabulary).length > 0) {
                html += '<div class="analysis-item"><h5>Từ vựng chuyên ngành</h5>';
                Object.entries(vocab.specializedVocabulary).forEach(([category, count]) => {
                    html += `<span class="tag">${category}: ${count}</span>`;
                });
                html += '</div>';
            }
            
            return html;
        }

        // Utility functions
        function toggleCollapsible(element) {
            element.classList.toggle('active');
            const content = element.nextElementSibling;
            content.classList.toggle('active');
        }

        function updateStatus(message) {
            document.getElementById('statusInfo').innerHTML = `<p>${message}