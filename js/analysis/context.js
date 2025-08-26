function analyzeContext(content) {
            // Phân tích bối cảnh thời gian
            const timeContext = analyzeTimeContext(content);
            
            // Phân tích bối cảnh không gian
            const spaceContext = analyzeSpaceContext(content);
            
            // Phân tích bối cảnh văn hóa
            const culturalContext = analyzeCulturalContext(content);
            
            // Phân tích bối cảnh xã hội
            const socialContext = analyzeSocialContext(content);
            
            return {
                time: timeContext,
                space: spaceContext,
                cultural: culturalContext,
                social: socialContext,
                overall: determineOverallContext(timeContext, spaceContext, culturalContext)
            };
        }

        function analyzeTimeContext(content) {
            const timeKeywords = {
                'Thời gian trong ngày': ['sáng', 'trưa', 'chiều', 'tối', 'đêm', 'rạng đông', 'hoàng hôn'],
                'Mùa trong năm': ['xuân', 'hạ', 'thu', 'đông', 'mùa xuân', 'mùa hè', 'mùa thu', 'mùa đông'],
                'Thời đại': ['xưa', 'cổ', 'hiện đại', 'ngày nay', 'thế kỷ', 'thời phong kiến', 'thời chiến tranh'],
                'Khoảng thời gian': ['ngày', 'tuần', 'tháng', 'năm', 'thập kỷ', 'một thời gian dài']
            };
            
            const timeAnalysis = {};
            Object.entries(timeKeywords).forEach(([category, keywords]) => {
                const mentions = keywords.reduce((count, keyword) => {
                    return count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
                }, 0);
                if (mentions > 0) {
                    timeAnalysis[category] = mentions;
                }
            });
            
            return timeAnalysis;
        }

        function analyzeSpaceContext(content) {
            const spaceKeywords = {
                'Nông thôn': ['làng', 'quê', 'nông thôn', 'cánh đồng', 'ruộng lúa', 'vườn', 'ao', 'sông nhỏ'],
                'Thành thị': ['thành phố', 'phố', 'đường', 'tòa nhà', 'siêu thị', 'công viên', 'bệnh viện'],
                'Thiên nhiên': ['rừng', 'núi', 'biển', 'sông', 'hồ', 'đồi', 'thác', 'hang động'],
                'Trong nhà': ['nhà', 'phòng', 'bếp', 'phòng ngủ', 'phòng khách', 'sân', 'vườn nhà'],
                'Công cộng': ['trường học', 'bệnh viện', 'chùa', 'chợ', 'công viên', 'thư viện']
            };
            
            const spaceAnalysis = {};
            Object.entries(spaceKeywords).forEach(([category, keywords]) => {
                const mentions = keywords.reduce((count, keyword) => {
                    return count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
                }, 0);
                if (mentions > 0) {
                    spaceAnalysis[category] = mentions;
                }
            });
            
            return spaceAnalysis;
        }

        function analyzeCulturalContext(content) {
            const culturalKeywords = {
                'Truyền thống Việt Nam': ['tết', 'trung thu', 'phật', 'chùa', 'lễ hội', 'bánh chưng', 'áo dài'],
                'Gia đình truyền thống': ['ông bà', 'tổ tiên', 'thờ cúng', 'hiếu thảo', 'gia đình đông con'],
                'Văn hóa hiện đại': ['internet', 'điện thoại', 'facebook', 'công nghệ', 'toàn cầu hóa'],
                'Giáo dục': ['học hành', 'tri thức', 'sách vở', 'thầy cô', 'đại học', 'bằng cấp']
            };
            
            const culturalAnalysis = {};
            Object.entries(culturalKeywords).forEach(([category, keywords]) => {
                const mentions = keywords.reduce((count, keyword) => {
                    return count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
                }, 0);
                if (mentions > 0) {
                    culturalAnalysis[category] = mentions;
                }
            });
            
            return culturalAnalysis;
        }

        function analyzeSocialContext(content) {
            const socialKeywords = {
                'Giai tầng xã hội': ['giàu', 'nghèo', 'trung lưu', 'công nhân', 'nông dân', 'trí thức'],
                'Quan hệ xã hội': ['cộng đồng', 'hàng xóm', 'bạn bè', 'đồng nghiệp', 'xã hội'],
                'Vấn đề xã hội': ['bất công', 'nghèo đói', 'thất nghiệp', 'tệ nạn', 'tham nhũng']
            };
            
            const socialAnalysis = {};
            Object.entries(socialKeywords).forEach(([category, keywords]) => {
                const mentions = keywords.reduce((count, keyword) => {
                    return count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
                }, 0);
                if (mentions > 0) {
                    socialAnalysis[category] = mentions;
                }
            });
            
            return socialAnalysis;
        }

        function determineOverallContext(timeContext, spaceContext, culturalContext) {
            const contexts = [];
            
            // Xác định bối cảnh chính
            const topTime = Object.entries(timeContext).sort(([,a], [,b]) => b - a)[0];
            const topSpace = Object.entries(spaceContext).sort(([,a], [,b]) => b - a)[0];
            const topCultural = Object.entries(culturalContext).sort(([,a], [,b]) => b - a)[0];
            
            if (topTime) contexts.push(topTime[0]);
            if (topSpace) contexts.push(topSpace[0]);
            if (topCultural) contexts.push(topCultural[0]);
            
            return contexts.join(' - ') || 'Không xác định rõ';
        }