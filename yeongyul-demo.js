// Demo state
let demoStep = 0;
let demoRunning = false;

// Build demo timeline from config
function buildTimeline() {
    const t = DEMO_CONFIG.timeline;
    let currentTime = 0;
    
    const timeline = [];
    
    // Helper to add step
    const addStep = (delay, action) => {
        currentTime += delay;
        timeline.push({ delay: currentTime, action });
    };
    
    addStep(t.startDelay, 'userTyping');
    addStep(t.typingDelay, 'sendQuestion');
    addStep(t.sendDelay, 'showMatching');
    addStep(t.matchingDelay, 'showExperts');
    addStep(t.expertsDelay, 'notifyExperts');
    addStep(t.notifyDelay, 'showExpertScreens');
    addStep(t.showExpertsDelay, 'expert1Typing');
    addStep(t.expert1TypingDelay, 'expert1Response');
    addStep(t.expert1ResponseDelay, 'openChatRoom');
    addStep(t.openChatDelay, 'detailedQuestion');
    addStep(t.detailQuestionDelay, 'giveFeedback1');
    addStep(t.feedback1Delay, 'expert3Typing');
    addStep(t.expert3TypingDelay, 'expert3Joins');
    addStep(t.expert3JoinDelay, 'continuedDiscussion');
    addStep(t.discussionDelay, 'giveFeedback2');
    addStep(t.feedback2Delay, 'showFeedbackNotification');
    addStep(t.notificationDelay, 'resetAndRestart');
    
    return timeline;
}

const demoTimeline = buildTimeline();

function startDemo() {
    if (demoRunning) return;
    resetDemo();
    demoRunning = true;
    demoStep = 0;
    runDemoStep();
}

function runDemoStep() {
    if (demoStep >= demoTimeline.length) {
        demoRunning = false;
        return;
    }
    
    const step = demoTimeline[demoStep];
    const delay = demoStep === 0 ? step.delay : step.delay - demoTimeline[demoStep - 1].delay;
    
    setTimeout(() => {
        step.action && window[step.action]();
        demoStep++;
        runDemoStep();
    }, delay);
}

function resetDemo() {
    demoRunning = false;
    demoStep = 0;
    
    // Clear all chats
    document.getElementById('questioner-chat').innerHTML = '';
    document.getElementById('expert1-chat').innerHTML = '';
    document.getElementById('expert2-chat').innerHTML = '';
    document.getElementById('expert3-chat').innerHTML = '';
    document.getElementById('open-chat-messages').innerHTML = '';
    
    // Hide elements
    document.querySelectorAll('.phone-expert').forEach(phone => {
        phone.classList.remove('show');
    });
    document.getElementById('open-chat-room').classList.remove('active');
    document.querySelectorAll('.notification-badge').forEach(badge => {
        badge.style.display = 'none';
    });
    
    // Reset input
    document.getElementById('questioner-input').value = '';
}

// Demo actions
function userTyping() {
    const input = document.getElementById('questioner-input');
    const text = "CMP 공정 후 웨이퍼 표면에 미세 스크래치가 발생했습니다. 원인과 개선 방법을 알고 싶습니다.";
    typeText(input, text);
}

function typeText(element, text, index = 0) {
    if (index < text.length) {
        element.value += text[index];
        setTimeout(() => typeText(element, text, index + 1), 50);
    }
}

function sendQuestion() {
    const question = document.getElementById('questioner-input').value;
    addMessage('questioner-chat', question, 'user');
    document.getElementById('questioner-input').value = '';
    
    // Show typing indicator
    setTimeout(() => {
        showTypingIndicator('questioner-chat');
    }, 500);
}

function showMatching() {
    hideTypingIndicator('questioner-chat');
    addMessage('questioner-chat', '질문이 접수되었습니다. 가장 적합한 전문가를 찾고 있습니다...', 'system');
    
    // Show match animation
    const matchAnim = document.getElementById('match-animation');
    matchAnim.style.display = 'block';
    setTimeout(() => {
        matchAnim.style.display = 'none';
    }, 1000);
}

