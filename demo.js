// Demo scenarios
const scenarios = {
    expert: {
        name: "전문가 등록 시나리오",
        steps: [
            {
                type: 'bot',
                message: '안녕하세요! 전문가 등록을 도와드리겠습니다. 🎓',
                delay: 0
            },
            {
                type: 'bot',
                message: '먼저 전문 분야를 등록해보시겠어요?',
                delay: 1500
            },
            {
                type: 'user',
                message: '네, CMP 공정 전문가로 등록하고 싶습니다.',
                delay: 2500
            },
            {
                type: 'api',
                method: 'POST',
                endpoint: '/api/v1/register-specialty',
                data: {
                    userId: "U123456",
                    userName: "김삼성",
                    specialties: ["CMP 공정", "스크래치 불량 분석", "표면 결함 검사"],
                    department: "반도체연구소",
                    experience: "5년"
                },
                delay: 3500
            },
            {
                type: 'bot',
                message: '축하합니다! 전문가로 등록되었습니다. ✅\n\n등록된 전문 분야:\n• CMP 공정\n• 스크래치 불량 분석\n• 표면 결함 검사',
                delay: 5000
            },
            {
                type: 'notification',
                title: '새로운 질문 할당',
                message: 'CMP 공정 관련 질문이 도착했습니다!',
                delay: 7000
            },
            {
                type: 'bot',
                message: '방금 CMP 공정 관련 질문이 할당되었습니다. 확인해보시겠어요?',
                delay: 7500
            },
            {
                type: 'user',
                message: '네, 할당된 질문을 확인하고 싶습니다.',
                delay: 8500
            },
            {
                type: 'api',
                method: 'GET',
                endpoint: '/api/v1/assigned-questions/U123456',
                delay: 9500
            },
            {
                type: 'bot',
                message: '다음 질문이 할당되었습니다:\n\n"CMP 공정 후 웨이퍼 표면에 미세 스크래치가 발생했습니다. 원인과 개선 방법을 알고 싶습니다."\n\n답변하시겠습니까?',
                delay: 11000
            },
            {
                type: 'user',
                message: '네, 답변하겠습니다. CMP 스크래치의 주요 원인은 패드 컨디셔닝 불량과 슬러리 응집입니다.',
                delay: 12500
            },
            {
                type: 'api',
                method: 'POST',
                endpoint: '/api/v1/submit-answer',
                data: {
                    userId: "U123456",
                    questionId: "Q202403150001",
                    answer: "CMP 스크래치의 주요 원인은 다음과 같습니다:\n1. 패드 컨디셔닝 불량\n2. 슬러리 응집\n3. 패드 수명 초과\n\n개선 방법:\n- 패드 컨디셔닝 주기 조정\n- 슬러리 필터링 강화\n- 정기적인 패드 교체",
                    references: ["SOP-CMP-001", "불량분석가이드-v2.1"]
                },
                delay: 14000
            },
            {
                type: 'bot',
                message: '답변이 성공적으로 제출되었습니다! 👏\n\n획득한 포인트: 10점\n현재 레벨: 1',
                delay: 15500
            }
        ]
    },
    asker: {
        name: "질문자 시나리오",
        steps: [
            {
                type: 'bot',
                message: '안녕하세요! 무엇을 도와드릴까요? 🤔',
                delay: 0
            },
            {
                type: 'user',
                message: 'CMP 공정 후에 웨이퍼 표면에 스크래치가 발생했습니다. 도움이 필요합니다.',
                delay: 1500
            },
            {
                type: 'bot',
                message: '기술적인 문제로 어려움을 겪고 계시는군요. 전문가에게 질문을 등록해드리겠습니다.',
                delay: 2500
            },
            {
                type: 'api',
                method: 'POST',
                endpoint: '/api/v1/ask-question',
                data: {
                    userId: "U789012",
                    question: "CMP 공정 후 웨이퍼 표면에 미세 스크래치가 발생했습니다. 원인과 개선 방법을 알고 싶습니다.",
                    category: "공정불량",
                    urgency: "high"
                },
                delay: 3500
            },
            {
                type: 'bot',
                message: '질문이 등록되었습니다! 📝\n\n질문 ID: Q202403150001\n매칭된 전문가: 3명\n예상 응답 시간: 30분 이내',
                delay: 5000
            },
            {
                type: 'user',
                message: '감사합니다. 제 질문 상태를 확인할 수 있나요?',
                delay: 6500
            },
            {
                type: 'api',
                method: 'GET',
                endpoint: '/api/v1/my-questions/U789012',
                delay: 7500
            },
            {
                type: 'bot',
                message: '현재 질문 상태:\n• 상태: 대기 중\n• 답변 수: 0개\n• 등록 시간: 방금 전',
                delay: 9000
            },
            {
                type: 'notification',
                title: '답변 도착!',
                message: '전문가가 답변을 작성했습니다.',
                delay: 11000
            },
            {
                type: 'bot',
                message: '좋은 소식입니다! 전문가 답변이 도착했습니다. 확인해보시겠어요? 📬',
                delay: 11500
            },
            {
                type: 'user',
                message: '네, 답변을 확인하고 싶습니다!',
                delay: 12500
            },
            {
                type: 'api',
                method: 'GET',
                endpoint: '/api/v1/question-answers/Q202403150001',
                delay: 13500
            },
            {
                type: 'bot',
                message: '전문가 답변:\n\n"CMP 스크래치의 주요 원인은:\n1. 패드 컨디셔닝 불량\n2. 슬러리 응집\n3. 패드 수명 초과\n\n개선 방법으로는 패드 컨디셔닝 주기 조정과 슬러리 필터링 강화를 추천드립니다."\n\n도움이 되셨나요? 😊',
                delay: 15000
            },
            {
                type: 'user',
                message: '네, 정말 도움이 되었습니다. 감사합니다!',
                delay: 17000
            }
        ]
    },
    full: {
        name: "전체 플로우 시나리오",
        steps: [
            {
                type: 'system',
                message: '🎬 전체 플로우 데모를 시작합니다',
                delay: 0
            },
            {
                type: 'bot',
                message: '안녕하세요! 전문가 Q&A 시스템입니다. 어떤 도움이 필요하신가요?',
                delay: 1000
            },
            {
                type: 'user',
                message: '제가 CVD 공정 전문가인데, 전문 분야를 등록하고 싶습니다.',
                delay: 2500
            },
            {
                type: 'api',
                method: 'POST',
                endpoint: '/api/v1/register-specialty',
                data: {
                    userId: "U555555",
                    userName: "이공정",
                    specialties: ["CVD 공정", "박막 증착", "공정 최적화"],
                    department: "공정개발팀",
                    experience: "7년"
                },
                delay: 4000
            },
            {
                type: 'bot',
                message: '전문가 등록이 완료되었습니다! ✅',
                delay: 5500
            },
            {
                type: 'system',
                message: '👥 다른 사용자가 질문을 등록합니다...',
                delay: 7000
            },
            {
                type: 'api',
                method: 'POST',
                endpoint: '/api/v1/ask-question',
                data: {
                    userId: "U999999",
                    question: "CVD 공정 중 파티클 발생이 증가했습니다. 원인 분석이 필요합니다.",
                    category: "공정불량",
                    urgency: "high"
                },
                delay: 8500
            },
            {
                type: 'notification',
                title: '질문 할당 알림',
                message: 'CVD 공정 관련 긴급 질문이 할당되었습니다!',
                delay: 10000
            },
            {
                type: 'bot',
                message: '새로운 질문이 할당되었습니다! CVD 관련 긴급 건입니다.',
                delay: 10500
            },
            {
                type: 'api',
                method: 'GET',
                endpoint: '/api/v1/assigned-questions/U555555',
                delay: 12000
            },
            {
                type: 'bot',
                message: '질문: "CVD 공정 중 파티클 발생이 증가했습니다. 원인 분석이 필요합니다."\n\n이 질문에 답변하시겠습니까?',
                delay: 13500
            },
            {
                type: 'user',
                message: '네, 제가 답변하겠습니다.',
                delay: 15000
            },
            {
                type: 'api',
                method: 'POST',
                endpoint: '/api/v1/submit-answer',
                data: {
                    userId: "U555555",
                    questionId: "Q202403150002",
                    answer: "CVD 파티클 증가의 주요 원인:\n1. 챔버 클리닝 주기 부적절\n2. 전구체 가스 순도 문제\n3. 온도 균일성 저하\n\n권장 조치사항:\n- 클리닝 주기를 20% 단축\n- 가스 필터 교체\n- 히터 점검 및 교정",
                    references: ["CVD-SOP-2024", "파티클관리지침서"]
                },
                delay: 16500
            },
            {
                type: 'notification',
                title: '답변 완료',
                message: '질문자에게 답변이 전달되었습니다.',
                delay: 18000
            },
            {
                type: 'bot',
                message: '답변이 성공적으로 제출되었습니다! 🎉\n\n포인트 +15점 획득\n누적 답변: 1건',
                delay: 18500
            },
            {
                type: 'system',
                message: '✨ 전체 플로우 데모가 완료되었습니다!',
                delay: 20000
            }
        ]
    }
};

