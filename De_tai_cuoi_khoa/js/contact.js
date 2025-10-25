// Contact page functionality
class ContactManager {
    constructor() {
        this.chatOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFAQ();
    }

    setupEventListeners() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e);
            });
        }

        // Chat input
        const chatInput = document.getElementById('chat-input-field');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    setupFAQ() {
        // FAQ toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                this.toggleFAQ(e.target.closest('.faq-item'));
            }
        });
    }

    handleContactForm(e) {
        const formData = new FormData(e.target);
        const contactData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            date: new Date().toISOString()
        };

        // Validate form
        if (!this.validateContactForm(contactData)) {
            return;
        }

        // Store contact message
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // Handle newsletter subscription
        if (contactData.newsletter) {
            const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            if (!subscribers.includes(contactData.email)) {
                subscribers.push(contactData.email);
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            }
        }

        // Show success message
        this.showSuccessMessage();
        e.target.reset();
    }

    validateContactForm(data) {
        let isValid = true;

        // Required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                this.showFieldError(field, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                isValid = false;
            }
        });

        // Email validation
        if (data.email && !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldName, message) {
        this.clearFieldError(fieldName);
        
        const field = document.getElementById(fieldName);
        if (field) {
            field.style.borderColor = '#e74c3c';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '0.25rem';
            
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.style.borderColor = '#e1e5e9';
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }

    showSuccessMessage() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            }
            .notification-content i {
                font-size: 1.5rem;
                margin-top: 0.2rem;
            }
            .notification-content h4 {
                margin: 0 0 0.5rem 0;
                font-size: 1.1rem;
            }
            .notification-content p {
                margin: 0;
                opacity: 0.9;
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    toggleFAQ(faqItem) {
        // Close other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });

        // Toggle current FAQ item
        faqItem.classList.toggle('active');
    }

    openLiveChat() {
        this.toggleLiveChat();
    }

    toggleLiveChat() {
        this.chatOpen = !this.chatOpen;
        const chatWidget = document.getElementById('chat-widget');
        const chatToggle = document.getElementById('chat-toggle');

        if (this.chatOpen) {
            chatWidget.classList.add('active');
            chatToggle.style.display = 'none';
        } else {
            chatWidget.classList.remove('active');
            chatToggle.style.display = 'flex';
        }
    }

    closeLiveChat() {
        this.chatOpen = false;
        const chatWidget = document.getElementById('chat-widget');
        const chatToggle = document.getElementById('chat-toggle');
        
        chatWidget.classList.remove('active');
        chatToggle.style.display = 'flex';
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input-field');
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            this.addBotResponse(message);
        }, 1000);
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addBotResponse(userMessage) {
        const responses = this.getBotResponses(userMessage);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addChatMessage(randomResponse, 'bot');
    }

    getBotResponses(userMessage) {
        const message = userMessage.toLowerCase();

        if (message.includes('book') || message.includes('reserve')) {
            return [
                "I'd be happy to help you with your booking! You can browse our destinations and book directly on our website, or I can assist you with specific questions.",
                "For booking assistance, you can use our search page to find your perfect destination, or tell me what you're looking for and I'll help you find the right option."
            ];
        } else if (message.includes('price') || message.includes('cost')) {
            return [
                "Our prices vary depending on the destination and package. You can see current prices on our search page, or I can help you find budget-friendly options.",
                "All our prices are transparent with no hidden fees. Would you like me to help you find options within a specific budget?"
            ];
        } else if (message.includes('cancel') || message.includes('refund')) {
            return [
                "You can cancel your booking up to 24 hours before departure for a full refund. For cancellations within 24 hours, there's a 50% cancellation fee.",
                "Our cancellation policy is very traveler-friendly. Would you like me to help you with a specific cancellation request?"
            ];
        } else if (message.includes('help') || message.includes('support')) {
            return [
                "I'm here to help! I can assist with bookings, answer questions about our services, or connect you with a human agent if needed.",
                "How can I make your travel planning easier today? I can help with destinations, bookings, or any other questions you have."
            ];
        } else {
            return [
                "Thanks for your message! I'm here to help with any travel questions you have. How can I assist you today?",
                "I'd be happy to help! You can ask me about our destinations, booking process, or any other travel-related questions.",
                "Great question! I can help you find the perfect destination, assist with bookings, or answer any questions about our services."
            ];
        }
    }
}

// Global functions
function openLiveChat() {
    if (window.contactManager) {
        window.contactManager.openLiveChat();
    }
}

function toggleLiveChat() {
    if (window.contactManager) {
        window.contactManager.toggleLiveChat();
    }
}

function closeLiveChat() {
    if (window.contactManager) {
        window.contactManager.closeLiveChat();
    }
}

function sendMessage() {
    if (window.contactManager) {
        window.contactManager.sendMessage();
    }
}

// Initialize contact manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});
