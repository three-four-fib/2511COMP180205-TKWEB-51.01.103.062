// Cart page functionality
class CartManager {
    constructor() {
        this.cart = [];
        this.promoCode = null;
        this.promoDiscount = 0;
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.displayCart();
        this.updateCartCount();
        console.log('CartManager init completed, cart items:', this.cart.length);
    }

    setupEventListeners() {
        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectPaymentMethod(option);
            });
        });

        // Form validation
        document.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
            });
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiry-date');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                this.formatExpiryDate(e.target);
            });
        }
    }

    loadCart() {
        this.cart = window.travelEase.cart;
    }

    displayCart() {
        const cartList = document.getElementById('cart-list');
        const emptyCart = document.getElementById('empty-cart');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.cart.length === 0) {
            cartList.style.display = 'none';
            emptyCart.style.display = 'block';
            clearCartBtn.style.display = 'none';
            checkoutBtn.disabled = true;
            return;
        }

        cartList.style.display = 'block';
        emptyCart.style.display = 'none';
        clearCartBtn.style.display = 'block';
        checkoutBtn.disabled = false;

        cartList.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        this.updateOrderSummary();
    }

    createCartItemHTML(item) {
        const isOffer = item.originalPrice && item.originalPrice > item.price;
        const discount = isOffer ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${this.getLocationFromName(item.name)}</span>
                    </div>
                    <div class="cart-item-features">
                        <span class="feature-tag">${item.duration}</span>
                        <span class="feature-tag">
                            <i class="fas fa-star"></i> ${item.rating}
                        </span>
                        ${isOffer ? `<span class="feature-tag">${discount}% OFF</span>` : ''}
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity} ${item.quantity === 1 ? 'Traveler' : 'Travelers'}</span>
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})" ${item.quantity >= 10 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">
                        ${isOffer ? `<span class="original-price">${window.travelEase.formatPrice(item.originalPrice * item.quantity)}</span>` : ''}
                        <div class="price">${window.travelEase.formatPrice(item.price * item.quantity)}</div>
                    </div>
                    <button class="remove-btn" onclick="cartManager.removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;
    }

    getLocationFromName(name) {
        const parts = name.split(',');
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQuantity;
                window.travelEase.saveCart();
                this.displayCart();
                this.updateCartCount();
            }
        }
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        window.travelEase.cart = this.cart;
        window.travelEase.saveCart();
        this.displayCart();
        this.updateCartCount();
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            window.travelEase.cart = [];
            window.travelEase.saveCart();
            this.displayCart();
            this.updateCartCount();
        }
    }

    updateOrderSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const taxes = subtotal * 0.08; // 8% tax
        const serviceFee = subtotal * 0.03; // 3% service fee
        const discount = this.promoDiscount;
        const total = subtotal + taxes + serviceFee - discount;

        // Use fallback formatPrice if travelEase is not available
        const formatPrice = (price) => {
            if (window.travelEase && window.travelEase.formatPrice) {
                return window.travelEase.formatPrice(price);
            }
            return `$${price.toFixed(2)}`;
        };

        const subtotalEl = document.getElementById('subtotal');
        const taxesEl = document.getElementById('taxes');
        const serviceFeeEl = document.getElementById('service-fee');
        const totalEl = document.getElementById('total');
        const checkoutTotalEl = document.getElementById('checkout-total');

        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
        if (taxesEl) taxesEl.textContent = formatPrice(taxes);
        if (serviceFeeEl) serviceFeeEl.textContent = formatPrice(serviceFee);
        if (totalEl) totalEl.textContent = formatPrice(total);
        if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(total);
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
    }

    applyPromoCode() {
        // Check for promo code in checkout modal first, then fallback to main cart
        const promoInput = document.getElementById('checkout-promo-code') || document.getElementById('promo-code');
        const promoMessage = document.getElementById('checkout-promo-message') || document.getElementById('promo-message');
        const code = promoInput.value.trim().toUpperCase();

        const validPromoCodes = {
            'WELCOME10': 0.10,
            'SAVE20': 0.20,
            'TRAVEL15': 0.15
        };

        if (validPromoCodes[code]) {
            this.promoCode = code;
            this.promoDiscount = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0) * validPromoCodes[code];
            
            promoMessage.textContent = `Promo code "${code}" applied! You saved ${window.travelEase.formatPrice(this.promoDiscount)}`;
            promoMessage.className = 'promo-message success';
            promoMessage.style.display = 'block';
            
            // Update checkout summary if we're in the modal
            if (document.getElementById('checkout-modal').classList.contains('active')) {
                this.loadCheckoutSummary();
            } else {
                this.updateOrderSummary();
            }
        } else {
            promoMessage.textContent = 'Invalid promo code. Please try again.';
            promoMessage.className = 'promo-message error';
            promoMessage.style.display = 'block';
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        this.openCheckoutModal();
    }

    openCheckoutModal() {
        const checkoutModal = document.getElementById('checkout-modal');
        if (!checkoutModal) {
            console.error('Checkout modal element not found');
            return;
        }
        
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize the new step-by-step checkout
        this.initializeCheckout();
    }

    closeCheckoutModal() {
        document.getElementById('checkout-modal').classList.remove('active');
        document.body.style.overflow = 'auto';
        this.resetCheckoutSteps();
    }

    initializeCheckout() {
        // Reset to step 1
        this.currentStep = 1;
        this.showStep(1);
        this.loadCheckoutSummary();
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }


    nextStep(stepNumber) {
        if (this.validateCurrentStep()) {
            this.currentStep = stepNumber;
            this.showStep(stepNumber);
            
            // Load summary on step 3
            if (stepNumber === 3) {
                this.loadCheckoutSummary();
            }
        }
    }

    prevStep(stepNumber) {
        this.currentStep = stepNumber;
        this.showStep(stepNumber);
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return true;

        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields correctly');
        }

        return isValid;
    }

    resetCheckoutSteps() {
        this.currentStep = 1;
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('step-1').classList.add('active');
    }

    loadCheckoutSummary() {
        console.log('loadCheckoutSummary called');
        
        const summaryItems = document.getElementById('checkout-summary-items');
        if (!summaryItems) {
            console.error('checkout-summary-items element not found');
            return;
        }
        
        const total = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const taxes = total * 0.08;
        const serviceFee = total * 0.03;
        const discount = this.promoDiscount;
        const finalTotal = total + taxes + serviceFee - discount;

        // Use fallback formatPrice if travelEase is not available
        const formatPrice = (price) => {
            if (window.travelEase && window.travelEase.formatPrice) {
                return window.travelEase.formatPrice(price);
            }
            return `$${price.toFixed(2)}`;
        };

        summaryItems.innerHTML = this.cart.map(item => `
            <div class="summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('') + `
            <div class="summary-item">
                <span>Taxes</span>
                <span>${formatPrice(taxes)}</span>
            </div>
            <div class="summary-item">
                <span>Service Fee</span>
                <span>${formatPrice(serviceFee)}</span>
            </div>
            ${discount > 0 ? `
            <div class="summary-item discount-item">
                <span>Discount (${this.promoCode})</span>
                <span>-${formatPrice(discount)}</span>
            </div>
            ` : ''}
        `;

        const checkoutTotal = document.getElementById('checkout-total');
        if (checkoutTotal) {
            checkoutTotal.textContent = formatPrice(finalTotal);
        }
        
        console.log('loadCheckoutSummary completed');
    }

    selectPaymentMethod(option) {
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const method = option.dataset.method;
        const cardForm = document.getElementById('card-form');
        
        if (method === 'card') {
            cardForm.style.display = 'block';
        } else {
            cardForm.style.display = 'none';
        }
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substr(0, 19);
        }
        input.value = formattedValue;
    }

    formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id.replace('-', ' ');
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, `${fieldName} is required`);
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '#e1e5e9';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    processPayment() {
        // Validate all required fields across all steps
        const allRequiredFields = document.querySelectorAll('input[required], select[required]');
        let isValid = true;

        allRequiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Check terms agreement
        const termsAgreement = document.getElementById('terms-agreement');
        if (!termsAgreement.checked) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        if (!isValid) {
            alert('Please fill in all required fields correctly');
            return;
        }

        // Show processing state immediately
        const processBtn = document.getElementById('process-payment-btn');
        const originalText = processBtn.innerHTML;
        processBtn.disabled = true;
        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
        processBtn.style.opacity = '0.8';
        processBtn.style.cursor = 'not-allowed';

        // Process payment immediately
        setTimeout(() => {
            this.completeBooking();
        }, 100);
    }


    completeBooking() {

        // Store booking data
        const bookingData = {
            id: 'BK' + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            items: [...this.cart],
            customer: {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value
            },
            payment: {
                method: document.querySelector('.payment-option.active').dataset.method,
                cardNumber: document.getElementById('card-number').value,
                expiryDate: document.getElementById('expiry-date').value,
                cvv: document.getElementById('cvv').value,
                cardholderName: document.getElementById('cardholder-name').value
            },
            total: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 
                   (this.cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.11) - this.promoDiscount,
            cancelled: false
        };

        // Store booking in history
        this.storeBookingInHistory(bookingData);

        // Clear cart
        this.cart = [];
        window.travelEase.cart = [];
        window.travelEase.saveCart();

        // Close checkout modal and show success
        this.closeCheckoutModal();
        console.log('About to show success modal with booking data:', bookingData);
        
        // Add a small delay to ensure the checkout modal is fully closed
        setTimeout(() => {
            this.showSuccessModal(bookingData);
        }, 100);
    }

    showSuccessModal(bookingData) {
        console.log('showSuccessModal called with:', bookingData);
        const bookingDetails = document.getElementById('booking-details');
        if (!bookingDetails) {
            console.error('booking-details element not found');
            return;
        }
        
        bookingDetails.innerHTML = `
            <h4>Booking Details</h4>
            <div class="booking-detail-item">
                <span>Booking ID:</span>
                <span>${bookingData.id}</span>
            </div>
            <div class="booking-detail-item">
                <span>Total Amount:</span>
                <span>$${bookingData.total.toFixed(2)}</span>
            </div>
            <div class="booking-detail-item">
                <span>Items:</span>
                <span>${bookingData.items.length} travel package(s)</span>
            </div>
        `;

        const successModal = document.getElementById('success-modal');
        if (!successModal) {
            console.error('success-modal element not found');
            return;
        }
        
        console.log('Adding active class to success modal');
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeSuccessModal() {
        document.getElementById('success-modal').classList.remove('active');
        document.body.style.overflow = 'auto';
        this.displayCart();
        this.updateCartCount();
    }

    storeBookingInHistory(bookingData) {
        // Load existing bookings from localStorage
        let bookings = [];
        const storedBookings = localStorage.getItem('travelEase_bookings');
        if (storedBookings) {
            bookings = JSON.parse(storedBookings);
        }
        
        // Add new booking to the beginning of the array
        bookings.unshift(bookingData);
        
        // Save updated bookings to localStorage
        localStorage.setItem('travelEase_bookings', JSON.stringify(bookings));
        
        // Also update the global travelEase object if it exists
        if (window.travelEase) {
            window.travelEase.bookings = bookings;
        }
        
        console.log('Booking stored in history:', bookingData.id);
    }
}

// Global functions for new checkout system
function clearCart() {
    if (window.cartManager) {
        window.cartManager.clearCart();
    }
}

function applyPromoCode() {
    if (window.cartManager) {
        window.cartManager.applyPromoCode();
    }
}

function proceedToCheckout() {
    if (window.cartManager) {
        window.cartManager.proceedToCheckout();
    }
}

function closeCheckoutModal() {
    if (window.cartManager) {
        window.cartManager.closeCheckoutModal();
    }
}

function nextStep(stepNumber) {
    if (window.cartManager) {
        window.cartManager.nextStep(stepNumber);
    }
}

function prevStep(stepNumber) {
    if (window.cartManager) {
        window.cartManager.prevStep(stepNumber);
    }
}

function processPayment() {
    if (window.cartManager) {
        window.cartManager.processPayment();
    }
}

function closeSuccessModal() {
    if (window.cartManager) {
        window.cartManager.closeSuccessModal();
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing CartManager...');
    
    // Prevent multiple initializations
    if (window.cartManager) {
        console.log('CartManager already exists, skipping initialization');
        return;
    }
    
    window.cartManager = new CartManager();
    console.log('CartManager initialized:', !!window.cartManager);
    
    // Add click event listener to checkout button to prevent multiple calls
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        // Remove any existing listeners first
        checkoutBtn.removeEventListener('click', handleCheckoutClick);
        checkoutBtn.addEventListener('click', handleCheckoutClick);
    }
});

// Separate function for checkout click handling
function handleCheckoutClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Checkout button clicked');
    
    // Prevent multiple rapid clicks
    if (window.checkoutInProgress) {
        console.log('Checkout already in progress, ignoring click');
        return;
    }
    
    proceedToCheckout();
}
