// Gallery JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery functionality
    initGalleryFilters();
    initLightbox();
    initLazyLoading();
    initScrollToTop();
    initStatsAnimation();
    initLoadMore();
});

// Gallery Filter Functionality
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });
}

// Lightbox Functionality
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    let images = [];

    // Collect all images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const info = item.querySelector('.gallery-info');
        images.push({
            src: img.src,
            alt: img.alt,
            title: info.querySelector('h3').textContent,
            description: info.querySelector('p').textContent,
            category: info.querySelector('.category-tag').textContent
        });

        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-nav lightbox-prev">&#8249;</button>
                <button class="lightbox-nav lightbox-next">&#8250;</button>
                <img src="${images[currentImageIndex].src}" alt="${images[currentImageIndex].alt}">
                <div class="lightbox-caption">
                    <h3>${images[currentImageIndex].title}</h3>
                    <p>${images[currentImageIndex].description}</p>
                    <span class="category-tag">${images[currentImageIndex].category}</span>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close lightbox events
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Navigation events
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightboxImage(lightbox);
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightboxImage(lightbox);
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);

        function closeLightbox() {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleKeydown);
        }

        function handleKeydown(e) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    updateLightboxImage(lightbox);
                    break;
                case 'ArrowRight':
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    updateLightboxImage(lightbox);
                    break;
            }
        }
    }

    function updateLightboxImage(lightbox) {
        const img = lightbox.querySelector('img');
        const title = lightbox.querySelector('h3');
        const description = lightbox.querySelector('p');
        const category = lightbox.querySelector('.category-tag');

        img.src = images[currentImageIndex].src;
        img.alt = images[currentImageIndex].alt;
        title.textContent = images[currentImageIndex].title;
        description.textContent = images[currentImageIndex].description;
        category.textContent = images[currentImageIndex].category;
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.remove('loaded');
        imageObserver.observe(img);
        
        // Add loaded class when image actually loads
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Stats Animation
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent);
                animateNumber(target, finalNumber);
                statsObserver.unobserve(target);
            }
        });
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateNumber(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 20);
    }
}

// Load More Functionality
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const galleryMasonry = document.getElementById('galleryMasonry');
    let loadedImages = 0;
    const imagesPerLoad = 6;

    // Additional images data for load more functionality
    const additionalImages = [
        {
            src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
            category: 'recording',
            title: 'Studio Monitors',
            description: 'High-quality studio monitors for accurate sound reproduction',
            tag: 'Recording Studio'
        },
        {
            src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
            category: 'jamming',
            title: 'Keyboard Setup',
            description: 'Professional keyboards and synthesizers',
            tag: 'Jamming Room'
        },
        {
            src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
            category: 'gaming',
            title: 'Gaming Chairs',
            description: 'Ergonomic gaming chairs for comfort during long sessions',
            tag: 'Gaming Setup'
        },
        {
            src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
            category: 'cafe',
            title: 'Café Interior',
            description: 'Cozy interior design of our outdoor café',
            tag: 'Outdoor Café'
        },
        {
            src: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600',
            category: 'events',
            title: 'Open Mic Night',
            description: 'Regular open mic nights for local artists',
            tag: 'Events'
        },
        {
            src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
            category: 'recording',
            title: 'Audio Interface',
            description: 'Professional audio interfaces for digital recording',
            tag: 'Recording Studio'
        }
    ];

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreImages();
        });
    }

    function loadMoreImages() {
        const startIndex = loadedImages;
        const endIndex = Math.min(startIndex + imagesPerLoad, additionalImages.length);

        for (let i = startIndex; i < endIndex; i++) {
            const imageData = additionalImages[i];
            const galleryItem = createGalleryItem(imageData);
            galleryMasonry.appendChild(galleryItem);
        }

        loadedImages = endIndex;

        // Hide load more button if all images are loaded
        if (loadedImages >= additionalImages.length) {
            loadMoreBtn.style.display = 'none';
        }

        // Re-initialize lazy loading for new images
        initLazyLoading();
    }

    function createGalleryItem(imageData) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', imageData.category);
        galleryItem.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.title}">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h3>${imageData.title}</h3>
                    <p>${imageData.description}</p>
                    <span class="category-tag">${imageData.tag}</span>
                </div>
            </div>
        `;

        // Add click event for lightbox
        galleryItem.addEventListener('click', () => {
            // Add to images array and open lightbox
            const img = galleryItem.querySelector('img');
            const info = galleryItem.querySelector('.gallery-info');
            const newImage = {
                src: img.src,
                alt: img.alt,
                title: info.querySelector('h3').textContent,
                description: info.querySelector('p').textContent,
                category: info.querySelector('.category-tag').textContent
            };
            
            // This would need to be integrated with the main lightbox system
            console.log('Opening lightbox for:', newImage.title);
        });

        return galleryItem;
    }
}

// Search Functionality (bonus feature)
function initGallerySearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search gallery...';
    searchInput.className = 'gallery-search';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.appendChild(searchInput);
    
    const categoriesSection = document.querySelector('.gallery-categories .container');
    categoriesSection.appendChild(searchContainer);

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const category = item.querySelector('.category-tag').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Add search styles
const searchStyles = `
    .search-container {
        margin-top: 2rem;
        text-align: center;
    }
    
    .gallery-search {
        padding: 0.8rem 1.5rem;
        border: 2px solid #e0e0e0;
        border-radius: 25px;
        font-size: 1rem;
        width: 300px;
        max-width: 100%;
        transition: border-color 0.3s ease;
    }
    
    .gallery-search:focus {
        outline: none;
        border-color: #ff6b6b;
    }
`;

const searchStyleSheet = document.createElement('style');
searchStyleSheet.textContent = searchStyles;
document.head.appendChild(searchStyleSheet);

// Initialize search functionality
// initGallerySearch();

// Masonry Layout Adjustment
function adjustMasonryLayout() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        img.addEventListener('load', () => {
            // Trigger layout recalculation if needed
            item.style.height = 'auto';
        });
    });
}

// Initialize masonry adjustment
adjustMasonryLayout();

// Smooth reveal animation for gallery items
function initRevealAnimation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    });

    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(item);
    });
}

// Initialize reveal animation
initRevealAnimation();

// Touch/Swipe support for mobile lightbox navigation
function initTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            const lightbox = document.querySelector('.lightbox');
            if (lightbox) {
                if (diff > 0) {
                    // Swipe left - next image
                    const nextBtn = lightbox.querySelector('.lightbox-next');
                    if (nextBtn) nextBtn.click();
                } else {
                    // Swipe right - previous image
                    const prevBtn = lightbox.querySelector('.lightbox-prev');
                    if (prevBtn) prevBtn.click();
                }
            }
        }
    }
}

// Initialize touch support
initTouchSupport();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Any scroll-based functionality can be added here
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);