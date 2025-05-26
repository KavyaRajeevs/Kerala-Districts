// Filter functionality for Kerala Districts
class DistrictFilter {
    constructor() {
        this.districts = [];
        this.filteredDistricts = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            sortBy: 'name'
        };
        this.init();
    }

    init() {
        this.extractDistrictData();
        this.setupEventListeners();
        this.createFilterModal();
        this.filteredDistricts = [...this.districts];
    }

    extractDistrictData() {
        const cards = document.querySelectorAll('.card');
        this.districts = Array.from(cards).map(card => {
            const title = card.querySelector('.card-title').textContent.trim();
            const description = card.querySelector('.card-text').textContent.trim();
            const badge = card.querySelector('.badge-explore');
            const icon = card.querySelector('.district-icon').className;
            
            return {
                element: card.closest('.col'),
                name: title,
                description: description,
                category: this.categorizeDistrict(title, description, badge),
                badge: badge ? badge.textContent : null,
                icon: icon,
                searchText: `${title} ${description}`.toLowerCase()
            };
        });
    }

    categorizeDistrict(name, description, badge) {
        const desc = description.toLowerCase();
        const title = name.toLowerCase();
        
        if (badge && badge.textContent === 'Capital City') return 'capital';
        if (badge && badge.textContent === 'Cultural Capital') return 'cultural';
        if (desc.includes('hill') || desc.includes('mountain') || title.includes('wayanad') || title.includes('idukki')) return 'hills';
        if (desc.includes('backwater') || desc.includes('boat') || desc.includes('lake') || desc.includes('port')) return 'backwaters';
        if (desc.includes('beach') || desc.includes('coast') || desc.includes('arabian sea')) return 'coastal';
        if (desc.includes('temple') || desc.includes('spiritual') || desc.includes('sabarimala') || desc.includes('festival')) return 'spiritual';
        if (desc.includes('fort') || desc.includes('historic') || desc.includes('heritage')) return 'historical';
        
        return 'other';
    }

    setupEventListeners() {
        // Search functionality
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Filter button
        const filterBtn = document.querySelector('.btn-filter');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                this.showFilterModal();
            });
        }
    }

    createFilterModal() {
        const modalHTML = `
            <div class="modal fade" id="filterModal" tabindex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="filterModalLabel">
                                <i class="fas fa-sliders-h me-2"></i>Filter Districts
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-4">
                                <label for="categoryFilter" class="form-label fw-bold">Category</label>
                                <select class="form-select" id="categoryFilter">
                                    <option value="all">All Districts</option>
                                    <option value="hills">Hill Stations</option>
                                    <option value="backwaters">Backwaters</option>
                                    <option value="coastal">Coastal Areas</option>
                                    <option value="spiritual">Spiritual Places</option>
                                    <option value="historical">Historical Sites</option>
                                    <option value="cultural">Cultural Centers</option>
                                    <option value="capital">Capital</option>
                                </select>
                            </div>
                            
                            <div class="mb-4">
                                <label for="sortFilter" class="form-label fw-bold">Sort By</label>
                                <select class="form-select" id="sortFilter">
                                    <option value="name">Name (A-Z)</option>
                                    <option value="name-desc">Name (Z-A)</option>
                                    <option value="popular">Popular First</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Quick Filters</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <button type="button" class="btn btn-outline-primary btn-sm quick-filter" data-filter="popular">
                                        <i class="fas fa-star me-1"></i>Popular
                                    </button>
                                    <button type="button" class="btn btn-outline-success btn-sm quick-filter" data-filter="hills">
                                        <i class="fas fa-mountain me-1"></i>Hills
                                    </button>
                                    <button type="button" class="btn btn-outline-info btn-sm quick-filter" data-filter="backwaters">
                                        <i class="fas fa-ship me-1"></i>Backwaters
                                    </button>
                                    <button type="button" class="btn btn-outline-warning btn-sm quick-filter" data-filter="coastal">
                                        <i class="fas fa-water me-1"></i>Coastal
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="clearFilters">
                                <i class="fas fa-times me-1"></i>Clear All
                            </button>
                            <button type="button" class="btn btn-primary" id="applyFilters">
                                <i class="fas fa-check me-1"></i>Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Quick filter buttons
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                document.getElementById('categoryFilter').value = filter;
                this.toggleQuickFilterActive(e.target);
            });
        });

        // Apply filters button
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.currentFilters.category = document.getElementById('categoryFilter').value;
            this.currentFilters.sortBy = document.getElementById('sortFilter').value;
            this.applyFilters();
            bootstrap.Modal.getInstance(document.getElementById('filterModal')).hide();
        });

        // Clear filters button
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearAllFilters();
        });
    }

    toggleQuickFilterActive(button) {
        // Remove active class from all quick filter buttons
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        button.classList.add('active');
    }

    showFilterModal() {
        const modal = new bootstrap.Modal(document.getElementById('filterModal'));
        
        // Set current values
        document.getElementById('categoryFilter').value = this.currentFilters.category;
        document.getElementById('sortFilter').value = this.currentFilters.sortBy;
        
        modal.show();
    }

    applyFilters() {
        this.filteredDistricts = this.districts.filter(district => {
            // Search filter
            if (this.currentFilters.search && 
                !district.searchText.includes(this.currentFilters.search)) {
                return false;
            }

            // Category filter
            if (this.currentFilters.category !== 'all') {
                if (this.currentFilters.category === 'popular') {
                    return district.badge !== null;
                }
                return district.category === this.currentFilters.category;
            }

            return true;
        });

        // Apply sorting
        this.sortDistricts();
        
        // Update display
        this.updateDisplay();
        
        // Update results count
        this.updateResultsCount();
    }

    sortDistricts() {
        switch (this.currentFilters.sortBy) {
            case 'name':
                this.filteredDistricts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredDistricts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'popular':
                this.filteredDistricts.sort((a, b) => {
                    if (a.badge && !b.badge) return -1;
                    if (!a.badge && b.badge) return 1;
                    return a.name.localeCompare(b.name);
                });
                break;
        }
    }

    updateDisplay() {
        const container = document.querySelector('.row.row-cols-1');
        
        // Show all districts first
        this.districts.forEach(district => {
            district.element.style.display = 'none';
        });

        // Show filtered districts
        this.filteredDistricts.forEach(district => {
            district.element.style.display = 'block';
        });

        // Add animation
        this.animateCards();
    }

    animateCards() {
        const visibleCards = document.querySelectorAll('.col:not([style*="display: none"]) .card');
        visibleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    updateResultsCount() {
        let existingCounter = document.querySelector('.results-counter');
        
        if (!existingCounter) {
            existingCounter = document.createElement('div');
            existingCounter.className = 'results-counter alert alert-info d-flex align-items-center mb-4';
            existingCounter.innerHTML = '<i class="fas fa-info-circle me-2"></i><span></span>';
            
            const container = document.querySelector('.districts-container');
            const filterContainer = container.querySelector('.filter-container');
            filterContainer.insertAdjacentElement('afterend', existingCounter);
        }

        const count = this.filteredDistricts.length;
        const total = this.districts.length;
        const counterText = existingCounter.querySelector('span');
        
        if (count === total) {
            existingCounter.style.display = 'none';
        } else {
            existingCounter.style.display = 'flex';
            counterText.textContent = `Showing ${count} of ${total} districts`;
        }
    }

    clearAllFilters() {
        this.currentFilters = {
            search: '',
            category: 'all',
            sortBy: 'name'
        };

        // Clear UI elements
        const searchBox = document.querySelector('.search-box');
        if (searchBox) searchBox.value = '';
        
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('sortFilter').value = 'name';
        
        // Remove active class from quick filters
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.classList.remove('active');
        });

        this.applyFilters();
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
        if (modal) modal.hide();
    }

    // Public method to get current filter state
    getCurrentFilters() {
        return { ...this.currentFilters };
    }

    // Public method to set filters programmatically
    setFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        this.applyFilters();
    }
}

// Initialize the filter system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.districtFilter = new DistrictFilter();
    
    // Add some custom styles for better UX
    const style = document.createElement('style');
    style.textContent = `
        .quick-filter.active {
            background-color: var(--bs-primary) !important;
            color: white !important;
            border-color: var(--bs-primary) !important;
        }
        
        .results-counter {
            border-left: 4px solid var(--bs-info);
        }
        
        .card {
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .search-box:focus {
            border-color: var(--bs-primary);
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        
        @media (max-width: 768px) {
            .filter-container {
                flex-direction: column;
            }
            
            .filter-container .col-md-6 {
                text-align: center !important;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DistrictFilter;
}