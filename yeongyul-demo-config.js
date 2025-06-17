// ============================================
// 연결이 데모 설정 파일
// 이 파일에서 모든 텍스트와 설정을 변경할 수 있습니다
// ============================================

const DEMO_CONFIG = {
    // 서비스 이름
    serviceName: '연결이',
    
    // 초기 환영 메시지
    welcomeMessage: '안녕하세요! 연결이입니다. 기술 관련 질문을 입력해주세요.',
    
    // 사용자 질문
    userQuestion: 'CMP 공정 후 웨이퍼 표면에 미세 스크래치가 발생했습니다. 원인과 개선 방법을 알고 싶습니다.',
    
    // 시스템 메시지
    systemMessages: {
        questionReceived: '질문이 접수되었습니다. 가장 적합한 전문가를 찾고 있습니다...',
        expertsAssigned: '✅ 전문가 3명이 배정되었습니다!',
        notificationSent: '전문가들에게 알림이 전송되었습니다. 곧 답변을 받으실 수 있습니다.',
        expertResponded: (expertName) => `📬 ${expertName}님이 답변을 작성했습니다!`,
        expertJoined: (expertName) => `📬 ${expertName}님이 대화에 참여했습니다!`,
        feedbackSaved: '📈 피드백이 저장되었습니다. 지식 DB가 강화됩니다!',
        newQuestionAlert: '🔔 새로운 질문이 배정되었습니다!'
    },
    
    // 전문가 설정
    experts: {
        expert1: {
            nickname: '반도체마스터',
            avatar: '🤖',
            specialty: 'CMP 공정 전문',
            experience: '경력 10년',
            matchRate: '95%',
            // 전문가 1의 메시지들
            messages: {
                acceptQuestion: 'CMP 스크래치의 주요 원인은 패드 컨디셔닝 불량, 슬러리 응집, 패드 수명 초과 등이 있습니다. 자세한 내용은 채팅방에서 설명드리겠습니다.',
                greeting: '안녕하세요, 반도체마스터입니다.',
                intro: '문의하신 스크래치 문제에 대해 답변드리겠습니다.',
                mainAnswer: '주요 원인은 다음과 같습니다:\n1. 패드 컨디셔닝 불량\n2. 슬러리 응집\n3. 패드 수명 초과',
                detailAnswer: '일반적으로 웨이퍼 25장당 1회 컨디셔닝을 권장하지만, 공정 조건에 따라 조정이 필요합니다.'
            }
        },
        expert2: {
            nickname: '현미경탐정',
            avatar: '🔬',
            specialty: '표면 분석 전문',
            experience: '경력 7년',
            matchRate: '88%',
            // 전문가 2는 답변하지 않음
            messages: {}
        },
        expert3: {
            nickname: '파티클파이터',
            avatar: '🎯',
            specialty: '불량 분석 전문',
            experience: '경력 5년',
            matchRate: '82%',
            // 전문가 3의 메시지들
            messages: {
                acceptQuestion: '저도 이 문제에 대해 경험이 있습니다. 채팅방에 참여하겠습니다.',
                joinChat: '💬 파티클파이터님이 참여했습니다.',
                greeting: '안녕하세요, 파티클파이터입니다. 슬러리 필터링 관련해서 추가 정보를 드릴 수 있습니다.',
                filterAdvice: '슬러리 필터는 0.5μm 사이즈를 사용하시는 것을 권장합니다.',
                filterSchedule: '그리고 필터 교체 주기도 중요한데, 보통 2주마다 교체하는 것이 좋습니다.'
            }
        }
    },
    
    // 사용자 추가 질문들
    userFollowUps: {
        question1: '감사합니다! 패드 컨디셔닝 주기는 어떻게 설정하는 것이 좋을까요?',
        finalThanks: '두 분 모두 감사합니다! 많은 도움이 되었습니다. 🙏'
    },
    
    // 타임라인 설정 (밀리초 단위)
    timeline: {
        startDelay: 1000,        // 시작 지연
        typingDelay: 2000,       // 타이핑 시작까지
        sendDelay: 1500,         // 질문 전송까지
        matchingDelay: 1500,     // 매칭 메시지까지
        expertsDelay: 1500,      // 전문가 표시까지
        notifyDelay: 1500,       // 알림 전송까지
        showExpertsDelay: 1500,  // 전문가 화면 표시까지
        expert1TypingDelay: 2000,// 전문가1 타이핑까지
        expert1ResponseDelay: 2000,// 전문가1 응답까지
        openChatDelay: 1000,     // 채팅방 열기까지
        detailQuestionDelay: 2000,// 추가 질문까지
        feedback1Delay: 1000,    // 첫 피드백까지
        expert3TypingDelay: 2000,// 전문가3 타이핑까지
        expert3JoinDelay: 2000,  // 전문가3 참여까지
        discussionDelay: 2000,   // 대화 계속까지
        feedback2Delay: 2000,    // 두번째 피드백까지
        notificationDelay: 3000, // 피드백 알림까지
        restartDelay: 2000       // 재시작까지
    },
    
    // 애니메이션 설정
    animations: {
        typingSpeed: 50,         // 타이핑 속도 (ms per character)
        messageDelay: 500,       // 메시지 간 지연
        feedbackDelay: 300,      // 피드백 버튼 클릭 지연
        expertScreenDelay: 300   // 전문가 화면 표시 간격
    },
    
    // 피드백 설정
    feedback: {
        // 좋아요를 받을 메시지 (텍스트 일부분으로 매칭)
        likeMessages: [
            '주요 원인은',          // 전문가1의 첫 답변
            '웨이퍼 25장당'         // 전문가1의 상세 답변
        ],
        // 싫어요를 받을 메시지
        dislikeMessages: [
            '0.5μm 사이즈'          // 전문가3의 필터 추천
        ]
    },
    
    // UI 텍스트
    ui: {
        questionPlaceholder: '질문을 입력하세요...',
        questionCategory: '공정불량',
        urgency: '높음',
        newQuestionPreview: 'CMP 공정 후 웨이퍼 표면에 미세 스크래치가...',
        answerButton: '답변하기',
        memberCount: (count) => `참여자 ${count}명`,
        chatRoomTitle: 'CMP 공정 문의'
    }
};