// Security Configuration
const SECURITY_CONFIG = {
    maxInputLength: 1000,
    maxSubmissions: 5,
    submissionWindow: 300000, // 5 minutes
    allowedDomains: ['formspree.io', 'maps.googleapis.com'],
    rateLimitStorage: 'mm_rate_limit'
};

// Security: Input sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML.substring(0, SECURITY_CONFIG.maxInputLength);
}

// Security: Rate limiting
function checkRateLimit() {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(SECURITY_CONFIG.rateLimitStorage) || '[]');
    
    // Remove old submissions
    const recentSubmissions = submissions.filter(time => now - time < SECURITY_CONFIG.submissionWindow);
    
    if (recentSubmissions.length >= SECURITY_CONFIG.maxSubmissions) {
        throw new Error('Too many submissions. Please wait 5 minutes before trying again.');
    }
    
    // Add current submission
    recentSubmissions.push(now);
    localStorage.setItem(SECURITY_CONFIG.rateLimitStorage, JSON.stringify(recentSubmissions));
}

// Security: Validate URL
function isValidURL(url) {
    try {
        const urlObj = new URL(url);
        return SECURITY_CONFIG.allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
    } catch {
        return false;
    }
}

// Security: Validate form data
function validateFormData(formData) {
    for (let [key, value] of formData.entries()) {
        if (typeof value === 'string') {
            if (value.length > SECURITY_CONFIG.maxInputLength) {
                throw new Error(`Input for ${key} is too long`);
            }
            // Check for potential XSS patterns
            if (/<script|javascript:|on\w+=/i.test(value)) {
                throw new Error('Invalid input detected');
            }
        }
    }
}

// Modal System
class ModalManager {
    static show(title, message, type = 'success', callback = null) {
        // Remove any existing modals
        ModalManager.removeAll();
        
        const modalId = 'modal-' + Date.now();
        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const colorMap = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.innerHTML = `
            <div class="modal-overlay" onclick="ModalManager.close('${modalId}')">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-icon" style="color: ${colorMap[type]}">
                        ${iconMap[type]}
                    </div>
                    <h3 class="modal-title">${title}</h3>
                    <p class="modal-message">${message}</p>
                    <div class="modal-buttons">
                        <button class="modal-btn modal-btn-primary" onclick="ModalManager.close('${modalId}', ${callback ? 'true' : 'false'})">
                            ${callback ? 'Continue' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: modalFadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: modalSlideIn 0.3s ease;
            }
            
            .modal-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .modal-title {
                color: #333;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            
            .modal-message {
                color: #666;
                margin-bottom: 1.5rem;
                line-height: 1.5;
            }
            
            .modal-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            .modal-btn {
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .modal-btn-primary {
                background: #ff6b6b;
                color: white;
            }
            
            .modal-btn-primary:hover {
                background: #ff5252;
                transform: translateY(-2px);
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes modalSlideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-30px) scale(0.9);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Store callback for later use
        if (callback) {
            modal.dataset.callback = callback.toString();
        }
        
        // Auto-close after 10 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                ModalManager.close(modalId, callback ? true : false);
            }, 10000);
        }
    }
    
    static close(modalId, executeCallback = false) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Execute callback if provided
        if (executeCallback && modal.dataset.callback) {
            try {
                const callback = new Function('return ' + modal.dataset.callback)();
                if (typeof callback === 'function') {
                    callback();
                }
            } catch (error) {
                console.error('Error executing modal callback:', error);
            }
        }
        
        // Animate out
        modal.style.animation = 'modalFadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    static removeAll() {
        const modals = document.querySelectorAll('[id^="modal-"]');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }
}

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof STUDIO_CONFIG !== 'undefined') {
        updateContactInfo();
        updateSocialLinks();
        updateWhatsAppButton();
        updateMapConfig();
        updateFormspreeConfig();
    }
});

// Update contact information from config
function updateContactInfo() {
    const config = STUDIO_CONFIG.contact;
    
    // Update phone numbers
    const phoneElements = document.querySelectorAll('[data-phone]');
    phoneElements.forEach(el => {
        el.textContent = config.phone;
        if (el.tagName === 'A') {
            el.href = `tel:${config.phone}`;
        }
    });
    
    // Update email addresses
    const emailElements = document.querySelectorAll('[data-email]');
    emailElements.forEach(el => {
        el.textContent = config.email;
        if (el.tagName === 'A') {
            el.href = `mailto:${config.email}`;
        }
    });
    
    // Update addresses
    const addressElements = document.querySelectorAll('[data-address]');
    addressElements.forEach(el => {
        el.innerHTML = `${config.address.street}<br>${config.address.area}, ${config.address.city}<br>${config.address.state} ${config.address.zip}`;
    });
    
    // Update business hours
    const hoursElements = document.querySelectorAll('[data-hours]');
    hoursElements.forEach(el => {
        el.innerHTML = `${STUDIO_CONFIG.hours.weekdays}<br>${STUDIO_CONFIG.hours.weekends}`;
    });
}

// Update social media links
function updateSocialLinks() {
    const social = STUDIO_CONFIG.social;
    
    Object.keys(social).forEach(platform => {
        const links = document.querySelectorAll(`[data-social="${platform}"]`);
        links.forEach(link => {
            link.href = social[platform];
        });
    });
}

// Update WhatsApp button
function updateWhatsAppButton() {
    const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${STUDIO_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`;
    });
}

