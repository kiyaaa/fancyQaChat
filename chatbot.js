// Global variables
let messages = [];
let currentUser = {
    id: 'U123456',
    name: '김삼성',
    level: 3,
    specialties: ['CMP 공정', '스크래치 불량 분석', '표면 결함 검사']
};
let selectedFile = null;
let isRecording = false;
let recordingStartTime = null;
let contextMenuTarget = null;

// Emoji list
const emojis = ['😀', '😊', '😎', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💡', '⚡', '✅', '❌', '🚀', '💯', '🙏'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    populateEmojiPicker();
    updateCharCount();
});

function initializeApp() {
    // Load saved messages if any
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        renderMessages();
    }
    
    // Initialize user status
    updateUserStatus();
    
    // Start WebSocket connection simulation
    simulateWebSocketConnection();
}

function setupEventListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#emojiPicker') && !e.target.closest('[onclick="toggleEmojiPicker()"]')) {
            document.getElementById('emojiPicker').style.display = 'none';
        }
        if (!e.target.closest('#contextMenu')) {
            document.getElementById('contextMenu').style.display = 'none';
        }
    });
    
    // Context menu on messages
    document.getElementById('chatContainer').addEventListener('contextmenu', (e) => {
        if (e.target.closest('.message')) {
            e.preventDefault();
            showContextMenu(e, e.target.closest('.message'));
        }
    });
}

// Message handling
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message && !selectedFile) return;
    
    const userMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        file: selectedFile,
        timestamp: new Date(),
        status: 'sent'
    };
    
    addMessage(userMessage);
    input.value = '';
    updateCharCount();
    autoResize(input);
    
    if (selectedFile) {
        removeFile();
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message
    setTimeout(() => {
        processUserMessage(message);
    }, 1000);
}

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    let actions = [];
    
    // Smart response logic
    if (lowerMessage.includes('cmp') || lowerMessage.includes('공정')) {
        response = 'CMP 공정 관련 질문이시군요. 어떤 부분이 궁금하신가요?\n\n1. 공정 파라미터 최적화\n2. 불량 원인 분석\n3. 장비 트러블슈팅\n4. 소재 선택 가이드';
        actions = [
            { text: '파라미터 최적화', action: 'cmp_optimize' },
            { text: '불량 분석', action: 'cmp_defect' },
            { text: '장비 문제', action: 'cmp_equipment' }
        ];
    } else if (lowerMessage.includes('전문가') || lowerMessage.includes('등록')) {
        response = '전문가 등록을 도와드리겠습니다. 현재 등록된 전문 분야:\n\n• CMP 공정\n• 스크래치 불량 분석\n• 표면 결함 검사\n\n추가로 등록하실 분야가 있으신가요?';
        makeAPICall('GET', '/api/v1/my-specialty/U123456');
    } else if (lowerMessage.includes('질문') || lowerMessage.includes('문의')) {
        response = '질문을 등록하시겠습니까? 긴급도를 선택해주세요.';
        actions = [
            { text: '🔴 긴급', action: 'ask_urgent' },
            { text: '🟡 보통', action: 'ask_normal' },
            { text: '🟢 여유', action: 'ask_low' }
        ];
    } else {
        response = '무엇을 도와드릴까요? 다음 중 선택하시거나 자유롭게 질문해주세요:\n\n• 기술 질문하기\n• 전문가 찾기\n• 내 활동 보기\n• 시스템 안내';
    }
    
    hideTypingIndicator();
    
    const botMessage = {
        id: Date.now(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        actions: actions
    };
    
    addMessage(botMessage);
}

function addMessage(message) {
    messages.push(message);
    renderMessage(message);
    saveMessages();
    scrollToBottom();
}

