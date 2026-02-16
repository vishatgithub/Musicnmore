// Security Configuration and Utilities for M&M Studio Website
// This file contains security measures to protect against common web attacks

const SECURITY = {
    // Configuration
    config: {
        maxInputLength: 1000,
        maxSubmissions: 5,
        submissionWindow: 300000, // 5 minutes
        allowedDomains: ['formspree.io', 'maps.googleapis.com', 'fonts.googleapis.com', 'cdnjs.cloudflare.com'],
        rateLimitStorage: 'mm_rate_limit',
        sessionTimeout: 1800000, // 30 minutes
        maxFileSize: 5242880, // 5MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },

    // Input Sanitization
    sanitize: {
        // Remove HTML tags and encode special characters
        html: function(input) {
            if (typeof input !== 'string') return '';
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML.substring(0, SECURITY.config.maxInputLength);
        },

        // Sanitize for SQL injection (though we're using Formspree)
        sql: function(input) {
            if (typeof input !== 'string') return '';
            return input.replace(/['";\\]/g, '').substring(0, SECURITY.config.maxInputLength);
        },

        // Remove potentially dangerous characters
        strict: function(input) {
            if (typeof input !== 'string') return '';
            return input.replace(/[<>'"&]/g, '').substring(0, SECURITY.config.maxInputLength);
        },

        // Phone number sanitization
        phone: function(input) {
            if (typeof input !== 'string') return '';
            return input.replace(/[^+0-9\s\-()]/g, '').substring(0, 20);
        },

        // Email sanitization
        email: function(input) {
            if (typeof input !== 'string') return '';
            return input.toLowerCase().trim().substring(0, 100);
        }
    },

    // Validation Functions
    validate: {
        // Check for XSS patterns
        xss: function(input) {
            const xssPatterns = [
                /<script/i,
                /javascript:/i,
                /on\w+=/i,
                /<iframe/i,
                /<object/i,
                /<embed/i,
                /eval\(/i,
                /expression\(/i
            ];
            return !xssPatterns.some(pattern => pattern.test(input));
        },

        // Validate email format
        email: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email) && email.length <= 100;
        },

        // Validate phone number
        phone: function(phone) {
            const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
            return phoneRegex.test(phone);
        },

        // Validate name (letters and spaces only)
        name: function(name) {
            const nameRegex = /^[A-Za-z\s]{1,100}$/;
            return nameRegex.test(name);
        },

        // Validate URL
        url: function(url) {
            try {
                const urlObj = new URL(url);
                return SECURITY.config.allowedDomains.some(domain => 
                    urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
                );
            } catch {
                return false;
            }
        },

        // Validate form data
        formData: function(formData) {
            for (let [key, value] of formData.entries()) {
                if (typeof value === 'string') {
                    if (value.length > SECURITY.config.maxInputLength) {
                        throw new Error(`Input for ${key} is too long`);
                    }
                    if (!SECURITY.validate.xss(value)) {
                        throw new Error('Potentially malicious input detected');
                    }
                }
            }
            return true;
        }
    },

    // Rate Limiting
    rateLimit: {
        // Check if user has exceeded submission limit
        check: function() {
            const now = Date.now();
            const submissions = JSON.parse(localStorage.getItem(SECURITY.config.rateLimitStorage) || '[]');
            
            // Remove old submissions
            const recentSubmissions = submissions.filter(time => 
                now - time < SECURITY.config.submissionWindow
            );
            
            if (recentSubmissions.length >= SECURITY.config.maxSubmissions) {
                throw new Error('Too many submissions. Please wait 5 minutes before trying again.');
            }
            
            // Add current submission
            recentSubmissions.push(now);
            localStorage.setItem(SECURITY.config.rateLimitStorage, JSON.stringify(recentSubmissions));
            
            return true;
        },

        // Reset rate limit (for testing)
        reset: function() {
            localStorage.removeItem(SECURITY.config.rateLimitStorage);
        },

        // Get remaining submissions
        remaining: function() {
            const now = Date.now();
            const submissions = JSON.parse(localStorage.getItem(SECURITY.config.rateLimitStorage) || '[]');
            const recentSubmissions = submissions.filter(time => 
                now - time < SECURITY.config.submissionWindow
            );
            return Math.max(0, SECURITY.config.maxSubmissions - recentSubmissions.length);
        }
    },

    // Session Management
    session: {
        // Start a new session
        start: function() {
            const sessionId = SECURITY.utils.generateId();
            const sessionData = {
                id: sessionId,
                startTime: Date.now(),
                lastActivity: Date.now()
            };
            sessionStorage.setItem('mm_session', JSON.stringify(sessionData));
            return sessionId;
        },

        // Update session activity
        update: function() {
            const session = SECURITY.session.get();
            if (session) {
                session.lastActivity = Date.now();
                sessionStorage.setItem('mm_session', JSON.stringify(session));
            }
        },

        // Get current session
        get: function() {
            const sessionData = sessionStorage.getItem('mm_session');
            if (!sessionData) return null;
            
            const session = JSON.parse(sessionData);
            const now = Date.now();
            
            // Check if session has expired
            if (now - session.lastActivity > SECURITY.config.sessionTimeout) {
                SECURITY.session.destroy();
                return null;
            }
            
            return session;
        },

        // Destroy session
        destroy: function() {
            sessionStorage.removeItem('mm_session');
        },

        // Check if session is valid
        isValid: function() {
            return SECURITY.session.get() !== null;
        }
    },

    // Utility Functions
    utils: {
        // Generate random ID
        generateId: function() {
            return Math.random().toString(36).substring(2) + Date.now().toString(36);
        },

        // Hash string (simple hash for client-side)
        hash: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return hash.toString(36);
        },

        // Secure random number
        secureRandom: function() {
            if (window.crypto && window.crypto.getRandomValues) {
                const array = new Uint32Array(1);
                window.crypto.getRandomValues(array);
                return array[0] / (0xffffffff + 1);
            }
            return Math.random(); // Fallback
        },

        // Log security events
        log: function(event, details = {}) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                event: event,
                details: details,
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            // Store in localStorage for debugging (in production, send to server)
            const logs = JSON.parse(localStorage.getItem('mm_security_logs') || '[]');
            logs.push(logEntry);
            
            // Keep only last 100 logs
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            localStorage.setItem('mm_security_logs', JSON.stringify(logs));
            console.log('Security Event:', logEntry);
        }
    },

    // Content Security Policy helpers
    csp: {
        // Check if inline script is allowed (for debugging)
        checkInlineScript: function() {
            try {
                eval('1');
                return true;
            } catch (e) {
                return false;
            }
        },

        // Report CSP violations
        reportViolation: function(violation) {
            SECURITY.utils.log('csp_violation', {
                blockedURI: violation.blockedURI,
                violatedDirective: violation.violatedDirective,
                originalPolicy: violation.originalPolicy
            });
        }
    },

    // Initialize security measures
    init: function() {
        // Start session
        if (!SECURITY.session.get()) {
            SECURITY.session.start();
        }

        // Update session activity on user interaction
        document.addEventListener('click', SECURITY.session.update);
        document.addEventListener('keypress', SECURITY.session.update);

        // Listen for CSP violations
        document.addEventListener('securitypolicyviolation', function(e) {
            SECURITY.csp.reportViolation(e);
        });

        // Prevent right-click context menu (optional)
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // Prevent text selection (optional)
        document.addEventListener('selectstart', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });

        // Prevent drag and drop
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });

        // Log initialization
        SECURITY.utils.log('security_initialized', {
            sessionId: SECURITY.session.get()?.id,
            userAgent: navigator.userAgent
        });

        console.log('🔒 Security measures initialized');
    }
};

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SECURITY.init);
} else {
    SECURITY.init();
}

// Export for use in other scripts
window.SECURITY = SECURITY;