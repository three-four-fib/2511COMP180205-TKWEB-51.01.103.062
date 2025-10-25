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
        const searchParams = {
            continent,
            country,
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
                    "Japan", "China", "Vietnam", "Singapore", "Taiwan"
                ]
            },
            "Europe": {
                name: "Europe", 
                countries: [
                    "France", "Italy", "Spain", "Ireland"
                ]
            },
            "Africa": {
                name: "Africa",
                countries: [
                    "Egypt", "Tanzania", "Tunisia",
                ]
            },
            "North America": {
                name: "North America",
                countries: [
                    "United States", "Canada", "Mexico", "Costa Rica",
                ]
            },
            "South America": {
                name: "South America", 
                countries: [
                    "Brazil", "Peru", "Venezuela",
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
                id: 1,
                name: "Paris, France",
                image: "images/Europe/France/paris.jpg",
                description: "The City of Light awaits with its romantic charm and world-class attractions.",
                price: 1200,
                rating: 4.8,
                duration: "7 days",
                continent: "Europe",
                country: "France"
            },
            {
                id: 2,
                name: "Tokyo, Japan",
                image: "../images/Asia/japan/tokyo.jpg",
                description: "Experience the perfect blend of traditional culture and modern innovation.",
                price: 1500,
                rating: 4.9,
                duration: "10 days",
                continent: "Asia",
                country: "Japan"
            },
            {
                id: 3,
                name: "Santorini, Greece",
                image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Stunning sunsets, white-washed buildings, and crystal-clear waters.",
                price: 1800,
                rating: 4.7,
                duration: "5 days",
                continent: "Europe",
                country: "Greece"
            },
            {
                id: 4,
                name: "Bali, Indonesia",
                image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Tropical paradise with lush landscapes and rich cultural heritage.",
                price: 900,
                rating: 4.6,
                duration: "8 days",
                continent: "Asia",
                country: "Indonesia"
            },
            {
                id: 7,
                name: "Cape Town, South Africa",
                image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Stunning landscapes, rich culture, and amazing wildlife experiences.",
                price: 1100,
                rating: 4.5,
                duration: "9 days",
                continent: "Africa",
                country: "South Africa"
            },
            {
                id: 8,
                name: "New York, USA",
                image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "The city that never sleeps with endless attractions and experiences.",
                price: 1300,
                rating: 4.7,
                duration: "6 days",
                continent: "North America",
                country: "United States"
            },
            {
                id: 9,
                name: "Rio de Janeiro, Brazil",
                image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Vibrant culture, beautiful beaches, and the famous Carnival.",
                price: 950,
                rating: 4.4,
                duration: "7 days",
                continent: "South America",
                country: "Brazil"
            },
            {
                id: 10,
                name: "Sydney, Australia",
                image: "../images/Oceania/Australia/australia.jpg",
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
                image: "../images/Oceania/New_Zealand/new_zealand.jpg",
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
                image: "../images/Oceania/Fijis/fiji.jpg",
                description: "Stunning mountains, beautiful lakes, and scenic deep sea valley between tall cliffs.",
                price: 1300,
                rating: 4.6,
                duration: "8 days",
                continent: "Oceania",
                country: "New Zealand"
            }
        ];
    }

    getOffers() {
        return [
            {
                id: 5,
                name: "European Grand Tour",
                image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Visit 5 countries in 14 days - Paris, Rome, Barcelona, Amsterdam, and Prague.",
                price: 2500,
                originalPrice: 3200,
                rating: 4.9,
                duration: "14 days",
                badge: "25% OFF"
            },
            {
                id: 6,
                name: "Asian Adventure",
                image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Explore Thailand, Vietnam, and Cambodia in one amazing journey.",
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
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                text: "TravelEase made our honeymoon absolutely perfect. Every detail was taken care of, and we had the most amazing time in Santorini.",
                rating: 5,
                location: "New York, USA"
            },
            {
                name: "Michael Chen",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                text: "The European Grand Tour exceeded all our expectations. Professional guides, comfortable accommodations, and unforgettable experiences.",
                rating: 5,
                location: "Toronto, Canada"
            },
            {
                name: "Emma Rodriguez",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
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
    
    // Clear existing options
    countrySelect.innerHTML = '<option value="">Select Country</option>';
    
    if (selectedContinent && window.travelEase) {
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
