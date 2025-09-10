// Product Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Product page DOM loaded, initializing...');
    // Initialize product page functionality
    initProductImageCarousel();
    initQuantityControls();
    initProductActions();
    initRelatedProducts();
    initCustomerForm();
    console.log('Product page initialization complete');
});

// Product Image Carousel
function initProductImageCarousel() {
    const images = document.querySelectorAll('.product-image-item');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    // Auto-rotate images every 4 seconds
    function startSlideShow() {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    function showSlide(index) {
        // Hide all images
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current image
        images[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % images.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + images.length) % images.length;
        showSlide(prevIndex);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideShow();
            startSlideShow(); // Restart auto-rotation
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopSlideShow();
            startSlideShow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopSlideShow();
            startSlideShow();
        }
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    const carousel = document.querySelector('.product-image-carousel');
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            stopSlideShow();
            startSlideShow();
        }
    }

    // Start the slideshow
    startSlideShow();

    // Pause on hover
    carousel.addEventListener('mouseenter', stopSlideShow);
    carousel.addEventListener('mouseleave', startSlideShow);
}

// Quantity Controls
function initQuantityControls() {
    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');
    const quantityInput = document.getElementById('quantity');

    decreaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateQuantityDisplay();
        }
    });

    increaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
            updateQuantityDisplay();
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (value < 1) quantityInput.value = 1;
        if (value > 10) quantityInput.value = 10;
        updateQuantityDisplay();
    });

    function updateQuantityDisplay() {
        // Add visual feedback for quantity change
        quantityInput.style.transform = 'scale(1.1)';
        setTimeout(() => {
            quantityInput.style.transform = 'scale(1)';
        }, 150);
    }
}

// Product Actions
function initProductActions() {
    const addToCartBtn = document.getElementById('addToCart');
    const buyNowBtn = document.getElementById('buyNow');
    const customerFormModal = new bootstrap.Modal(document.getElementById('customerFormModal'));

    addToCartBtn.addEventListener('click', () => {
        const quantity = document.getElementById('quantity').value;
        addToCart(quantity);
    });

    buyNowBtn.addEventListener('click', () => {
        console.log('Buy Now button clicked');
        alert('Buy Now button clicked!'); // Temporary test
        const quantity = document.getElementById('quantity').value;
        updateOrderSummary(quantity);
        customerFormModal.show();
    });

    function addToCart(quantity) {
        // Add visual feedback
        addToCartBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Added to Cart!';
        addToCartBtn.classList.remove('btn-neo');
        addToCartBtn.classList.add('btn-success');
        
        // Show success message
        showNotification('Product added to cart successfully!', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            addToCartBtn.innerHTML = '<i class="bi bi-cart-plus me-2"></i>Add to Cart';
            addToCartBtn.classList.remove('btn-success');
            addToCartBtn.classList.add('btn-neo');
        }, 2000);

        // Here you would typically send data to your backend
        console.log(`Added ${quantity} Gaming PC(s) to cart`);
    }

    function updateOrderSummary(quantity) {
        const unitPrice = 1299;
        const totalPrice = unitPrice * quantity;
        
        document.getElementById('summaryQuantity').textContent = quantity;
        document.getElementById('summaryPrice').textContent = `$${totalPrice.toFixed(2)}`;
        document.getElementById('summaryTotal').textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Related Products
function initRelatedProducts() {
    const relatedCards = document.querySelectorAll('.related-product-card');
    
    relatedCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add click animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
            
            // Here you would typically navigate to the product page
            const productName = card.querySelector('h4').textContent;
            console.log(`Clicked on ${productName}`);
            
            // Show notification
            showNotification(`Viewing ${productName}...`, 'info');
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--dark-secondary);
        color: var(--text-light);
        padding: 15px 20px;
        border-radius: 10px;
        border-left: 4px solid var(--neo-green);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle-fill',
        error: 'exclamation-triangle-fill',
        info: 'info-circle-fill',
        warning: 'exclamation-circle-fill'
    };
    return icons[type] || 'info-circle-fill';
}

// Smooth scrolling for anchor links
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

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    // Set initial opacity
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});

// Add scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.spec-item, .related-product-card, .product-features-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Customer Form Functionality
function initCustomerForm() {
    console.log('Initializing customer form...');
    const customerForm = document.getElementById('customerForm');
    const proceedToPaymentBtn = document.getElementById('proceedToPayment');
    const customerFormModalElement = document.getElementById('customerFormModal');
    
    // Check if elements exist
    if (!customerForm || !proceedToPaymentBtn || !customerFormModalElement) {
        console.error('Customer form elements not found:', {
            customerForm: !!customerForm,
            proceedToPaymentBtn: !!proceedToPaymentBtn,
            customerFormModalElement: !!customerFormModalElement
        });
        return;
    }
    
    console.log('Customer form elements found, creating modal...');
    const customerFormModal = new bootstrap.Modal(customerFormModalElement);
    
    // Test modal creation
    console.log('Modal created:', customerFormModal);
    
    // Add a test button to manually show the modal
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Modal';
    testButton.className = 'btn btn-warning mt-2';
    testButton.onclick = () => {
        console.log('Test button clicked, showing modal...');
        customerFormModal.show();
    };
    document.querySelector('.product-actions').appendChild(testButton);

    // Form validation
    customerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            processOrder();
        }
    });

    proceedToPaymentBtn.addEventListener('click', function() {
        if (validateForm()) {
            processOrder();
        }
    });

    // Real-time validation
    const formInputs = customerForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = customerForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for terms agreement
        const termsCheckbox = document.getElementById('termsAgreement');
        if (!termsCheckbox.checked) {
            showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
            isValid = false;
        } else {
            clearFieldError(termsCheckbox);
        }

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${getFieldLabel(field)} is required`;
            isValid = false;
        }
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Phone validation
        else if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }
        // ZIP code validation
        else if (fieldName === 'zipCode' && value) {
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(value)) {
                errorMessage = 'Please enter a valid ZIP code';
                isValid = false;
            }
        }

        if (isValid) {
            clearFieldError(field);
        } else {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    function processOrder() {
        const formData = new FormData(customerForm);
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country'),
                paymentMethod: formData.get('paymentMethod'),
                specialInstructions: formData.get('specialInstructions'),
                newsletter: formData.get('newsletter') === 'on'
            },
            product: {
                name: 'Gaming PC Pro',
                quantity: parseInt(document.getElementById('summaryQuantity').textContent),
                unitPrice: 1299,
                totalPrice: parseFloat(document.getElementById('summaryTotal').textContent.replace('$', ''))
            }
        };

        // Show processing state
        proceedToPaymentBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
        proceedToPaymentBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Here you would typically send the data to your backend
            console.log('Order Data:', orderData);
            
            // Show success message
            showNotification('Order processed successfully! Redirecting to payment...', 'success');
            
            // Close modal and reset form
            customerFormModal.hide();
            customerForm.reset();
            
            // Reset button
            proceedToPaymentBtn.innerHTML = '<i class="bi bi-credit-card me-2"></i>Proceed to Payment';
            proceedToPaymentBtn.disabled = false;
            
            // Clear validation states
            const formInputs = customerForm.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Remove error messages
            const errorMessages = customerForm.querySelectorAll('.invalid-feedback');
            errorMessages.forEach(error => error.remove());
            
        }, 2000);
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initCustomerForm();
});