// Update map configuration
function updateMapConfig() {
    // This will be used by the initMap function
    window.studioLocation = STUDIO_CONFIG.maps.coordinates;
}

// Update Formspree configuration
function updateFormspreeConfig() {
    // Update contact form
    const contactForm = document.querySelector('.contact-form[data-formspree]');
    if (contactForm && STUDIO_CONFIG.formspree.contactFormId) {
        contactForm.action = `https://formspree.io/f/${STUDIO_CONFIG.formspree.contactFormId}`;
    }
    
    // Update booking form
    const bookingForm = document.querySelector('#sessionBookingForm[data-formspree]');
    if (bookingForm && STUDIO_CONFIG.formspree.bookingFormId) {
        bookingForm.action = `https://formspree.io/f/${STUDIO_CONFIG.formspree.bookingFormId}`;
    }
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Booking Calendar Functionality
class BookingCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.bookings = this.loadBookings();
        this.timeSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
            '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
        ];
        this.init();
    }

    init() {
        this.renderCalendar();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        document.getElementById('roomSelect').addEventListener('change', () => {
            this.updateTimeSlots();
        });

        document.getElementById('sessionBookingForm').addEventListener('submit', (e) => {
            this.handleBookingSubmit(e);
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

        // Clear calendar grid
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.background = '#f0f0f0';
            calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const currentDate = new Date(year, month, day);
            const dateString = this.formatDate(currentDate);
            
            // Disable past dates
            if (currentDate < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', () => {
                    this.selectDate(currentDate, dayElement);
                });
            }

            // Highlight today
            if (currentDate.toDateString() === new Date().toDateString()) {
                dayElement.style.border = '2px solid #ff6b6b';
            }

            // Show booking indicators
            const bookingCount = this.getBookingCountForDate(dateString);
            if (bookingCount > 0) {
                dayElement.style.position = 'relative';
                const indicator = document.createElement('div');
                indicator.style.cssText = `
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    width: 8px;
                    height: 8px;
                    background: #ff6b6b;
                    border-radius: 50%;
                    font-size: 8px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                indicator.textContent = bookingCount;
                indicator.title = `${bookingCount} booking(s) on this date`;
                dayElement.appendChild(indicator);
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection to clicked day
        element.classList.add('selected');
        this.selectedDate = date;

        // Update form
        document.getElementById('selectedDate').value = this.formatDate(date);
        document.getElementById('bookingForm').style.display = 'block';
        
        // Scroll to form
        document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
    }

    updateTimeSlots() {
        const roomSelect = document.getElementById('roomSelect');
        const timeSlot = document.getElementById('timeSlot');
        const selectedRoom = roomSelect.value;
        const dateString = this.formatDate(this.selectedDate);

        timeSlot.innerHTML = '<option value="">Choose time</option>';

        if (!selectedRoom || !this.selectedDate) return;

        // Add availability info container
        let availabilityInfo = document.getElementById('availability-info');
        if (!availabilityInfo) {
            availabilityInfo = document.createElement('div');
            availabilityInfo.id = 'availability-info';
            availabilityInfo.style.cssText = `
                margin-top: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 5px;
                font-size: 0.9rem;
                color: #666;
            `;
            timeSlot.parentNode.appendChild(availabilityInfo);
        }

        let availableSlots = 0;
        let unavailableSlots = [];

        this.timeSlots.forEach(time => {
            if (this.isTimeSlotAvailable(dateString, selectedRoom, time)) {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSlot.appendChild(option);
                availableSlots++;
            } else {
                // Find which service is blocking this time
                const conflictingService = this.getConflictingService(dateString, selectedRoom, time);
                unavailableSlots.push({ time, service: conflictingService });
            }
        });

        // Update availability info
        let infoText = `Available slots: ${availableSlots}`;
        if (unavailableSlots.length > 0) {
            infoText += `<br>Unavailable slots: `;
            unavailableSlots.forEach((slot, index) => {
                const serviceName = this.getServiceDisplayName(slot.service);
                infoText += `${slot.time} (${serviceName})`;
                if (index < unavailableSlots.length - 1) infoText += ', ';
            });
        }
        availabilityInfo.innerHTML = infoText;
    }

    getConflictingService(dateString, selectedRoom, time) {
        const roomConflicts = {
            'room1-jamming': ['room1-jamming', 'room1-gaming'],
            'room1-gaming': ['room1-jamming', 'room1-gaming'],
            'room2-recording': ['room2-recording']
        };

        const conflictingServices = roomConflicts[selectedRoom] || [selectedRoom];
        
        for (const service of conflictingServices) {
            const bookingKey = `${dateString}_${service}_${time}`;
            if (this.bookings[bookingKey]) {
                return service;
            }
        }
        return null;
    }

    getServiceDisplayName(service) {
        const serviceNames = {
            'room1-jamming': 'Jamming Session',
            'room1-gaming': 'Gaming Session',
            'room2-recording': 'Recording Studio'
        };
        return serviceNames[service] || service;
    }

    getBookingCountForDate(dateString) {
        let count = 0;
        Object.keys(this.bookings).forEach(key => {
            if (key.startsWith(dateString + '_')) {
                count++;
            }
        });
        return count;
    }

    isTimeSlotAvailable(dateString, selectedRoom, time) {
        // Define room conflicts
        const roomConflicts = {
            'room1-jamming': ['room1-jamming', 'room1-gaming'], // Room 1 services conflict with each other
            'room1-gaming': ['room1-jamming', 'room1-gaming'],  // Room 1 services conflict with each other
            'room2-recording': ['room2-recording']              // Room 2 only conflicts with itself
        };

        // Get conflicting services for the selected room
        const conflictingServices = roomConflicts[selectedRoom] || [selectedRoom];

        // Check if any conflicting service is already booked at this time
        for (const service of conflictingServices) {
            const bookingKey = `${dateString}_${service}_${time}`;
            if (this.bookings[bookingKey]) {
                return false; // Time slot is not available
            }
        }

        return true; // Time slot is available
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        
        const bookingData = {
            date: document.getElementById('selectedDate').value,
            room: document.getElementById('roomSelect').value,
            time: document.getElementById('timeSlot').value,
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            requests: document.getElementById('specialRequests').value
        };

        // Validate booking data
        if (!bookingData.date || !bookingData.room || !bookingData.time || !bookingData.name || !bookingData.phone || !bookingData.email) {
            this.showBookingError('Please fill in all required fields.');
            return;
        }

        // Double-check availability before booking
        if (!this.isTimeSlotAvailable(bookingData.date, bookingData.room, bookingData.time)) {
            this.showBookingError('Sorry, this time slot is no longer available. Please select a different time.');
            this.updateTimeSlots(); // Refresh available time slots
            return;
        }

        // Save booking locally for availability tracking
        const bookingKey = `${bookingData.date}_${bookingData.room}_${bookingData.time}`;
        this.bookings[bookingKey] = bookingData;
        this.saveBookings();

        // Submit to Formspree
        this.submitBookingToFormspree(e.target, bookingData);
    }

    async submitBookingToFormspree(form, bookingData) {
        try {
            // Security: Rate limiting
            checkRateLimit();
            
            // Security: Validate form action URL
            if (!isValidURL(form.action)) {
                throw new Error('Invalid form action URL');
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            // Submit form to Formspree
            const formData = new FormData(form);
            
            // Security: Validate form data
            validateFormData(formData);
            
            // Add formatted booking summary to the form
            const bookingSummary = `
BOOKING DETAILS:
================
Date: ${bookingData.date}
Service: ${bookingData.room}
Time: ${bookingData.time}
Customer: ${bookingData.name}
Phone: ${bookingData.phone}
Email: ${bookingData.email}
Special Requests: ${bookingData.requests || 'None'}

Booking ID: ${Date.now()}
Submitted: ${new Date().toLocaleString()}
            `;
            
            formData.append('booking_summary', bookingSummary);

            // Security: Add timeout and abort controller
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                // Success
                this.showBookingSuccess();
            } else {
                // Handle Formspree errors
                const data = await response.json();
                if (data.errors) {
                    throw new Error(data.errors.map(error => error.message).join(', '));
                } else {
                    throw new Error('Failed to submit booking');
                }
            }
        } catch (error) {
            console.error('Booking submission error:', error);
            this.showBookingError(error.message);
        } finally {
            // Reset button state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Confirm Booking';
            submitBtn.disabled = false;
        }
    }

    showBookingSuccess() {
        // Reset form and hide booking form first
        document.getElementById('sessionBookingForm').reset();
        document.getElementById('bookingForm').style.display = 'none';
        
        // Remove calendar selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Show success modal with redirect
        ModalManager.show(
            'Booking Confirmed!',
            'Your booking request has been submitted successfully. We will contact you shortly to confirm the details and payment.',
            'success',
            () => {
                window.location.href = 'booking-confirmation.html';
            }
        );
    }

    showBookingError(errorMessage) {
        ModalManager.show(
            'Booking Failed',
            `Sorry, there was an error submitting your booking: ${errorMessage}<br><br>Please try again or contact us directly.`,
            'error'
        );
    }

    formatDate(date) {
        // Use local date to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    loadBookings() {
        const saved = localStorage.getItem('studioBookings');
        return saved ? JSON.parse(saved) : {};
    }

    saveBookings() {
        localStorage.setItem('studioBookings', JSON.stringify(this.bookings));
    }
}

// Initialize booking calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookingCalendar();
});

// Close booking form
function closeBookingForm() {
    document.getElementById('bookingForm').style.display = 'none';
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
}

// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Booking form handling
    const bookingForm = document.querySelector('#sessionBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingFormSubmit);
    }
});

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Security: Rate limiting
        checkRateLimit();
        
        // Security: Validate form action URL
        if (!isValidURL(form.action)) {
            throw new Error('Invalid form action URL');
        }
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Submit to Formspree
        const formData = new FormData(form);
        
        // Security: Validate form data
        validateFormData(formData);
        
        // Security: Add timeout and abort controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            showContactSuccess();
            form.reset();
        } else {
            const data = await response.json();
            if (data.errors) {
                throw new Error(data.errors.map(error => error.message).join(', '));
            } else {
                throw new Error('Failed to send message');
            }
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showContactError(error.message);
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleBookingFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Security: Rate limiting
        checkRateLimit();
        
        // Security: Validate form action URL
        if (!isValidURL(form.action)) {
            throw new Error('Invalid form action URL');
        }
        
        // Show loading state
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;
        
        // Submit to Formspree
        const formData = new FormData(form);
        
        // Security: Validate booking data
        validateBookingData(formData);
        
        // Security: Add timeout and abort controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            showBookingSuccess();
            form.reset();
            closeBookingForm();
        } else {
            const data = await response.json();
            if (data.errors) {
                throw new Error(data.errors.map(error => error.message).join(', '));
            } else {
                throw new Error('Failed to send booking request');
            }
        }
    } catch (error) {
        console.error('Booking form error:', error);
        showBookingError(error.message);
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Validate booking data
function validateBookingData(formData) {
    const requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'booking_date', 'room_service', 'time_slot'];
    
    for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            throw new Error(`${field.replace('_', ' ')} is required`);
        }
    }
    
    // Validate email format
    const email = formData.get('customer_email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    
    // Check input lengths
    const name = formData.get('customer_name');
    if (name && name.length > 100) {
        throw new Error('Name is too long');
    }
    
    return true;
}

// Show booking success
function showBookingSuccess() {
    ModalManager.show(
        'Booking Confirmed!',
        'Your booking request has been sent successfully. We will contact you shortly to confirm your session.',
        'success'
    );
}

// Show booking error
function showBookingError(message) {
    ModalManager.show(
        'Booking Failed',
        `Sorry, there was an error processing your booking: ${message}. Please try again or contact us directly.`,
        'error'
    );
}

function showContactSuccess() {
    ModalManager.show(
        'Message Sent!',
        'Thank you for your message! We will get back to you soon.',
        'success',
        () => {
            window.location.href = 'thank-you.html';
        }
    );
}

function showContactError(errorMessage) {
    ModalManager.show(
        'Message Failed',
        `Sorry, there was an error sending your message: ${errorMessage}<br><br>Please try again or contact us directly.`,
        'error'
    );
}

// Google Maps initialization
function initMap() {
    // Check if Google Maps is available
    if (typeof google === 'undefined') {
        console.log('Google Maps not loaded. Showing placeholder map.');
        showMapPlaceholder();
        return;
    }
    
    // Use coordinates from config or default location
    const studioLocation = window.studioLocation || STUDIO_CONFIG?.maps?.coordinates || { lat: 18.5679, lng: 73.9143 };
    
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: studioLocation,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{"weight": "2.00"}]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#9c9c9c"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#eeeeee"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#7b7b7b"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#c8d7d4"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#070707"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#ffffff"}]
            }
        ]
    });

    const marker = new google.maps.Marker({
        position: studioLocation,
        map: map,
        title: 'M&M: Music & More',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
                    <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">M&M</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    const config = STUDIO_CONFIG || {};
    const contact = config.contact || {};
    const address = contact.address || {};
    
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #ff6b6b;">${config.name || 'M&M: Music & More'}</h3>
                <p style="margin: 0; color: #666;">Professional Music Studio</p>
                <p style="margin: 5px 0 0 0; color: #666;">📍 ${address.street || ''}, ${address.area || ''}</p>
                <p style="margin: 5px 0 0 0; color: #666;">📞 ${contact.phone || ''}</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Show map placeholder when Google Maps is not available
function showMapPlaceholder() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        const config = STUDIO_CONFIG || {};
        const contact = config.contact || {};
        const address = contact.address || {};
        
        mapContainer.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div>
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3 style="margin: 0 0 1rem 0;">${config.name || 'M&M: Music & More'}</h3>
                    <p style="margin: 0; line-height: 1.6;">
                        ${address.street || ''}<br>
                        ${address.area || ''}, ${address.city || ''}<br>
                        ${address.state || ''} ${address.zip || ''}
                    </p>
                    <p style="margin: 1rem 0 0 0; font-size: 0.9rem; opacity: 0.9;">
                        Click to open in Google Maps
                    </p>
                </div>
            </div>
        `;
        
        // Make the placeholder clickable to open Google Maps
        mapContainer.style.cursor = 'pointer';
        mapContainer.addEventListener('click', () => {
            const searchQuery = encodeURIComponent(`${address.street}, ${address.area}, ${address.city}, ${address.state} ${address.zip}`);
            window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
        });
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .gallery-item, .contact-item').forEach(el => {
    observer.observe(el);
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Gallery lightbox functionality
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
                <div class="lightbox-caption">
                    <h3>${item.querySelector('h3').textContent}</h3>
                    <p>${item.querySelector('p').textContent}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Close lightbox
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });
    });
});

