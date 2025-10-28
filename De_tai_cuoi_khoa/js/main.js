// Main JavaScript functionality
class TravelEase {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(e);
            });
        }

        // Search functionality
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    performSearch() {
        const continent = document.getElementById('continent-select')?.value;
        const country = document.getElementById('country-select')?.value;

        // Store search parameters in localStorage
        const sortBy = localStorage.getItem('sortBy') || 'relevance';
        const searchParams = {
            continent,
            country,
            sortBy,
        };

        localStorage.setItem('searchParams', JSON.stringify(searchParams));

        // Redirect to search page
        window.location.href = 'search/search.html';
    }

    handleNewsletterSignup(e) {
        // Show success message
        alert('Thank you for subscribing! You will receive our latest travel deals and tips.');
        e.target.reset();
    }

    // Cart functionality
    addToCart(item) {
        // Use the quantity from the item if it exists, otherwise default to 1
        const quantity = item.quantity || 1;
        
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ ...item, quantity: quantity });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showCartNotification(quantity);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
    }

    updateCartQuantity(itemId, quantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('travelEaseCart', JSON.stringify(this.cart));
    }

    loadCart() {
        return JSON.parse(localStorage.getItem('travelEaseCart') || '[]');
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getCartItemCount();
        }
    }

    showCartNotification(quantity = 1) {
        // Use the passed quantity or default to 1
        const travelerCount = quantity;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${travelerCount} ticket${travelerCount > 1 ? 's' : ''} added to cart!</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #17703eff;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
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
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    // Data management
    getContinents() {
        return {
            "Asia": {
                name: "Asia",
                countries: [
                    "Japan", "Vietnam"
                ]
            },
            "Oceania": {
                name: "Oceania",
                countries: [
                    "Australia", "New Zealand", "Fiji"
                ]
            }
        };
    }

    getDestinations() {
        return [
            {
                id: 2,
                name: "Tokyo, Japan",
                image: "images/Asia/Japan/tokyo.jpg",
                description: "Experience the perfect blend of traditional culture and modern innovation.",
                price: 1500,
                rating: 4.9,
                duration: "10 days",
                continent: "Asia",
                country: "Japan"
            },
            {
                id: 10,
                name: "Sydney, Australia",
                image: "images/Oceania/Australia/australia.jpg",
                description: "Iconic harbor, world-class beaches, and unique wildlife.",
                price: 1600,
                rating: 4.6,
                duration: "8 days",
                continent: "Oceania",
                country: "Australia"
            },
            {
                id: 11,
                name: "South Island, New Zealand",
                image: "images/Oceania/New_Zealand/new_zealand.jpg",
                description: "Stunning mountains, beautiful lakes, and scenic deep sea valley between tall cliffs.",
                price: 1300,
                rating: 4.6,
                duration: "8 days",
                continent: "Oceania",
                country: "New Zealand"
            },
            {
                id: 12,
                name: "Viti Levu, Fiji",
                image: "images/Oceania/Fiji/fiji.jpg",
                description: "Stunning mountains, beautiful lakes, and scenic deep sea valley between tall cliffs.",
                price: 1300,
                rating: 4.6,
                duration: "8 days",
                continent: "Oceania",
                country: "Fiji"
            },
            {
                id: 14,
                name: "Hanoi, Vietnam",
                image: "images/Asia/Vietnam/vietnam.jpg",
                description: "Historic streets, serene lakes, and vibrant culture in Vietnam’s charming capital.",
                price: 1300,
                rating: 4.6,
                duration: "8 days",
                continent: "Asia",
                country: "Vietnam"
            }

        ];
    }

    getOffers() {
        return [
            {
                id: 6,
                name: "Asian Adventure",
                image: "images/tours/Asia/asia.jpg",
                description: "Explore Vietnam, Indonesia and China in one amazing journey.",
                price: 1800,
                originalPrice: 2200,
                rating: 4.8,
                duration: "12 days",
                badge: "18% OFF"
            }
        ];
    }

    getTestimonials() {
        return [
            {
                name: "Sarah Johnson",
                image: "images/customer/1.jpeg",
                text: "TravelEase made our honeymoon absolutely perfect. Every detail was taken care of, and we had the most amazing time in Santorini.",
                rating: 5,
                location: "New York, USA"
            },
            {
                name: "Michael Chen",
                image: "images/customer/3.jpeg",
                text: "The European Grand Tour exceeded all our expectations. Professional guides, comfortable accommodations, and unforgettable experiences.",
                rating: 5,
                location: "Toronto, Canada"
            },
            {
                name: "Emma Rodriguez",
                image: "images/customer/2.jpeg",
                text: "I've traveled with many companies, but TravelEase stands out for their attention to detail and customer service. Highly recommended!",
                rating: 5,
                location: "London, UK"
            }
        ];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.travelEase = new TravelEase();
});

// Global functions for HTML onclick events
function performSearch() {
    if (window.travelEase) {
        window.travelEase.performSearch();
    }
}

function addToCart(item) {
    if (window.travelEase) {
        window.travelEase.addToCart(item);
    }
}

function updateCountryOptions() {
    const continentSelect = document.getElementById('continent-select');
    const countrySelect = document.getElementById('country-select');
    
    if (!continentSelect || !countrySelect) return;
    
    const selectedContinent = continentSelect.value;
    const allowedContinents = new Set(['Asia', 'Oceania']);
    
    // Clear existing options
    countrySelect.innerHTML = '<option value="">Select Country</option>';
    
    if (selectedContinent && allowedContinents.has(selectedContinent) && window.travelEase) {
        const continents = window.travelEase.getContinents();
        const countries = continents[selectedContinent]?.countries || [];
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
        
        countrySelect.disabled = false;
    } else {
        countrySelect.disabled = true;
    }
}
