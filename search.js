// Kerala Districts Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get search input element
    const searchBox = document.querySelector('.search-box');
    const districtCards = document.querySelectorAll('.col');
    const noResultsMessage = createNoResultsMessage();
    
    // Create no results message element
    function createNoResultsMessage() {
        const message = document.createElement('div');
        message.className = 'col-12 text-center py-5';
        message.id = 'no-results';
        message.style.display = 'none';
        message.innerHTML = `
            <div class="text-muted">
                <i class="fas fa-search fa-3x mb-3" style="opacity: 0.3;"></i>
                <h4>No districts found</h4>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        
        // Insert the message after the last card
        const cardsContainer = document.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-3');
        cardsContainer.appendChild(message);
        
        return message;
    }
    
    // Search functionality
    function performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        let visibleCards = 0;
        
        districtCards.forEach(card => {
            // Skip the no-results message element
            if (card.id === 'no-results') return;
            
            const cardTitle = card.querySelector('.card-title');
            const cardText = card.querySelector('.card-text');
            
            if (cardTitle && cardText) {
                const title = cardTitle.textContent.toLowerCase();
                const description = cardText.textContent.toLowerCase();
                
                // Check if search term matches district name or description
                if (title.includes(term) || description.includes(term)) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.3s ease-in';
                    visibleCards++;
                } else {
                    card.style.display = 'none';
                }
            }
        });
        
        // Show/hide no results message
        if (visibleCards === 0 && term !== '') {
            noResultsMessage.style.display = '';
            noResultsMessage.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            noResultsMessage.style.display = 'none';
        }
        
        // Update results counter in placeholder (optional enhancement)
        updateSearchPlaceholder(visibleCards, term);
    }
    
    // Update search placeholder with results count
    function updateSearchPlaceholder(count, term) {
        if (term === '') {
            searchBox.placeholder = 'Search districts...';
        } else {
            searchBox.placeholder = `Found ${count} district${count !== 1 ? 's' : ''}`;
        }
    }
    
    // Add search event listeners
    if (searchBox) {
        // Real-time search as user types
        searchBox.addEventListener('input', function(e) {
            performSearch(e.target.value);
        });
        
        // Clear search on ESC key
        searchBox.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.target.value = '';
                performSearch('');
                e.target.blur();
            }
        });
        
        // Focus enhancement
        searchBox.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.style.boxShadow = '0 0 0 0.2rem rgba(8, 143, 143, 0.25)';
        });
        
        searchBox.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
        });
    }
    
    // Add CSS animations for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .search-box:focus {
            outline: none;
            transition: all 0.3s ease;
        }
        
        .col {
            transition: all 0.3s ease;
        }
        
        /* Highlight search terms (optional enhancement) */
        .highlight {
            background-color: rgba(255, 209, 102, 0.3);
            padding: 1px 2px;
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Enhanced search with highlighting (optional)
    function highlightSearchTerm(text, term) {
        if (!term) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    
    // Add search suggestions (optional enhancement)
    const searchSuggestions = [
        'Wayanad', 'Kochi', 'Kollam', 'Alappuzha', 'Kottayam', 'Idukki',
        'Thiruvananthapuram', 'Pathanamthitta', 'Kozhikode', 'Kannur',
        'Kasaragod', 'Thrissur', 'Palakkad', 'Malappuram',
        'backwater', 'hill station', 'beach', 'cultural', 'temple', 'fort'
    ];
    
    // Simple autocomplete functionality
    function addAutocomplete() {
        const datalist = document.createElement('datalist');
        datalist.id = 'district-suggestions';
        
        searchSuggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            datalist.appendChild(option);
        });
        
        document.body.appendChild(datalist);
        searchBox.setAttribute('list', 'district-suggestions');
    }
    
    // Initialize autocomplete
    addAutocomplete();
    
    // Console log for debugging
    console.log('Kerala Districts Search functionality loaded successfully!');
    console.log(`Found ${districtCards.length - 1} district cards`); // -1 for no-results element
});