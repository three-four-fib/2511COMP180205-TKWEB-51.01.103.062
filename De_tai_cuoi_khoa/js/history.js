// History page functionality
class HistoryManager {
    constructor() {
        this.bookings = [];
        this.filteredBookings = [];
        this.currentFilter = '';
        this.currentSort = 'date-desc';
        this.init();
    }

    init() {
        this.loadBookings();
        this.setupEventListeners();
        this.displayBookings();
        console.log('HistoryManager initialized with', this.bookings.length, 'bookings');
    }

    setupEventListeners() {
        // Filter and sort controls are handled by inline onchange events
        // Modal close on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('booking-modal');
            if (e.target === modal) {
                this.closeBookingModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBookingModal();
            }
        });
    }

    loadBookings() {
        // Load bookings from localStorage
        const storedBookings = localStorage.getItem('travelEase_bookings');
        if (storedBookings) {
            this.bookings = JSON.parse(storedBookings);
        }
        
        // If no bookings in localStorage, check if there are any in the global travelEase object
        if (this.bookings.length === 0 && window.travelEase && window.travelEase.bookings) {
            this.bookings = window.travelEase.bookings;
        }
    }

    saveBookings() {
        localStorage.setItem('travelEase_bookings', JSON.stringify(this.bookings));
        if (window.travelEase) {
            window.travelEase.bookings = this.bookings;
        }
    }

    addBooking(bookingData) {
        // Add booking to history
        this.bookings.unshift(bookingData); // Add to beginning of array
        this.saveBookings();
        this.displayBookings();
    }

    displayBookings() {
        const container = document.getElementById('bookings-container');
        const emptyState = document.getElementById('empty-history');
        
        if (this.bookings.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        container.style.display = 'block';
        emptyState.style.display = 'none';

        // Apply current filter and sort
        this.applyFiltersAndSort();
        
        container.innerHTML = this.filteredBookings.map(booking => this.createBookingCardHTML(booking)).join('');
    }

    createBookingCardHTML(booking) {
        const status = this.getBookingStatus(booking);
        const statusClass = `status-${status}`;
        const formatPrice = (price) => {
            if (window.travelEase && window.travelEase.formatPrice) {
                return window.travelEase.formatPrice(price);
            }
            return `$${price.toFixed(2)}`;
        };

        return `
            <div class="booking-card" data-booking-id="${booking.id}">
                <div class="booking-header">
                    <div class="booking-info">
                        <h3>Booking #${booking.id}</h3>
                        <div class="booking-id">ID: ${booking.id}</div>
                        <div class="booking-date">${this.formatDate(booking.date)}</div>
                    </div>
                    <div class="booking-status ${statusClass}">${status}</div>
                </div>
                
                <div class="booking-amount">
                    ${formatPrice(booking.total)}
                </div>
                
                <div class="booking-items">
                    <h4>Travel Packages (${booking.items.length})</h4>
                    <div class="items-list">
                        ${booking.items.map(item => `
                            <div class="booking-item">
                                <img src="${item.image}" alt="${item.name}" class="item-image">
                                <div class="item-details">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${this.getLocationFromName(item.name)}
                                    </div>
                                    <div class="item-quantity">${item.quantity} ${item.quantity === 1 ? 'Traveler' : 'Travelers'}</div>
                                </div>
                                <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="booking-actions">
                    <button class="btn-details" onclick="historyManager.viewBookingDetails('${booking.id}')">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    ${status === 'completed' ? `
                        <button class="btn-cancel" onclick="historyManager.cancelBooking('${booking.id}')">
                            <i class="fas fa-times"></i>
                            Cancel Booking
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getLocationFromName(name) {
        const parts = name.split(',');
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }

    getBookingStatus(booking) {
        if (booking.cancelled) {
            return 'cancelled';
        } else {
            return 'completed';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    applyFiltersAndSort() {
        // Apply status filter
        if (this.currentFilter) {
            this.filteredBookings = this.bookings.filter(booking => 
                this.getBookingStatus(booking) === this.currentFilter
            );
        } else {
            this.filteredBookings = [...this.bookings];
        }

        // Apply sorting
        this.filteredBookings.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'amount-desc':
                    return b.total - a.total;
                case 'amount-asc':
                    return a.total - b.total;
                default:
                    return 0;
            }
        });
    }

    filterBookings() {
        const statusFilter = document.getElementById('status-filter');
        this.currentFilter = statusFilter.value;
        this.displayBookings();
    }

    sortBookings() {
        const sortFilter = document.getElementById('sort-filter');
        this.currentSort = sortFilter.value;
        this.displayBookings();
    }

    clearFilters() {
        document.getElementById('status-filter').value = '';
        document.getElementById('sort-filter').value = 'date-desc';
        this.currentFilter = '';
        this.currentSort = 'date-desc';
        this.displayBookings();
    }

    viewBookingDetails(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const modal = document.getElementById('booking-modal');
        const detailsContainer = document.getElementById('booking-details');
        
        const formatPrice = (price) => {
            if (window.travelEase && window.travelEase.formatPrice) {
                return window.travelEase.formatPrice(price);
            }
            return `$${price.toFixed(2)}`;
        };

        detailsContainer.innerHTML = `
            <div class="detail-section">
                <h4>Booking Information</h4>
                <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${booking.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Date:</span>
                    <span class="detail-value">${this.formatDate(booking.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${this.getBookingStatus(booking)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">${formatPrice(booking.total)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h4>Travel Packages</h4>
                ${booking.items.map(item => `
                    <div class="booking-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${this.getLocationFromName(item.name)}
                            </div>
                            <div class="item-quantity">${item.quantity} ${item.quantity === 1 ? 'Traveler' : 'Travelers'}</div>
                        </div>
                        <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                `).join('')}
            </div>

            <div class="detail-section">
                <h4>Customer Information</h4>
                <div class="customer-info">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${booking.customer.firstName} ${booking.customer.lastName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${booking.customer.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${booking.customer.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Address:</span>
                        <span class="detail-value">${booking.customer.address}, ${booking.customer.city}, ${booking.customer.state} ${booking.customer.zip}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Payment Information</h4>
                <div class="payment-info">
                    <div class="detail-row">
                        <span class="detail-label">Payment Method:</span>
                        <span class="detail-value">${booking.payment.method}</span>
                    </div>
                    ${booking.payment.method === 'card' ? `
                        <div class="detail-row">
                            <span class="detail-label">Card Number:</span>
                            <span class="detail-value">**** **** **** ${booking.payment.cardNumber.slice(-4)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Cardholder:</span>
                            <span class="detail-value">${booking.payment.cardholderName}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeBookingModal() {
        const modal = document.getElementById('booking-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    cancelBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            booking.cancelled = true;
            booking.cancelledDate = new Date().toISOString();
            this.saveBookings();
            this.displayBookings();
            alert('Booking has been cancelled successfully.');
        }
    }
}

// Global functions for inline event handlers
function filterBookings() {
    if (window.historyManager) {
        window.historyManager.filterBookings();
    }
}

function sortBookings() {
    if (window.historyManager) {
        window.historyManager.sortBookings();
    }
}

function clearFilters() {
    if (window.historyManager) {
        window.historyManager.clearFilters();
    }
}

function closeBookingModal() {
    if (window.historyManager) {
        window.historyManager.closeBookingModal();
    }
}

// Initialize history manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing HistoryManager...');
    
    // Prevent multiple initializations
    if (window.historyManager) {
        console.log('HistoryManager already exists, skipping initialization');
        return;
    }
    
    window.historyManager = new HistoryManager();
    console.log('HistoryManager initialized:', !!window.historyManager);
});