let currentScenario = null;
let currentStep = 0;
let isPlaying = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Enable interactive elements after demo loads
});

function playScenario(scenarioName) {
    if (isPlaying) return;
    
    currentScenario = scenarios[scenarioName];
    currentStep = 0;
    isPlaying = true;
    
    // Clear previous content
    document.getElementById('chatContainer').innerHTML = '';
    document.getElementById('apiMonitor').innerHTML = '';
    
    // Add scenario title
    addSystemMessage(`${currentScenario.name} 시작`);
    
    // Play steps
    playNextStep();
}

function playNextStep() {
    if (!currentScenario || currentStep >= currentScenario.steps.length) {
        isPlaying = false;
        addSystemMessage('시나리오 완료! 다른 시나리오를 선택하거나 자유롭게 대화해보세요.');
        enableUserInput();
        return;
    }
    
    const step = currentScenario.steps[currentStep];
    
    setTimeout(() => {
        switch (step.type) {
            case 'bot':
                addBotMessage(step.message);
                break;
            case 'user':
                addUserMessage(step.message);
                break;
            case 'api':
                addApiCall(step.method, step.endpoint, step.data);
                break;
            case 'notification':
                showNotification(step.title, step.message);
                break;
            case 'system':
                addSystemMessage(step.message);
                break;
        }
        
        currentStep++;
        playNextStep();
    }, step.delay);
}

