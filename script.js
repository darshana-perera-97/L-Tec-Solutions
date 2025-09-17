// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('L-Tec Solutions website loaded successfully');
    
    // Animate statistics numbers
    animateCounters();
    
    // Initialize hero image carousel
    initHeroImageCarousel();
    
    // Initialize products tabs
    initProductsTabs();
    
    // Initialize cart count
    updateCartCount();
});

// Function to update cart count in navbar
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('ltec_cart') || '[]');
        const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Function to animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach((counter, index) => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent; // Keep original text with + symbol
            }
        };
        
        // Start animation with delay
        setTimeout(() => {
            updateCounter();
        }, 200 + (index * 200)); // Staggered delay
    });
}

// Function to initialize hero image carousel
function initHeroImageCarousel() {
    const carousel = document.getElementById('heroImageCarousel');
    const items = carousel.querySelectorAll('.hero-image-item');
    let currentIndex = 0;
    let intervalId;

    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all items
        items.forEach(item => item.classList.remove('active'));
        
        // Add active class to current item
        items[index].classList.add('active');
        
        currentIndex = index;
    }

    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % items.length;
        showSlide(nextIndex);
    }

    // Function to start auto-play
    function startAutoPlay() {
        intervalId = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    // Function to stop auto-play
    function stopAutoPlay() {
        clearInterval(intervalId);
    }

    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Start auto-play
    startAutoPlay();
}

// Function to initialize products tabs
function initProductsTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'var(--dark-bg)';
        navbar.style.backdropFilter = 'none';
    }
});

// Add hover effects to logo items
document.querySelectorAll('.logo-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--highlight-green)';
        this.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.5)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--neo-green)';
        this.style.boxShadow = 'none';
    });
});

// Pause logo carousel on hover
const logoCarousel = document.querySelector('.logo-carousel');
if (logoCarousel) {
    logoCarousel.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    logoCarousel.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}
