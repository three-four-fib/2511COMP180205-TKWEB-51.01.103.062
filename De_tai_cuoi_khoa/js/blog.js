// Blog page functionality
class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentCategory = '';
        this.currentSort = 'newest';
        this.displayedPosts = 6;
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupEventListeners();
        this.displayPosts();
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
    }

    loadPosts() {
        // Sample blog posts data
        this.posts = [
            {
                id: 1,
                title: "10 Hidden Gems in Europe You Must Visit",
                excerpt: "Discover the most beautiful and lesser-known destinations across Europe that offer authentic experiences away from the crowds.",
                image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "destinations",
                date: "2024-12-10",
                author: "Sarah Johnson",
                views: 2847,
                likes: 156,
                comments: 23,
                readTime: "8 min read"
            },
            {
                id: 2,
                title: "Packing Like a Pro: Essential Travel Items",
                excerpt: "Learn the art of efficient packing with our comprehensive guide to essential travel items and space-saving techniques.",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "tips",
                date: "2024-12-08",
                author: "Mike Chen",
                views: 1923,
                likes: 98,
                comments: 15,
                readTime: "6 min read"
            },
            {
                id: 3,
                title: "The Rich History of Japanese Tea Ceremonies",
                excerpt: "Explore the ancient art of Japanese tea ceremonies and their cultural significance in modern Japan.",
                image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "culture",
                date: "2024-12-05",
                author: "Emma Rodriguez",
                views: 1456,
                likes: 87,
                comments: 12,
                readTime: "10 min read"
            },
            {
                id: 4,
                title: "Street Food Adventures in Southeast Asia",
                excerpt: "Embark on a culinary journey through the vibrant street food scenes of Thailand, Vietnam, and Malaysia.",
                image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "food",
                date: "2024-12-03",
                author: "David Kim",
                views: 2234,
                likes: 134,
                comments: 28,
                readTime: "7 min read"
            },
            {
                id: 5,
                title: "Mountain Climbing Safety: A Complete Guide",
                excerpt: "Essential safety tips and equipment recommendations for mountain climbing enthusiasts of all skill levels.",
                image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "adventure",
                date: "2024-12-01",
                author: "Alex Thompson",
                views: 1678,
                likes: 92,
                comments: 19,
                readTime: "12 min read"
            },
            {
                id: 6,
                title: "Traveling on $50 a Day: Budget Tips",
                excerpt: "Proven strategies for exploring the world without breaking the bank, including accommodation and dining hacks.",
                image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "budget",
                date: "2024-11-28",
                author: "Lisa Wang",
                views: 3124,
                likes: 201,
                comments: 35,
                readTime: "9 min read"
            },
            {
                id: 7,
                title: "Photography Tips for Travelers",
                excerpt: "Capture stunning travel memories with professional photography techniques and equipment recommendations.",
                image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "tips",
                date: "2024-11-25",
                author: "James Wilson",
                views: 1892,
                likes: 118,
                comments: 22,
                readTime: "11 min read"
            },
            {
                id: 8,
                title: "Sustainable Travel: Eco-Friendly Adventures",
                excerpt: "Learn how to travel responsibly and minimize your environmental impact while exploring the world.",
                image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "tips",
                date: "2024-11-22",
                author: "Maria Garcia",
                views: 2156,
                likes: 145,
                comments: 31,
                readTime: "8 min read"
            }
        ];

        this.filteredPosts = [...this.posts];
    }

    displayPosts() {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;

        const postsToShow = this.filteredPosts.slice(0, this.displayedPosts);
        
        postsGrid.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');

        // Update load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            if (this.displayedPosts >= this.filteredPosts.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
    }

    createPostCard(post) {
        const categoryColors = {
            destinations: '#2c5aa0',
            tips: '#28a745',
            culture: '#6f42c1',
            food: '#fd7e14',
            adventure: '#dc3545',
            budget: '#20c997'
        };

        return `
            <div class="post-card" onclick="viewPost(${post.id})">
                <img src="${post.image}" alt="${post.title}">
                <div class="post-card-content">
                    <div class="post-card-meta">
                        <span class="post-card-category" style="background: ${categoryColors[post.category]}20; color: ${categoryColors[post.category]}">
                            ${this.formatCategory(post.category)}
                        </span>
                        <span class="post-card-date">${this.formatDate(post.date)}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="post-card-stats">
                        <span><i class="fas fa-eye"></i> ${post.views.toLocaleString()}</span>
                        <span><i class="fas fa-heart"></i> ${post.likes}</span>
                        <span><i class="fas fa-comment"></i> ${post.comments}</span>
                        <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <a href="#" class="read-more" onclick="event.stopPropagation(); viewPost(${post.id})">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    formatCategory(category) {
        const categoryNames = {
            destinations: 'Destinations',
            tips: 'Travel Tips',
            culture: 'Culture & History',
            food: 'Food & Dining',
            adventure: 'Adventure Travel',
            budget: 'Budget Travel'
        };
        return categoryNames[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.displayedPosts = 6;
        
        if (category === '') {
            this.filteredPosts = [...this.posts];
        } else {
            this.filteredPosts = this.posts.filter(post => post.category === category);
        }
        
        this.sortPosts();
        this.displayPosts();
    }

    filterPosts() {
        const categoryFilter = document.getElementById('category-filter');
        const selectedCategory = categoryFilter.value;
        this.filterByCategory(selectedCategory);
    }

    sortPosts() {
        const sortFilter = document.getElementById('sort-filter');
        this.currentSort = sortFilter.value;

        switch (this.currentSort) {
            case 'newest':
                this.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                this.filteredPosts.sort((a, b) => b.views - a.views);
                break;
            case 'title':
                this.filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        this.displayPosts();
    }

    loadMorePosts() {
        this.displayedPosts += 6;
        this.displayPosts();
    }

    handleNewsletterSignup(e) {
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Store email in localStorage
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        }

        // Show success message
        alert('Thank you for subscribing to our newsletter! You will receive our latest travel guides and tips.');
        e.target.reset();
    }
}

// Global functions
function filterByCategory(category) {
    if (window.blogManager) {
        window.blogManager.filterByCategory(category);
    }
}

function filterPosts() {
    if (window.blogManager) {
        window.blogManager.filterPosts();
    }
}

function sortPosts() {
    if (window.blogManager) {
        window.blogManager.sortPosts();
    }
}

function loadMorePosts() {
    if (window.blogManager) {
        window.blogManager.loadMorePosts();
    }
}

function viewPost(id) {
    // In a real application, this would navigate to a specific blog post
    // For now, we'll show an alert
    alert(`Opening blog post with ID: ${id}\n\nIn a real application, this would navigate to the full article page.`);
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});
