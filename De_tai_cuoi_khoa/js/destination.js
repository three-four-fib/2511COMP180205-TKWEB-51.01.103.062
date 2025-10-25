// Destination details page functionality
class DestinationManager {
    constructor() {
        this.destinationId = this.getDestinationId();
        this.destination = null;
        this.travelerCount = 1;
        this.galleryImages = [];
        this.currentImageIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.testimonials = [];
        this.currentTestimonialIndex = 0;
        this.init();
    }

    getDestinationId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || localStorage.getItem('selectedDestination') || '1';
    }

    init() {
        this.loadDestination();
        this.setupEventListeners();
        this.setupSwipeGestures();
    }

    setupEventListeners() {
        // FAQ toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                this.toggleFAQ(e.target.closest('.faq-item'));
            }
        });

        // Gallery modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-btn')) {
                this.openGallery();
            }
            if (e.target.closest('.close-btn')) {
                this.closeGallery();
            }
            if (e.target.closest('.gallery-modal') && !e.target.closest('.modal-content')) {
                this.closeGallery();
            }
        });
    }


    loadDestination() {
        // Get destination data from the main data source
        const allDestinations = [
            ...window.travelEase.getDestinations(),
            ...window.travelEase.getOffers()
        ];
        
        this.destination = allDestinations.find(dest => dest.id == this.destinationId);
        
        if (!this.destination) {
            this.showError();
            return;
        }

        this.displayDestination();
        this.loadRelatedPackages();
    }

    displayDestination() {
        // Update page title
        document.title = `${this.destination.name} - TravelEase`;
        
        // Update breadcrumb
        document.getElementById('destination-name').textContent = this.destination.name;
        
        // Update main content
        document.getElementById('destination-title').textContent = this.destination.name;
        document.getElementById('destination-description').textContent = this.destination.description;
        document.getElementById('rating-score').textContent = this.destination.rating;
        document.getElementById('destination-location').textContent = this.getLocationFromName(this.destination.name);
        document.getElementById('booking-price').textContent = window.travelEase.formatPrice(this.destination.price);
        
        // Show original price if it's an offer
        if (this.destination.originalPrice) {
            document.getElementById('original-price').textContent = window.travelEase.formatPrice(this.destination.originalPrice);
            document.getElementById('original-price').style.display = 'inline';
        }

        // Update main image
        document.getElementById('main-image').src = this.destination.image;
        document.getElementById('main-image').alt = this.destination.name;

        // Load gallery
        this.loadGallery();
        
        // Load itinerary
        this.loadHighlights();
        
        // Load features
        this.loadFeatures();
        
        // Load reviews
        this.loadReviews();
        
        // Load FAQs
        this.loadFAQs();
    }

    getLocationFromName(name) {
        const parts = name.split(',');
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }

    getDestinationGallery() {
        // Return different gallery images based on destination
        const destinationId = parseInt(this.destinationId);
        const destinationName = this.destination.name.toLowerCase();
        
        // Define gallery images for each destination
        const galleries = {
            // Paris, France
            1: [
                '../images/Europe/France/paris.jpg',
                '../images/Europe/France/paris_1.jpg',
                '../images/Europe/France/paris_2.jpg',
                '../images/Europe/France/paris_3.jpg',
                '../images/Europe/France/paris_4.jpg',
            ],
            // Tokyo, Japan
            2: [
                "../images/Asia/japan/tokyo.jpg",
                "../images/Asia/japan/tokyo_1.jpg",
                "../images/Asia/japan/tokyo_2.jpg",
            ],
            // Santorini, Greece
            3: [
                '../images/santorini.jpg',
                '../images/santorini_1.jpg',
                '../images/santorini_2.jpg',
            ],
            // Bali, Indonesia
            4: [
                '../images/bali.jpg',
                '../images/bali_1.jpg',
                '../images/bali_2.jpg',
            ],
            // European Grand Tour
            5: [
                '../images/europe_tour.jpg',
                '../images/europe_tour_1.jpg',
                '../images/europe_tour_2.jpg',
            ],
            // Asian Adventure
            6: [
                '../images/asia_tour.jpg',
                '../images/asia_tour_1.jpg',
                '../images/asia_tour_2.jpg',
            ],
            // Cape Town, South Africa
            7: [
                '../images/capetown.jpg',
                '../images/capetown_1.jpg',
                '../images/capetown_2.jpg',
            ],
            // New York, USA
            8: [
                '../images/newyork.jpg',
                '../images/newyork_1.jpg',
                '../images/newyork_2.jpg',
            ],
            // Rio de Janeiro, Brazil
            9: [
                '../images/rio.jpg',
                '../images/rio_1.jpg',
                '../images/rio_2.jpg',
            ],
            // Sydney, Australia
            10: [
                '../images/Oceania/Australia/australia.jpg',
                '../images/Oceania/Australia/australia_1.jpg',
                '../images/Oceania/Australia/australia_2.jpg'
            ],
            11: [
                '../images/Oceania/New_Zealand/new_zealand.jpg',
                '../images/Oceania/New_Zealand/new_zealand_1.jpg',
                '../images/Oceania/New_Zealand/new_zealand_2.jpg',
            ],
            12: [
                '../images/Oceania/Fiji/fiji.jpg',
                '../images/Oceania/Fiji/fiji_1.png',
                '../images/Oceania/Fiji/fiji_2.jpg',
                '../images/Oceania/Fiji/fiji_3.jpg',
            ]
        };

        // Return specific gallery or default to Paris
        return galleries[destinationId] || [
            '../images/paris.jpg',
            '../images/paris_1.jpg',
            '../images/paris_2.jpg',
        ];
    }

    loadGallery() {
        // Get destination-specific gallery images
        this.galleryImages = this.getDestinationGallery();

        this.currentImageIndex = 0;
        this.updateMainImage();
        this.updateNavigationButtons();
        this.createSwipeIndicators();

        // Update thumbnails
        const thumbnailGrid = document.getElementById('thumbnail-grid');
        thumbnailGrid.innerHTML = this.galleryImages.slice(1).map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="destinationManager.goToImage(${index + 1})">
                <img src="${img}" alt="Gallery image ${index + 2}">
            </div>
        `).join('');

        // Update modal gallery
        const modalGallery = document.getElementById('modal-gallery');
        modalGallery.innerHTML = this.galleryImages.map((img, index) => `
            <img src="${img}" alt="Gallery image ${index + 1}" onclick="destinationManager.setMainImage('${img}')">
        `).join('');
    }

    setMainImage(imageSrc) {
        const index = this.galleryImages.indexOf(imageSrc);
        if (index !== -1) {
            this.currentImageIndex = index;
            this.updateMainImage();
            this.updateNavigationButtons();
            this.updateSwipeIndicators();
        }
        this.closeGallery();
    }

    setupSwipeGestures() {
        const mainImageContainer = document.getElementById('main-image-container');
        
        // Touch events for mobile swipe
        mainImageContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        mainImageContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        // Mouse events for desktop drag
        let isDragging = false;
        let startX = 0;

        mainImageContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            mainImageContainer.style.cursor = 'grabbing';
        });

        mainImageContainer.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
            }
        });

        mainImageContainer.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                mainImageContainer.style.cursor = 'pointer';
                const endX = e.clientX;
                if (Math.abs(endX - startX) > 50) {
                    if (endX > startX) {
                        this.previousImage();
                    } else {
                        this.nextImage();
                    }
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextImage();
            } else {
                this.previousImage();
            }
        }
    }

    updateMainImage() {
        const mainImage = document.getElementById('main-image');
        mainImage.src = this.galleryImages[this.currentImageIndex];
        mainImage.alt = `Gallery image ${this.currentImageIndex + 1}`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentImageIndex === 0;
        nextBtn.disabled = this.currentImageIndex === this.galleryImages.length - 1;
    }

    createSwipeIndicators() {
        const indicatorsContainer = document.getElementById('swipe-indicators');
        indicatorsContainer.innerHTML = this.galleryImages.map((_, index) => `
            <div class="swipe-indicator ${index === 0 ? 'active' : ''}" 
                 onclick="destinationManager.goToImage(${index})"></div>
        `).join('');
    }

    updateSwipeIndicators() {
        const indicators = document.querySelectorAll('.swipe-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentImageIndex);
        });
    }

    updateThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentImageIndex - 1);
        });
    }

    goToImage(index) {
        if (index >= 0 && index < this.galleryImages.length) {
            this.currentImageIndex = index;
            this.updateMainImage();
            this.updateNavigationButtons();
            this.updateSwipeIndicators();
            this.updateThumbnails();
        }
    }

    nextImage() {
        if (this.currentImageIndex < this.galleryImages.length - 1) {
            this.currentImageIndex++;
            this.updateMainImage();
            this.updateNavigationButtons();
            this.updateSwipeIndicators();
            this.updateThumbnails();
        }
    }

    previousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
            this.updateMainImage();
            this.updateNavigationButtons();
            this.updateSwipeIndicators();
            this.updateThumbnails();
        }
    }

    loadHighlights() {
        const highlightsData = this.getHighlightsData();
        const highlightsList = document.getElementById('highlights-list');
        
        highlightsList.innerHTML = highlightsData.map(highlight => `
            <div class="highlight-item">
                <h4>${highlight.title}</h4>
                <p>${highlight.description}</p>
                <div class="category">${highlight.category}</div>
            </div>
        `).join('');
    }

    getHighlightsData() {
        const baseHighlights = [
            {
                title: "Must-See Attractions",
                description: "Discover the most iconic landmarks and attractions that define this destination.",
                category: "Sightseeing"
            },
            {
                title: "Local Cuisine",
                description: "Experience authentic flavors and traditional dishes at the best local restaurants.",
                category: "Food & Drink"
            },
            {
                title: "Cultural Experiences",
                description: "Immerse yourself in local culture through museums, festivals, and traditions.",
                category: "Culture"
            },
            {
                title: "Adventure Activities",
                description: "Thrilling outdoor adventures and unique experiences for the adventurous traveler.",
                category: "Adventure"
            },
            {
                title: "Shopping & Markets",
                description: "Find unique souvenirs and local crafts at traditional markets and boutiques.",
                category: "Shopping"
            }
        ];
        
        return baseHighlights;
    }

    loadFeatures() {
        const features = [
            "Professional tour guide",
            "Transportation included",
            "Accommodation (4-star hotel)",
            "All meals included",
            "Entrance fees covered",
            "Travel insurance",
            "24/7 customer support",
            "Free cancellation"
        ];

        const featuresGrid = document.getElementById('features-grid');
        featuresGrid.innerHTML = features.map(feature => `
            <div class="feature-item">
                <i class="fas fa-check"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    }

    loadReviews() {
        const reviews = this.getReviewsData();
        const reviewsList = document.getElementById('reviews-list');
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
                        <div class="reviewer-details">
                            <h4>${review.name}</h4>
                            <p>${review.location}</p>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${Array(review.rating).fill(0).map(() => '<i class="fas fa-star"></i>').join('')}
                    </div>
                </div>
                <div class="review-text">${review.text}</div>
            </div>
        `).join('');
    }

    getReviewsData() {
        return [
            {
                name: "Sarah Johnson",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                location: "New York, USA",
                rating: 5,
                text: "Absolutely amazing experience! The tour guide was knowledgeable and friendly, and we saw so many incredible sights. Highly recommend this trip to anyone looking for an authentic travel experience."
            },
            {
                name: "Michael Chen",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                location: "Toronto, Canada",
                rating: 5,
                text: "Perfect organization and attention to detail. Every aspect of the trip was well-planned, from transportation to accommodations. The local experiences were unforgettable."
            },
            {
                name: "Emma Rodriguez",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                location: "London, UK",
                rating: 4,
                text: "Great value for money! The itinerary was well-balanced with both guided activities and free time. The accommodation was comfortable and centrally located."
            }
        ];
    }

    loadFAQs() {
        const faqs = this.getFAQsData();
        const faqList = document.getElementById('faq-list');
        
        faqList.innerHTML = faqs.map(faq => `
            <div class="faq-item">
                <div class="faq-question">
                    <h4>${faq.question}</h4>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
    }

    getFAQsData() {
        return [
            {
                question: "What is included in the price?",
                answer: "The price includes accommodation, transportation, all meals, entrance fees, professional guide services, and travel insurance. Personal expenses and optional activities are not included."
            },
            {
                question: "What is the cancellation policy?",
                answer: "You can cancel your booking up to 24 hours before departure for a full refund. Cancellations made within 24 hours are subject to a 50% cancellation fee."
            },
            {
                question: "What should I pack?",
                answer: "We recommend comfortable walking shoes, weather-appropriate clothing, a camera, and any personal items you may need. A detailed packing list will be provided upon booking."
            },
            {
                question: "Are meals suitable for dietary restrictions?",
                answer: "Yes, we can accommodate most dietary restrictions including vegetarian, vegan, gluten-free, and common allergies. Please inform us of any dietary requirements when booking."
            },
            {
                question: "What is the group size?",
                answer: "Our tours typically have 8-15 participants to ensure a personalized experience. Private tours are also available for smaller groups or families."
            }
        ];
    }

    loadRelatedPackages() {
        const relatedPackages = this.getRelatedPackages();
        const relatedGrid = document.getElementById('related-grid');
        
        relatedGrid.innerHTML = relatedPackages.map(pkg => `
            <div class="related-card" onclick="viewDestination(${pkg.id})">
                <img src="${pkg.image}" alt="${pkg.name}">
                <div class="related-card-content">
                    <h3>${pkg.name}</h3>
                    <p>${pkg.description}</p>
                    <div class="price">${window.travelEase.formatPrice(pkg.price)}</div>
                </div>
            </div>
        `).join('');
    }

    getRelatedPackages() {
        const allDestinations = [
            ...window.travelEase.getDestinations(),
            ...window.travelEase.getOffers()
        ];
        
        return allDestinations
            .filter(dest => dest.id != this.destinationId)
            .slice(0, 3);
    }

    toggleFAQ(faqItem) {
        faqItem.classList.toggle('active');
    }

    openGallery() {
        document.getElementById('gallery-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeGallery() {
        document.getElementById('gallery-modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    showError() {
        document.querySelector('.container').innerHTML = `
            <div class="error-message" style="text-align: center; padding: 4rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                <h2>Destination Not Found</h2>
                <p>The destination you're looking for doesn't exist or has been removed.</p>
                <a href="../index.html" class="btn">Return to Home</a>
            </div>
        `;
    }
}

// Global functions
function changeTravelers(delta) {
    if (window.destinationManager) {
        const newCount = window.destinationManager.travelerCount + delta;
        if (newCount >= 1 && newCount <= 10) {
            window.destinationManager.travelerCount = newCount;
            document.getElementById('traveler-count').textContent = newCount;
        }
    }
}

function addToCart() {
    if (window.destinationManager && window.travelEase) {
        const destination = window.destinationManager.destination;
        const quantity = window.destinationManager.travelerCount;
        
        // Create cart item with quantity
        const cartItem = {
            ...destination,
            quantity: quantity
        };
        
        window.travelEase.addToCart(cartItem);
    }
}

function bookNow() {
    console.log('bookNow function called');
    
    // Check if destinationManager exists
    if (!window.destinationManager) {
        console.error('destinationManager not found');
        alert('Error: Destination manager not initialized');
        return;
    }
    
    // Store booking data and redirect to checkout
    const destination = window.destinationManager.destination;
    const quantity = window.destinationManager.travelerCount || 1;
    
    console.log('Destination:', destination);
    console.log('Quantity:', quantity);
    
    // Check if destination exists
    if (!destination) {
        console.error('Destination not found');
        alert('Error: Destination information not available');
        return;
    }
    
    // Add the destination to cart with the selected quantity
    if (window.travelEase) {
        const cartItem = {
            id: destination.id,
            name: destination.name,
            price: destination.price,
            image: destination.image,
            quantity: quantity
        };
        
        console.log('Adding to cart:', cartItem);
        window.travelEase.addToCart(cartItem);
        
        // Redirect to cart page
        window.location.href = '../cart/cart.html';
    } else {
        console.error('TravelEase not available');
        alert('Error: Cart system not available');
    }
}

function viewDestination(id) {
    localStorage.setItem('selectedDestination', id);
    window.location.href = `destination.html?id=${id}`;
}

function nextImage() {
    if (window.destinationManager) {
        window.destinationManager.nextImage();
    }
}

function previousImage() {
    if (window.destinationManager) {
        window.destinationManager.previousImage();
    }
}

// Initialize destination manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.destinationManager = new DestinationManager();
});
