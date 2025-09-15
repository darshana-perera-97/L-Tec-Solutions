// API Configuration and Utility Functions for L-Tec Solutions
// This file handles all communication with the backend API

// Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api', // Backend server URL
    TIMEOUT: 10000, // 10 seconds timeout
    RETRY_ATTEMPTS: 3
};

// API Utility Class
class LTeclAPI {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        config.signal = controller.signal;

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please check your connection');
            }
            
            throw error;
        }
    }

    // Check if backend is available
    async checkHealth() {
        try {
            const response = await this.request('/health');
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Check WhatsApp client status
    async checkWhatsAppStatus() {
        try {
            const response = await this.request('/whatsapp/status');
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Submit product form
    async submitForm(formData) {
        try {
            const response = await this.request('/submit-form', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Retry mechanism for failed requests
    async requestWithRetry(endpoint, options = {}, retries = API_CONFIG.RETRY_ATTEMPTS) {
        for (let i = 0; i < retries; i++) {
            try {
                return await this.request(endpoint, options);
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }
}

// Create global API instance
const api = new LTeclAPI();

// Utility functions for easy use
const APIUtils = {
    // Check if backend is running
    async isBackendAvailable() {
        const result = await api.checkHealth();
        return result.success;
    },

    // Check if WhatsApp is ready
    async isWhatsAppReady() {
        const result = await api.checkWhatsAppStatus();
        return result.success && result.data.ready;
    },

    // Submit product inquiry
    async submitProductInquiry(inquiryData) {
        return await api.submitForm(inquiryData);
    },

    // Get connection status
    async getConnectionStatus() {
        const [healthResult, whatsappResult] = await Promise.allSettled([
            api.checkHealth(),
            api.checkWhatsAppStatus()
        ]);

        return {
            backend: healthResult.status === 'fulfilled' && healthResult.value.success,
            whatsapp: whatsappResult.status === 'fulfilled' && 
                     whatsappResult.value.success && 
                     whatsappResult.value.data.ready,
            errors: {
                backend: healthResult.status === 'rejected' ? healthResult.reason.message : null,
                whatsapp: whatsappResult.status === 'rejected' ? whatsappResult.reason.message : null
            }
        };
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LTeclAPI, APIUtils, api };
} else {
    // Make available globally
    window.LTeclAPI = LTeclAPI;
    window.APIUtils = APIUtils;
    window.api = api;
}
