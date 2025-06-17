// API Configuration
const API_CONFIG = {
    // Base URL configuration
    BASE_URL: process.env.API_BASE_URL || 'https://yeongyul--yeongyeoli-dev.cdep1.samsungds.net',
    
    // API version
    API_VERSION: 'v1',
    
    // API endpoints
    ENDPOINTS: {
        // User & Specialty Management
        REGISTER_SPECIALTY: '/register-specialty',
        GET_MY_SPECIALTY: '/my-specialty/{userId}',
        
        // Question Management
        ASK_QUESTION: '/ask-question',
        GET_MY_QUESTIONS: '/my-questions/{userId}',
        GET_ASSIGNED_QUESTIONS: '/assigned-questions/{userId}',
        GET_QUESTION_ANSWERS: '/question-answers/{questionId}',
        
        // Answer Management
        SUBMIT_ANSWER: '/submit-answer',
    },
    
    // Helper function to build full API URL
    buildUrl: function(endpoint, params = {}) {
        let url = `${this.BASE_URL}/api/${this.API_VERSION}${this.ENDPOINTS[endpoint] || endpoint}`;
        
        // Replace path parameters
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, params[key]);
        });
        
        return url;
    },
    
    // Helper function to get endpoint path
    getEndpoint: function(endpoint, params = {}) {
        let path = `/api/${this.API_VERSION}${this.ENDPOINTS[endpoint] || endpoint}`;
        
        // Replace path parameters
        Object.keys(params).forEach(key => {
            path = path.replace(`{${key}}`, params[key]);
        });
        
        return path;
    }
};

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}