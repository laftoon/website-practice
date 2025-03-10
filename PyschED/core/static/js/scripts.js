// Config
const CONFIG = {
    CAROUSEL: {
        TRANSITION_TIME: 300, // Reduced from 500ms
        GAP: 16
    }
};


// DOM Selectors using a dedicated service
class DOMService {
    static getElement(selector) {
        return document.querySelector(selector);
    }
    
    static getElements(selector) {
        return document.querySelectorAll(selector);
    }
}

// Mobile Menu Module
class MobileMenu {
    constructor() {
        this.toggle = DOMService.getElement('.mobile-menu-toggle');
        this.menu = DOMService.getElement('.nav-menu');
        this.navLinks = DOMService.getElements('.nav-menu a');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;
        this.bindEvents();
    }

    bindEvents() {
        this.toggle.addEventListener('click', (e) => this.handleToggleClick(e));
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    handleToggleClick(e) {
        e.stopPropagation();
        this.toggleMenu();
    }

    handleOutsideClick(e) {
        if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
            this.closeMenu();
        }
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
    }
}

// Carousel Module
class Carousel {
    constructor() {
        this.track = document.querySelector('.carousel__track');
        this.prevButton = document.querySelector('.carousel__nav--prev');
        this.nextButton = document.querySelector('.carousel__nav--next');
        this.cards = document.querySelectorAll('.flip-card');
        
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        if (!this.track || !this.cards.length) return;
        
        // Add event listeners
        this.prevButton?.addEventListener('click', () => this.navigate('prev'));
        this.nextButton?.addEventListener('click', () => this.navigate('next'));
        
        // Add transition end listener
        this.track.addEventListener('transitionend', () => {
            this.isAnimating = false;
        });

        // Initial navigation update
        this.updateNavigation();
    }

    navigate(direction) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const increment = direction === 'prev' ? -1 : 1;
        const newIndex = this.currentIndex + increment;
        
        this.moveToIndex(newIndex);
    }

    moveToIndex(index) {
        const maxIndex = this.getMaxIndex();
        const boundedIndex = Math.max(0, Math.min(index, maxIndex));
        
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 16; // Match the CSS gap value
        const translateX = -(cardWidth + gap) * boundedIndex;
        
        this.track.style.transform = `translate3d(${translateX}px, 0, 0)`;
        this.currentIndex = boundedIndex;
        
        this.updateNavigation();
    }

    getMaxIndex() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 16;
        const visibleCards = Math.floor(containerWidth / (cardWidth + gap));
        return Math.max(0, this.cards.length - visibleCards);
    }

    updateNavigation() {
        const maxIndex = this.getMaxIndex();
        
        if (this.prevButton) {
            this.prevButton.style.display = this.currentIndex === 0 ? 'none' : 'flex';
        }
        if (this.nextButton) {
            this.nextButton.style.display = this.currentIndex >= maxIndex ? 'none' : 'flex';
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const contact = document.querySelector('.contact');
    const successMessage = contact.querySelector('.success-message');
    const loaderContainer = contact.querySelector('.loader-container');
    const formContent = form.querySelector('.form-content');

    if (!form || !successMessage || !loaderContainer) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loader
        loaderContainer.style.display = 'flex';
        setTimeout(() => {
            loaderContainer.style.opacity = '1';
        }, 50);

        try {
            const formData = new FormData(form);
            const response = await fetch('', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                }
            });

            if (response.ok) {
                // Hide loader and show success message
                loaderContainer.style.opacity = '0';
                
                setTimeout(() => {
                    loaderContainer.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Small delay to ensure display: block has taken effect
                    requestAnimationFrame(() => {
                        successMessage.style.opacity = '1';
                    });

                    // Hide success message and reset form after delay
                    setTimeout(() => {
                        successMessage.style.opacity = '0';
                        
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                            form.reset();
                        }, 300); // Match the transition duration
                    }, 3000);
                }, 300); // Match the transition duration
            }
        } catch (error) {
            console.error('Error:', error);
            // Hide loader on error
            loaderContainer.style.opacity = '0';
            setTimeout(() => {
                loaderContainer.style.display = 'none';
            }, 300);
        }
    });
});