function showExperts() {
    const expertsHtml = `
        <div class="message message-system">
            <div class="message-bubble">
                <div class="font-semibold mb-2">✅ 전문가 3명이 배정되었습니다!</div>
                <div class="expert-card">
                    <div class="expert-avatar">🤖</div>
                    <div class="expert-info">
                        <h4>반도체마스터</h4>
                        <p>CMP 공정 전문 · 경력 10년</p>
                        <p class="text-xs text-green-600 mt-1">매칭률 95%</p>
                    </div>
                </div>
                <div class="expert-card">
                    <div class="expert-avatar">🔬</div>
                    <div class="expert-info">
                        <h4>현미경탐정</h4>
                        <p>표면 분석 전문 · 경력 7년</p>
                        <p class="text-xs text-green-600 mt-1">매칭률 88%</p>
                    </div>
                </div>
                <div class="expert-card">
                    <div class="expert-avatar">🎆</div>
                    <div class="expert-info">
                        <h4>파티클파이터</h4>
                        <p>불량 분석 전문 · 경력 5년</p>
                        <p class="text-xs text-green-600 mt-1">매칭률 82%</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('questioner-chat').insertAdjacentHTML('beforeend', expertsHtml);
    scrollToBottom('questioner-chat');
}

function notifyExperts() {
    addMessage('questioner-chat', DEMO_CONFIG.systemMessages.notificationSent, 'system');
}

function showExpertScreens() {
    // Show expert phones with animation
    const experts = ['phone-expert-1', 'phone-expert-2', 'phone-expert-3'];
    experts.forEach((expertId, index) => {
        setTimeout(() => {
            document.getElementById(expertId).classList.add('show');
            
            // Show notification badge
            const badge = document.querySelector(`#${expertId} .notification-badge`);
            if (badge) badge.style.display = 'flex';
            
            // Add question notification to expert chat
            const expertNum = index + 1;
            addMessage(`expert${expertNum}-chat`, '🔔 새로운 질문이 배정되었습니다!', 'system');
            
            setTimeout(() => {
                const questionPreview = `
                    <div class="message message-system">
                        <div class="message-bubble">
                            <div class="font-semibold text-blue-600 mb-1" style="font-size: 12px;">새 질문</div>
                            <div style="font-size: 11px;">"CMP 공정 후 웨이퍼 표면에 미세 스크래치가..."</div>
                            <div class="text-xs text-gray-500 mt-2" style="font-size: 10px;">카테고리: 공정불량 | 긴급도: 높음</div>
                            <button class="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg" style="font-size: 11px;">
                                답변하기
                            </button>
                        </div>
                    </div>
                `;
                document.getElementById(`expert${expertNum}-chat`).insertAdjacentHTML('beforeend', questionPreview);
                scrollToBottom(`expert${expertNum}-chat`);
            }, 500);
        }, index * 300);
    });
}

function expert1Typing() {
    showTypingIndicator('expert1-chat');
}

function expert1Response() {
    hideTypingIndicator('expert1-chat');
    addMessage('expert1-chat', 'CMP 스크래치의 주요 원인은 패드 컨디셔닝 불량, 슬러리 응집, 패드 수명 초과 등이 있습니다. 자세한 내용은 채팅방에서 설명드리겠습니다.', 'user');
    
    // Update questioner chat
    addMessage('questioner-chat', '📬 반도체마스터님이 답변을 작성했습니다!', 'system');
}

function openChatRoom() {
    const chatRoom = document.getElementById('open-chat-room');
    chatRoom.classList.add('active');
    
    // Add initial messages
    const messages = [
        { text: '안녕하세요, 반도체마스터입니다.', sender: 'expert1' },
        { text: '문의하신 스크래치 문제에 대해 답변드리겠습니다.', sender: 'expert1' },
        { text: '주요 원인은 다음과 같습니다:\n1. 패드 컨디셔닝 불량\n2. 슬러리 응집\n3. 패드 수명 초과', sender: 'expert1' }
    ];
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            addOpenChatMessage(msg.text, msg.sender);
        }, index * 500);
    });
}

function detailedQuestion() {
    addOpenChatMessage('감사합니다! 패드 컨디셔닝 주기는 어떻게 설정하는 것이 좋을까요?', 'user');
    
    setTimeout(() => {
        showTypingIndicator('open-chat-messages', 'expert1');
    }, 1000);
    
    setTimeout(() => {
        hideTypingIndicator('open-chat-messages');
        const msgId = addOpenChatMessage('일반적으로 웨이퍼 25장당 1회 컨디셔닝을 권장하지만, 공정 조건에 따라 조정이 필요합니다.', 'expert1');
        // Add immediate feedback button
        setTimeout(() => {
            const messages = document.querySelectorAll('#open-chat-messages .message');
            const targetMsg = messages[messages.length - 1];
            if (targetMsg && !targetMsg.querySelector('.feedback-buttons')) {
                addFeedbackButtons(targetMsg, 'expert1');
            }
        }, 100);
    }, 3000);
}