// Add lightbox styles dynamically
const lightboxStyles = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 10px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10001;
    }
    
    .lightbox-caption {
        color: white;
        margin-top: 1rem;
    }
    
    .lightbox-caption h3 {
        margin-bottom: 0.5rem;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// Preloader
window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="music-loader">
                <div class="note"></div>
                <div class="note"></div>
                <div class="note"></div>
            </div>
            <h3>M&M: Music & More</h3>
            <p>Loading your musical experience...</p>
        </div>
    `;
    
    // Add preloader styles
    const preloaderStyles = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
            color: white;
        }
        
        .music-loader {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-bottom: 2rem;
        }
        
        .music-loader .note {
            width: 8px;
            height: 40px;
            background: #ff6b6b;
            border-radius: 4px;
            animation: musicBounce 1.2s infinite ease-in-out;
        }
        
        .music-loader .note:nth-child(2) {
            animation-delay: -1.1s;
        }
        
        .music-loader .note:nth-child(3) {
            animation-delay: -1.0s;
        }
        
        @keyframes musicBounce {
            0%, 40%, 100% {
                transform: scaleY(0.4);
            }
            20% {
                transform: scaleY(1.0);
            }
        }
    `;
    
    const preloaderStyleSheet = document.createElement('style');
    preloaderStyleSheet.textContent = preloaderStyles;
    document.head.appendChild(preloaderStyleSheet);
    
    document.body.appendChild(preloader);
    
    // Remove preloader after 2 seconds
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(preloader)) {
                document.body.removeChild(preloader);
            }
        }, 500);
    }, 2000);
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
document.body.appendChild(scrollProgress);

// Add scroll progress styles
const scrollProgressStyles = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        z-index: 9999;
    }
    
    .scroll-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #ff6b6b, #ff8a80);
        width: 0%;
        transition: width 0.1s ease;
    }
`;

const scrollProgressStyleSheet = document.createElement('style');
scrollProgressStyleSheet.textContent = scrollProgressStyles;
document.head.appendChild(scrollProgressStyleSheet);

// Update scroll progress
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    document.querySelector('.scroll-progress-bar').style.width = scrollPercent + '%';
});

// Add floating action button for quick booking
const fabButton = document.createElement('div');
fabButton.className = 'fab-button';
fabButton.innerHTML = '<i class="fas fa-calendar-plus"></i>';
fabButton.addEventListener('click', () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
});
document.body.appendChild(fabButton);

// Add FAB styles
const fabStyles = `
    .fab-button {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #ff6b6b, #ff8a80);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
        transition: all 0.3s ease;
        z-index: 999;
    }
    
    .fab-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
    }
`;

const fabStyleSheet = document.createElement('style');
fabStyleSheet.textContent = fabStyles;
document.head.appendChild(fabStyleSheet);