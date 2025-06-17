let ws = null;
let currentQuestionId = 'Q202403150001';

// API Test Data Templates
const apiTemplates = {
    registerSpecialty: {
        method: 'POST',
        endpoint: 'REGISTER_SPECIALTY',
        body: {
            userId: 'U123456',
            userName: '김삼성',
            specialties: [
                'CMP 공정',
                '스크래치 불량 분석',
                '표면 결함 검사'
            ],
            department: '반도체연구소',
            experience: '5년'
        }
    },
    getMySpecialty: {
        method: 'GET',
        endpoint: 'GET_MY_SPECIALTY',
        params: ['userId']
    },
    askQuestion: {
        method: 'POST',
        endpoint: 'ASK_QUESTION',
        body: {
            userId: 'U789012',
            question: 'CMP 공정 후 웨이퍼 표면에 미세 스크래치가 발생했습니다. 원인과 개선 방법을 알고 싶습니다.',
            category: '공정불량',
            urgency: 'high'
        }
    },
    getMyQuestions: {
        method: 'GET',
        endpoint: 'GET_MY_QUESTIONS',
        params: ['userId']
    },
    getAssignedQuestions: {
        method: 'GET',
        endpoint: 'GET_ASSIGNED_QUESTIONS',
        params: ['userId']
    },
    submitAnswer: {
        method: 'POST',
        endpoint: 'SUBMIT_ANSWER',
        body: {
            userId: 'U123456',
            questionId: 'Q202403150001',
            answer: 'CMP 스크래치의 주요 원인은 다음과 같습니다:\n1. 패드 컨디셔닝 불량\n2. 슬러리 응집...',
            references: ['SOP-CMP-001', '불량분석가이드-v2.1']
        }
    },
    getQuestionAnswers: {
        method: 'GET',
        endpoint: 'GET_QUESTION_ANSWERS',
        params: ['questionId']
    }
};

// Initialize WebSocket
function initWebSocket() {
    // Mock WebSocket for demo
    updateWsStatus('connected');
    addWsEvent('모의 연결', '데모 모드로 실행 중입니다. 실제 WebSocket 연결 없이 이벤트를 시뮬레이션합니다.');
    
    // Simulate periodic events
    setInterval(() => {
        if (Math.random() > 0.7) {
            const mockEvent = Math.random() > 0.5 ? {
                type: 'question_assigned',
                data: {
                    questionId: 'Q' + Date.now(),
                    preview: '새로운 질문이 도착했습니다...',
                    urgency: 'high'
                }
            } : {
                type: 'answer_received',
                data: {
                    questionId: currentQuestionId,
                    answerId: 'A' + Date.now(),
                    expertLevel: Math.floor(Math.random() * 3) + 1
                }
            };
            
            addWsEvent('모의 이벤트', mockEvent);
            handleWsMessage(mockEvent);
        }
    }, 10000);
}

function updateWsStatus(status) {
    const indicator = document.getElementById('wsIndicator');
    const statusText = document.getElementById('wsStatus');
    
    indicator.className = 'websocket-indicator';
    
    switch(status) {
        case 'connected':
            indicator.classList.add('ws-connected');
            statusText.textContent = 'WebSocket 연결됨';
            break;
        case 'disconnected':
            indicator.classList.add('ws-disconnected');
            statusText.textContent = 'WebSocket 연결 끊김';
            break;
        case 'connecting':
            indicator.classList.add('ws-connecting');
            statusText.textContent = 'WebSocket 연결 중...';
            break;
    }
}

function addWsEvent(type, data) {
    const eventsDiv = document.getElementById('wsEvents');
    const timestamp = new Date().toLocaleTimeString();
    const eventHtml = `
        <div class="mb-2">
            <span class="text-gray-500">[${timestamp}]</span> 
            <span class="text-yellow-400">${type}:</span> 
            <span class="text-green-400">${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}</span>
        </div>
    `;
    eventsDiv.innerHTML = eventHtml + eventsDiv.innerHTML;
}

function handleWsMessage(data) {
    if (data.type === 'question_assigned') {
        addChatMessage(`🔔 새로운 질문이 할당되었습니다!\n질문 ID: ${data.data.questionId}\n미리보기: ${data.data.preview}`, 'system');
    } else if (data.type === 'answer_received') {
        addChatMessage(`📬 새로운 답변이 도착했습니다!\n질문 ID: ${data.data.questionId}\n답변 ID: ${data.data.answerId}`, 'system');
    }
}

function testAPI(apiName) {
    const template = apiTemplates[apiName];
    const userId = document.getElementById('currentUserId').value;
    
    let body = template.body;
    
    // Build endpoint URL with parameters
    const params = {};
    if (template.params) {
        template.params.forEach(param => {
            if (param === 'userId') {
                params[param] = userId;
            } else if (param === 'questionId') {
                params[param] = currentQuestionId;
            }
        });
    }
    
    const endpoint = API_CONFIG.getEndpoint(template.endpoint, params);
    
    // Update userId in body if exists
    if (body && body.userId) {
        body = { ...body, userId };
    }
    
    // Add request to chat
    addChatMessage(`${template.method} ${endpoint}${body ? '\n\n' + JSON.stringify(body, null, 2) : ''}`, 'request');
    
    // Make API call
    makeAPICall(template.method, endpoint, body);
}

async function makeAPICall(method, endpoint, body) {
    const url = API_CONFIG.BASE_URL + endpoint;
    
    try {
        addChatMessage('🔄 요청 전송 중...', 'system');
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        // Mock API responses for testing
        addChatMessage('⚠️ 실제 API 서버가 응답하지 않아 모의 응답을 생성합니다.', 'system');
        
        const mockResponse = getMockResponse(endpoint, method, body);
        
        // Store questionId if returned
        if (mockResponse.questionId) {
            currentQuestionId = mockResponse.questionId;
        }
        
        addChatMessage(formatJSON(mockResponse), 'response', true);
        
        // Simulate WebSocket events
        simulateWsEvents(endpoint, mockResponse);
        
    } catch (error) {
        addChatMessage(`❌ 오류 발생: ${error.message}`, 'error');
    }
}