function expert3Typing() {
    showTypingIndicator('expert3-chat');
}

function expert3Joins() {
    hideTypingIndicator('expert3-chat');
    addMessage('expert3-chat', '저도 이 문제에 대해 경험이 있습니다. 채팅방에 참여하겠습니다.', 'user');
    
    // Update questioner chat
    addMessage('questioner-chat', '📬 성비박멸자님이 대화에 참여했습니다!', 'system');
    
    // Show expert 3 in chat room
    document.getElementById('expert3-avatar').style.display = 'flex';
    document.getElementById('member-count').textContent = '3';
    
    // Add join message
    addOpenChatMessage('💬 성비박멸자님이 참여했습니다.', 'system');
    
    setTimeout(() => {
        addOpenChatMessage('안녕하세요, 성비박멸자입니다. 슬러리 필터링 관련해서 추가 정보를 드릸 수 있습니다.', 'expert3');
    }, 1000);
}

function continuedDiscussion() {
    const finalMessages = [
        { text: '슬러리 필터는 0.5μm 사이즈를 사용하시는 것을 권장합니다.', sender: 'expert3' },
        { text: '그리고 필터 교체 주기도 중요한데, 보통 2주마다 교체하는 것이 좋습니다.', sender: 'expert3' },
        { text: '두 분 모두 감사합니다! 많은 도움이 되었습니다. 🙏', sender: 'user' }
    ];
    
    finalMessages.forEach((msg, index) => {
        setTimeout(() => {
            addOpenChatMessage(msg.text, msg.sender);
        }, index * 1500);
    });
}

// Helper functions
function addMessage(chatId, text, type) {
    const chat = document.getElementById(chatId);
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    chat.appendChild(messageDiv);
    scrollToBottom(chatId);
    return messageDiv;
}

function addOpenChatMessage(text, sender) {
    const chat = document.getElementById('open-chat-messages');
    const messageDiv = document.createElement('div');
    
    let senderName = '';
    let messageClass = 'message-system';
    let shouldAddFeedback = false;
    
    if (sender === 'user') {
        senderName = '질문자';
        messageClass = 'message-user';
    } else if (sender === 'expert1') {
        senderName = DEMO_CONFIG.experts.expert1.nickname;
        shouldAddFeedback = true;
    } else if (sender === 'expert3') {
        senderName = DEMO_CONFIG.experts.expert3.nickname;
        shouldAddFeedback = true;
    }
    
    messageDiv.className = `message ${messageClass}`;
    
    if (sender !== 'user' && sender !== 'system') {
        messageDiv.innerHTML = `
            <div>
                <div class="text-xs text-gray-500 mb-1">${senderName}</div>
                <div class="message-bubble">${text}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    }
    
    chat.appendChild(messageDiv);
    scrollToBottom('open-chat-messages');
    
    // Auto-add feedback buttons to expert messages
    if (shouldAddFeedback) {
        setTimeout(() => {
            addFeedbackButtons(messageDiv, sender);
        }, 100);
    }
    
    return messageDiv;
}

function showTypingIndicator(chatId, sender) {
    const chat = document.getElementById(chatId);
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-system typing-message';
    
    if (sender && chatId === 'open-chat-messages') {
        const senderName = sender === 'expert1' ? DEMO_CONFIG.experts.expert1.nickname : DEMO_CONFIG.experts.expert3.nickname;
        typingDiv.innerHTML = `
            <div>
                <div class="text-xs text-gray-500 mb-1">${senderName}</div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
    } else {
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
    }
    
    chat.appendChild(typingDiv);
    scrollToBottom(chatId);
}

function hideTypingIndicator(chatId) {
    const chat = document.getElementById(chatId);
    const typingMessage = chat.querySelector('.typing-message');
    if (typingMessage) {
        typingMessage.remove();
    }
}

function scrollToBottom(chatId) {
    const chat = document.getElementById(chatId);
    chat.scrollTop = chat.scrollHeight;
}

