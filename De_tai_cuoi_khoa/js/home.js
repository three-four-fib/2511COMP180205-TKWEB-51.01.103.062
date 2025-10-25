// Home page specific functionality
document.addEventListener('DOMContentLoaded', () => {
    loadDestinations();
    loadOffers();
    loadTestimonials();
});

function loadDestinations() {
    const destinationsGrid = document.getElementById('destinations-grid');
    if (!destinationsGrid) return;

    const destinations = window.travelEase.getDestinations();
    
    destinationsGrid.innerHTML = destinations.map(destination => `
        <div class="destination-card" onclick="viewDestination(${destination.id})">
            <img src="${destination.image}" alt="${destination.name}">
            <div class="destination-card-content">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span class="price">${window.travelEase.formatPrice(destination.price)}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-star" style="color: #ffc107;"></i>
                        <span>${destination.rating}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <span style="color: #666; font-size: 0.9rem;">${destination.duration}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function loadOffers() {
    const offersGrid = document.getElementById('offers-grid');
    if (!offersGrid) return;

    const offers = window.travelEase.getOffers();
    
    offersGrid.innerHTML = offers.map(offer => `
        <div class="offer-card" onclick="viewDestination(${offer.id})">
            <div class="offer-badge">${offer.badge}</div>
            <img src="${offer.image}" alt="${offer.name}">
            <div class="offer-card-content">
                <h3>${offer.name}</h3>
                <p>${offer.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                    <div>
                        <span class="price">${window.travelEase.formatPrice(offer.price)}</span>
                        <span class="original-price">${window.travelEase.formatPrice(offer.originalPrice)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-star" style="color: #ffc107;"></i>
                        <span>${offer.rating}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <span style="color: #666; font-size: 0.9rem;">${offer.duration}</span>
                </div>
                <button class="btn" style="width: 100%; margin-top: 1rem;" onclick="event.stopPropagation(); addToCart(${JSON.stringify(offer).replace(/"/g, '&quot;')})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (!testimonialsGrid) return;

    const testimonials = window.travelEase.getTestimonials();
    
    testimonialsGrid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <p>${testimonial.text}</p>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.name}">
                <div class="testimonial-author-info">
                    <h4>${testimonial.name}</h4>
                    <p>${testimonial.location}</p>
                    <div style="display: flex; gap: 0.2rem; margin-top: 0.5rem;">
                        ${Array(testimonial.rating).fill(0).map(() => '<i class="fas fa-star" style="color: #ffc107; font-size: 0.8rem;"></i>').join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function viewDestination(id) {
    // Store the destination ID for the details page
    localStorage.setItem('selectedDestination', id);
    window.location.href = `destination/destination.html?id=${id}`;
}