function getMockResponse(endpoint, method, body) {
    const timestamp = new Date().toISOString();
    
    if (endpoint.includes('register-specialty')) {
        return {
            success: true,
            message: "전문 분야가 성공적으로 등록되었습니다",
            registeredAt: timestamp
        };
    } else if (endpoint.includes('my-specialty')) {
        return {
            userId: body?.userId || "U123456",
            userName: "김삼성",
            specialties: [
                "CMP 공정",
                "스크래치 불량 분석",
                "표면 결함 검사"
            ],
            department: "반도체연구소",
            experience: "5년",
            level: 1,
            totalAnswers: 0
        };
    } else if (endpoint.includes('ask-question')) {
        return {
            success: true,
            questionId: "Q" + Date.now(),
            message: "질문이 등록되었습니다. 전문가 매칭 중입니다.",
            matchedExperts: 3,
            estimatedResponseTime: "30분 이내"
        };
    } else if (endpoint.includes('my-questions')) {
        return {
            questions: [
                {
                    questionId: currentQuestionId || "Q202403150001",
                    question: "CMP 공정 후 웨이퍼 표면에 미세 스크래치가...",
                    status: "waiting",
                    createdAt: timestamp,
                    answerCount: 0
                }
            ]
        };
    } else if (endpoint.includes('assigned-questions')) {
        return {
            assignedQuestions: [
                {
                    questionId: currentQuestionId || "Q202403150001",
                    question: "CMP 공정 후 웨이퍼 표면에 미세 스크래치가 발생했습니다...",
                    category: "공정불량",
                    urgency: "high",
                    assignedAt: timestamp,
                    matchScore: 0.92
                }
            ]
        };
    } else if (endpoint.includes('submit-answer')) {
        return {
            success: true,
            answerId: "A" + Date.now(),
            message: "답변이 성공적으로 제출되었습니다",
            pointsEarned: 10,
            newLevel: 1
        };
    } else if (endpoint.includes('question-answers')) {
        return {
            questionId: currentQuestionId || "Q202403150001",
            question: "CMP 공정 후 웨이퍼 표면에 미세 스크래치가...",
            answers: [
                {
                    answerId: "A202403150001",
                    answer: "CMP 스크래치의 주요 원인은 다음과 같습니다...",
                    expertLevel: 1,
                    answeredAt: timestamp,
                    helpful: null
                }
            ],
            status: "answered"
        };
    }
    
    return { error: "Unknown endpoint" };
}

function simulateWsEvents(endpoint, data) {
    if (endpoint.includes('ask-question') && data.success) {
        setTimeout(() => {
            const wsEvent = {
                type: 'question_assigned',
                data: {
                    questionId: data.questionId,
                    preview: 'CMP 공정 후 웨이퍼 표면에...',
                    urgency: 'high'
                }
            };
            if (ws && ws.readyState === WebSocket.OPEN) {
                handleWsMessage(wsEvent);
            }
        }, 2000);
    } else if (endpoint.includes('submit-answer') && data.success) {
        setTimeout(() => {
            const wsEvent = {
                type: 'answer_received',
                data: {
                    questionId: currentQuestionId,
                    answerId: data.answerId,
                    expertLevel: 1
                }
            };
            if (ws && ws.readyState === WebSocket.OPEN) {
                handleWsMessage(wsEvent);
            }
        }, 1500);
    }
}

function formatJSON(obj) {
    return JSON.stringify(obj, null, 2)
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>');
}

function addChatMessage(message, type, success = true) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    let bgColor, icon;
    switch(type) {
        case 'request':
            bgColor = 'bg-blue-100';
            icon = '📤';
            break;
        case 'response':
            bgColor = success ? 'bg-green-100' : 'bg-red-100';
            icon = success ? '✅' : '❌';
            break;
        case 'system':
            bgColor = 'bg-gray-100';
            icon = 'ℹ️';
            break;
        case 'error':
            bgColor = 'bg-red-100';
            icon = '⚠️';
            break;
        default:
            bgColor = 'bg-gray-100';
            icon = '';
    }
    
    const isJSON = message.includes('{') || message.includes('[');
    
    messageDiv.innerHTML = `
        <div class="${bgColor} rounded-lg p-3 max-w-full">
            <div class="flex items-start">
                <span class="mr-2">${icon}</span>
                <div class="flex-1">
                    ${isJSON ? 
                        `<pre class="json-viewer p-2 rounded overflow-x-auto"><code>${message}</code></pre>` : 
                        `<p class="text-sm text-gray-800 whitespace-pre-wrap">${message}</p>`
                    }
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="chat-message">
            <div class="bg-blue-100 rounded-lg p-3 max-w-3/4">
                <p class="text-sm text-gray-800">👋 채팅이 초기화되었습니다. 테스트할 API를 선택해주세요.</p>
            </div>
        </div>
    `;
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendCustomRequest();
    }
}

function sendCustomRequest() {
    const input = document.getElementById('chatInput');
    const value = input.value.trim();
    
    if (!value) return;
    
    try {
        const parsed = JSON.parse(value);
        addChatMessage('사용자 입력:\n' + JSON.stringify(parsed, null, 2), 'request');
        // You can implement custom request handling here
        input.value = '';
    } catch (e) {
        addChatMessage(`❌ JSON 파싱 오류: ${e.message}`, 'error');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initWebSocket();
});