function addBotMessage(message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = createMessageElement('bot', message);
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addUserMessage(message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = createMessageElement('user', message);
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addSystemMessage(message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-appear';
    messageDiv.innerHTML = `<div class="system-message">${message}</div>`;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function createMessageElement(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-appear flex ' + (type === 'user' ? 'justify-end' : 'justify-start') + ' mb-4';
    
    const innerDiv = document.createElement('div');
    innerDiv.className = type === 'user' ? 'user-message' : 'bot-message';
    
    if (type === 'bot') {
        // Add typing indicator first
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        innerDiv.appendChild(typingDiv);
        messageDiv.appendChild(innerDiv);
        
        // Replace with actual message after delay
        setTimeout(() => {
            innerDiv.innerHTML = `<div class="whitespace-pre-wrap">${message}</div>`;
        }, 1000);
    } else {
        innerDiv.innerHTML = `<div class="whitespace-pre-wrap">${message}</div>`;
        messageDiv.appendChild(innerDiv);
    }
    
    return messageDiv;
}

function addApiCall(method, endpoint, data) {
    const apiMonitor = document.getElementById('apiMonitor');
    
    const apiDiv = document.createElement('div');
    apiDiv.className = 'message-appear bg-gray-50 rounded-lg p-4 mb-4';
    
    const methodBadge = method === 'POST' ? 
        '<span class="api-badge post">POST</span>' : 
        '<span class="api-badge get">GET</span>';
    
    let content = `
        <div class="flex items-center mb-2">
            ${methodBadge}
            <span class="font-mono text-sm">${endpoint}</span>
        </div>
    `;
    
    if (data) {
        content += `
            <div class="mt-2">
                <div class="text-xs text-gray-600 mb-1">Request Body:</div>
                <div class="code-block">
                    <pre>${formatJSON(data)}</pre>
                </div>
            </div>
        `;
    }
    
    // Add response after delay
    content += `
        <div class="mt-3" id="response-${Date.now()}">
            <div class="text-xs text-gray-600 mb-1">Response:</div>
            <div class="flex items-center">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    apiDiv.innerHTML = content;
    apiMonitor.appendChild(apiDiv);
    
    // Simulate response
    const responseId = apiDiv.querySelector('[id^="response-"]').id;
    setTimeout(() => {
        const responseDiv = document.getElementById(responseId);
        responseDiv.innerHTML = `
            <div class="text-xs text-gray-600 mb-1">Response:</div>
            <div class="code-block">
                <pre>${formatJSON(getMockResponse(endpoint, method))}</pre>
            </div>
            <div class="mt-2 text-xs text-green-600">
                <i class="fas fa-check-circle mr-1"></i>200 OK
            </div>
        `;
    }, 1500);
    
    scrollApiMonitor();
}

function getMockResponse(endpoint, method) {
    if (endpoint.includes('register-specialty')) {
        return {
            success: true,
            message: "전문 분야가 성공적으로 등록되었습니다",
            registeredAt: new Date().toISOString()
        };
    } else if (endpoint.includes('ask-question')) {
        return {
            success: true,
            questionId: "Q" + Date.now(),
            message: "질문이 등록되었습니다",
            matchedExperts: 3,
            estimatedResponseTime: "30분 이내"
        };
    } else if (endpoint.includes('submit-answer')) {
        return {
            success: true,
            answerId: "A" + Date.now(),
            message: "답변이 성공적으로 제출되었습니다",
            pointsEarned: 10,
            newLevel: 1
        };
    } else if (endpoint.includes('assigned-questions')) {
        return {
            assignedQuestions: [{
                questionId: "Q202403150001",
                question: "기술적 문제에 대한 질문...",
                category: "공정불량",
                urgency: "high",
                matchScore: 0.92
            }]
        };
    }
    
    return { success: true };
}

function formatJSON(obj) {
    return JSON.stringify(obj, null, 2)
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-number">$1</span>');
}

function showNotification(title, message) {
    const notification = document.getElementById('notification');
    document.getElementById('notificationText').textContent = message;
    
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}

function scrollToBottom() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function scrollApiMonitor() {
    const apiMonitor = document.getElementById('apiMonitor');
    apiMonitor.scrollTop = apiMonitor.scrollHeight;
}

function enableUserInput() {
    document.getElementById('userInput').disabled = false;
    document.querySelector('button[onclick="sendMessage()"]').disabled = false;
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        addBotMessage('입력하신 메시지를 받았습니다. 실제 환경에서는 AI가 응답을 생성합니다.');
    }, 1000);
}