function renderMessage(message) {
    const container = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`;
    messageDiv.dataset.messageId = message.id;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'max-w-3/4';
    
    // Message bubble
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = message.type === 'user' 
        ? 'bg-blue-500 text-white rounded-2xl px-4 py-3' 
        : 'bg-gray-100 rounded-2xl px-4 py-3';
    
    // Message content
    if (message.content) {
        const textP = document.createElement('p');
        textP.className = 'text-sm whitespace-pre-wrap';
        textP.textContent = message.content;
        bubbleDiv.appendChild(textP);
    }
    
    // File attachment
    if (message.file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center space-x-2';
        fileDiv.innerHTML = `
            <i class="fas fa-file"></i>
            <span class="text-xs">${message.file.name}</span>
        `;
        bubbleDiv.appendChild(fileDiv);
    }
    
    // Action buttons
    if (message.actions && message.actions.length > 0) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'mt-3 flex flex-wrap gap-2';
        message.actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'bg-white text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition';
            btn.textContent = action.text;
            btn.onclick = () => handleAction(action.action);
            actionsDiv.appendChild(btn);
        });
        bubbleDiv.appendChild(actionsDiv);
    }
    
    contentDiv.appendChild(bubbleDiv);
    
    // Timestamp
    const timeP = document.createElement('p');
    timeP.className = 'text-xs text-gray-500 mt-1 px-2';
    timeP.textContent = formatTime(message.timestamp);
    contentDiv.appendChild(timeP);
    
    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);
}

function renderMessages() {
    const container = document.getElementById('chatContainer');
    container.innerHTML = '';
    messages.forEach(message => renderMessage(message));
}

function showTypingIndicator() {
    const container = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message flex justify-start';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    container.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Quick actions
function sendQuickMessage(text) {
    document.getElementById('messageInput').value = text;
    sendMessage();
}

function handleAction(action) {
    switch(action) {
        case 'cmp_optimize':
            sendQuickMessage('CMP 공정 파라미터 최적화에 대해 알려주세요');
            break;
        case 'cmp_defect':
            sendQuickMessage('CMP 공정 중 발생하는 불량 유형과 원인을 설명해주세요');
            break;
        case 'cmp_equipment':
            sendQuickMessage('CMP 장비 트러블슈팅 가이드가 필요합니다');
            break;
        case 'ask_urgent':
            makeAPICall('POST', '/api/v1/ask-question', {
                userId: currentUser.id,
                question: messages[messages.length - 2].content,
                category: '공정불량',
                urgency: 'high'
            });
            break;
        case 'ask_normal':
            makeAPICall('POST', '/api/v1/ask-question', {
                userId: currentUser.id,
                question: messages[messages.length - 2].content,
                category: '일반문의',
                urgency: 'medium'
            });
            break;
        case 'ask_low':
            makeAPICall('POST', '/api/v1/ask-question', {
                userId: currentUser.id,
                question: messages[messages.length - 2].content,
                category: '일반문의',
                urgency: 'low'
            });
            break;
    }
}

// File handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        document.getElementById('filePreview').classList.remove('hidden');
        document.getElementById('fileName').textContent = file.name;
    }
}

function removeFile() {
    selectedFile = null;
    document.getElementById('filePreview').classList.add('hidden');
    document.getElementById('fileInput').value = '';
}

// Voice input
function toggleVoiceInput() {
    if (!isRecording) {
        startVoiceRecording();
    } else {
        stopVoiceRecording();
    }
}

function startVoiceRecording() {
    isRecording = true;
    recordingStartTime = Date.now();
    document.getElementById('voiceButton').classList.add('text-red-500');
    document.getElementById('voiceModal').classList.remove('hidden');
    
    // Update recording time
    const updateTimer = setInterval(() => {
        if (!isRecording) {
            clearInterval(updateTimer);
            return;
        }
        const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('recordingTime').textContent = `${minutes}:${seconds}`;
    }, 100);
}

function stopVoiceRecording() {
    isRecording = false;
    document.getElementById('voiceButton').classList.remove('text-red-500');
    document.getElementById('voiceModal').classList.add('hidden');
    
    // Simulate voice to text
    setTimeout(() => {
        document.getElementById('messageInput').value = 'CMP 공정 후 웨이퍼 표면에 스크래치가 발생했습니다. 원인 분석을 요청합니다.';
        updateCharCount();
    }, 500);
}

// Emoji picker
function populateEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.onclick = () => insertEmoji(emoji);
        picker.appendChild(btn);
    });
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    picker.style.display = picker.style.display === 'grid' ? 'none' : 'grid';
}

function insertEmoji(emoji) {
    const input = document.getElementById('messageInput');
    input.value += emoji;
    updateCharCount();
    document.getElementById('emojiPicker').style.display = 'none';
}

// Input handling
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function updateCharCount() {
    const input = document.getElementById('messageInput');
    const count = input.value.length;
    document.getElementById('charCount').textContent = `${count}/1000`;
    document.getElementById('charCount').classList.toggle('text-red-500', count > 900);
}

// Context menu
function showContextMenu(event, messageElement) {
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'block';
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';
    contextMenuTarget = messageElement;
}

function copyMessage() {
    if (contextMenuTarget) {
        const text = contextMenuTarget.querySelector('.text-sm').textContent;
        navigator.clipboard.writeText(text);
        showNotification('메시지가 복사되었습니다');
    }
    document.getElementById('contextMenu').style.display = 'none';
}

function deleteMessage() {
    if (contextMenuTarget) {
        const messageId = contextMenuTarget.dataset.messageId;
        messages = messages.filter(m => m.id != messageId);
        contextMenuTarget.remove();
        saveMessages();
        showNotification('메시지가 삭제되었습니다');
    }
    document.getElementById('contextMenu').style.display = 'none';
}

function pinMessage() {
    // Implementation for pinning messages
    showNotification('메시지가 고정되었습니다');
    document.getElementById('contextMenu').style.display = 'none';
}

// Utility functions
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
        return '방금 전';
    } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}분 전`;
    } else if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
}

function saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function clearChat() {
    if (confirm('모든 대화를 삭제하시겠습니까?')) {
        messages = [];
        renderMessages();
        saveMessages();
        showNotification('대화가 초기화되었습니다');
    }
}

function exportChat() {
    const chatText = messages.map(m => 
        `[${m.type === 'user' ? '나' : '봇'}] ${m.content} (${formatTime(m.timestamp)})`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    
    showNotification('대화가 내보내기되었습니다');
}

function scrollToBottom() {
    const container = document.getElementById('chatContainer');
    container.scrollTop = container.scrollHeight;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// API calls
function makeAPICall(method, endpoint, data) {
    const fullUrl = API_CONFIG.BASE_URL + endpoint;
    showNotification(`API 호출: ${method} ${endpoint}`);
    
    // Simulate API response
    setTimeout(() => {
        const response = {
            success: true,
            message: 'API 호출이 성공했습니다'
        };
        
        const botMessage = {
            id: Date.now(),
            type: 'bot',
            content: `✅ ${response.message}\n\nAPI: ${method} ${endpoint}`,
            timestamp: new Date()
        };
        
        addMessage(botMessage);
    }, 1500);
}

// Additional features
function updateUserStatus() {
    // Update notification count
    const unreadCount = Math.floor(Math.random() * 5);
    document.getElementById('notificationCount').textContent = unreadCount || '';
    document.getElementById('notificationCount').style.display = unreadCount ? 'flex' : 'none';
}

function simulateWebSocketConnection() {
    // Simulate incoming messages
    setInterval(() => {
        if (Math.random() > 0.95) {
            showNotification('새로운 질문이 할당되었습니다!');
            updateUserStatus();
        }
    }, 30000);
}

// Menu functions
function toggleUserMenu() {
    showNotification('사용자 메뉴');
}

function toggleNotifications() {
    showNotification('알림 센터');
}

function openSettings() {
    showNotification('설정 페이지');
}

function startNewQuestion() {
    sendQuickMessage('새로운 기술 질문이 있습니다.');
}

function showMyQuestions() {
    makeAPICall('GET', '/api/v1/my-questions/U123456');
}

function showAssignedQuestions() {
    makeAPICall('GET', '/api/v1/assigned-questions/U123456');
}