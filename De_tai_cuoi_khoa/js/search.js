// Search page functionality
class SearchManager {
    constructor() {
        this.allResults = [];
        this.filteredResults = [];
        this.currentPage = 1;
        this.resultsPerPage = 9;
        this.currentView = 'grid';
        this.init();
    }

    init() {
        this.loadSearchParams();
        this.loadAllResults();
        this.setupEventListeners();
        this.displayResults();
    }

    setupEventListeners() {
        // Filter inputs
        document.getElementById('continent-filter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('country-filter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('destination-filter')?.addEventListener('input', () => this.applyFilters());
        document.getElementById('price-filter')?.addEventListener('change', () => this.applyFilters());

        // Sort select
        document.getElementById('sort-select')?.addEventListener('change', () => this.sortResults());
    }

    loadSearchParams() {
        const searchParams = JSON.parse(localStorage.getItem('searchParams') || '{}');
        
        if (searchParams.continent) {
            document.getElementById('continent-filter').value = searchParams.continent;
            this.updateCountryFilter();
        }
        if (searchParams.country) {
            document.getElementById('country-filter').value = searchParams.country;
        }
    }

    loadAllResults() {
        // Combine destinations and offers for search results
        const destinations = window.travelEase.getDestinations();
        const offers = window.travelEase.getOffers();
        
        this.allResults = [
            ...destinations.map(item => ({ ...item, type: 'tour' })),
            ...offers.map(item => ({ ...item, type: 'tour' }))
        ];
        
        this.filteredResults = [...this.allResults];
    }

    applyFilters() {
        const continent = document.getElementById('continent-filter').value;
        const country = document.getElementById('country-filter').value;
        const destination = document.getElementById('destination-filter').value.toLowerCase();
        const priceRange = document.getElementById('price-filter').value;

        this.filteredResults = this.allResults.filter(item => {
            // Continent filter
            if (continent && item.continent !== continent) {
                return false;
            }

            // Country filter
            if (country && item.country !== country) {
                return false;
            }

            // Destination filter
            if (destination && !item.name.toLowerCase().includes(destination)) {
                return false;
            }

            // Price range filter
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
                if (item.price < min || (max !== Infinity && item.price > max)) {
                    return false;
                }
            }

            return true;
        });

        this.currentPage = 1;
        this.displayResults();
    }

    sortResults() {
        const sortBy = document.getElementById('sort-select').value;
        
        this.filteredResults.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'duration':
                    // Extract number from duration string
                    const aDuration = parseInt(a.duration) || 0;
                    const bDuration = parseInt(b.duration) || 0;
                    return aDuration - bDuration;
                default: // relevance
                    return 0;
            }
        });

        this.displayResults();
    }

    displayResults() {
        const container = document.getElementById('results-container');
        const countElement = document.getElementById('results-count');
        
        if (!container) return;

        // Update results count
        if (countElement) {
            countElement.textContent = `${this.filteredResults.length} results found`;
        }

        if (this.filteredResults.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try adjusting your search criteria or browse our featured destinations.</p>
                    <button class="btn" onclick="window.location.href='../index.html'">Browse Destinations</button>
                </div>
            `;
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(this.filteredResults.length / this.resultsPerPage);
        const startIndex = (this.currentPage - 1) * this.resultsPerPage;
        const endIndex = startIndex + this.resultsPerPage;
        const pageResults = this.filteredResults.slice(startIndex, endIndex);

        // Display results
        container.innerHTML = pageResults.map(item => this.createResultCard(item)).join('');

        // Display pagination
        this.displayPagination(totalPages);
    }

    createResultCard(item) {
        const hasDiscount = item.originalPrice && item.originalPrice > item.price;
        const discount = hasDiscount ? 
            Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

        return `
            <div class="result-card" onclick="viewDestination(${item.id})">
                ${hasDiscount && discount > 0 ? `<div class="offer-badge">${discount}% OFF</div>` : ''}
                <img src="${item.image}" alt="${item.name}">
                <div class="result-card-content">
                    <h3>${item.name}</h3>
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${this.getLocationFromName(item.name)}</span>
                    </div>
                    <p class="description">${item.description}</p>
                    
                    <div class="features">
                        <span class="feature-tag">${item.duration}</span>
                        <span class="feature-tag">
                            <i class="fas fa-star"></i> ${item.rating}
                        </span>
                        <span class="feature-tag">Tour</span>
                    </div>
                    
                    <div class="price-section">
                        <div>
                            ${hasDiscount ? 
                                `<span class="original-price">${window.travelEase.formatPrice(item.originalPrice)}</span>` : ''
                            }
                            <span class="price">${window.travelEase.formatPrice(item.price)}</span>
                        </div>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${item.rating}</span>
                        </div>
                    </div>
                    
                    <div class="duration">
                        <i class="fas fa-clock"></i>
                        <span>${item.duration}</span>
                    </div>
                    
                    <div class="actions">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary" onclick="event.stopPropagation(); viewDestination(${item.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getLocationFromName(name) {
        // Extract location from destination name
        const parts = name.split(',');
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }

    displayPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination || totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="searchManager.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="${i === this.currentPage ? 'active' : ''}" onclick="searchManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // Next button
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="searchManager.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredResults.length / this.resultsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.displayResults();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateCountryFilter() {
        const continentSelect = document.getElementById('continent-filter');
        const countrySelect = document.getElementById('country-filter');
        
        if (!continentSelect || !countrySelect) return;
        
        const selectedContinent = continentSelect.value;
        
        // Clear existing options
        countrySelect.innerHTML = '<option value="">All Countries</option>';
        
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
        
        // Apply filters after updating country options
        this.applyFilters();
    }
}

// Global functions
function applyFilters() {
    if (window.searchManager) {
        window.searchManager.applyFilters();
    }
}

function sortResults() {
    if (window.searchManager) {
        window.searchManager.sortResults();
    }
}

function updateCountryFilter() {
    if (window.searchManager) {
        window.searchManager.updateCountryFilter();
    }
}

function viewDestination(id) {
    localStorage.setItem('selectedDestination', id);
    window.location.href = `../destination/destination.html?id=${id}`;
}

// Initialize search manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager();
});