function closeOpenChat() {
    document.getElementById('open-chat-room').classList.remove('active');
}

// Reset and restart function
function resetAndRestart() {
    setTimeout(() => {
        resetDemo();
        startDemo();
    }, 2000);
}

// Feedback functions
function giveFeedback1() {
    // Give thumbs up to multiple expert answers
    const messages = document.querySelectorAll('#open-chat-messages .message');
    
    // Like first expert1 answer (주요 원인은...)
    if (messages.length > 2) {
        const targetMessage = messages[2];
        if (!targetMessage.querySelector('.feedback-buttons')) {
            addFeedbackButtons(targetMessage, 'expert1');
        }
        
        setTimeout(() => {
            const likeBtn = targetMessage.querySelector('.feedback-btn:first-child');
            likeBtn.classList.add('active-like');
            
            // Show feedback effect
            const effect = document.createElement('div');
            effect.textContent = '👍';
            effect.style.cssText = 'position: absolute; font-size: 24px; animation: floatUp 1s ease-out forwards;';
            likeBtn.appendChild(effect);
        }, 300);
    }
    
    // Also like the conditioning answer  
    setTimeout(() => {
        const allMessages = document.querySelectorAll('#open-chat-messages .message');
        for (let i = 0; i < allMessages.length; i++) {
            if (allMessages[i].textContent.includes(DEMO_CONFIG.feedback.likeMessages[1])) {
                const msg = allMessages[i];
                if (!msg.querySelector('.active-like')) {
                    const likeBtn = msg.querySelector('.feedback-btn:first-child');
                    if (likeBtn) {
                        likeBtn.classList.add('active-like');
                        const effect = document.createElement('div');
                        effect.textContent = '👍';
                        effect.style.cssText = 'position: absolute; font-size: 24px; animation: floatUp 1s ease-out forwards;';
                        likeBtn.appendChild(effect);
                    }
                }
                break;
            }
        }
    }, 800);
}

function giveFeedback2() {
    // Give thumbs down to expert 3's answer  
    const messages = document.querySelectorAll('#open-chat-messages .message');
    const expert3Messages = Array.from(messages).filter(m => m.textContent.includes('성비박멸자'));
    
    if (expert3Messages.length > 1) {
        // Thumbs down on the filter recommendation
        const targetMessage = expert3Messages[1]; // Second message from expert3
        if (targetMessage && targetMessage.querySelector('.feedback-btn:last-child')) {
            const dislikeBtn = targetMessage.querySelector('.feedback-btn:last-child');
            dislikeBtn.classList.add('active-dislike');
            
            // Show feedback effect
            const effect = document.createElement('div');
            effect.textContent = '👎';
            effect.style.cssText = 'position: absolute; font-size: 24px; animation: floatUp 1s ease-out forwards;';
            dislikeBtn.appendChild(effect);
        }
    }
}

function showFeedbackNotification() {
    addMessage('questioner-chat', '📈 피드백이 저장되었습니다. 지식 DB가 강화됩니다!', 'system');
}

function addFeedbackButtons(messageElement, expertId) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-buttons';
    feedbackDiv.innerHTML = `
        <button class="feedback-btn" onclick="handleFeedback('${expertId}', 'like')">
            👍
        </button>
        <button class="feedback-btn" onclick="handleFeedback('${expertId}', 'dislike')">
            👎
        </button>
    `;
    messageElement.querySelector('.message-bubble').appendChild(feedbackDiv);
}

function handleFeedback(expertId, type) {
    // Feedback handling logic
    console.log(`Feedback: ${type} for ${expertId}`);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-30px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    
    // Add initial welcome message
    setTimeout(() => {
        console.log('Adding welcome message');
        addMessage('questioner-chat', DEMO_CONFIG.welcomeMessage, 'system');
        // Auto-start demo after 1 second
        setTimeout(() => {
            console.log('Starting demo');
            startDemo();
        }, 1000);
    }, 500);
});

// Also try direct initialization as backup
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        const chatContainer = document.getElementById('questioner-chat');
        if (chatContainer && chatContainer.children.length === 0) {
            addMessage('questioner-chat', DEMO_CONFIG.welcomeMessage, 'system');
            setTimeout(startDemo, 1000);
        }
    }, 1000);
}