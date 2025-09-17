// Product Page JavaScript Functionality

// Global modal instance
let customerFormModal = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Product page DOM loaded, initializing...');
    // Initialize modal first
    initModal();
    // Initialize product page functionality
    initProductImageCarousel();
    initProductActions();
    initRelatedProducts();
    initCustomerForm();
    console.log('Product page initialization complete');
});

// Initialize Modal
function initModal() {
    const customerFormModalElement = document.getElementById('customerFormModal');
    
    if (!customerFormModalElement) {
        console.error('Customer form modal element not found');
        return;
    }
    
    console.log('Initializing modal...');
    customerFormModal = new bootstrap.Modal(customerFormModalElement);
    
    // Ensure close buttons work properly
    const closeButtons = customerFormModalElement.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Close button clicked');
            customerFormModal.hide();
        });
    });
    
    // Also add click listeners for any buttons with class 'btn-close'
    const closeButtonsByClass = customerFormModalElement.querySelectorAll('.btn-close');
    closeButtonsByClass.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('X button clicked');
            customerFormModal.hide();
        });
    });
    
    // Add click listener for Cancel button
    const cancelButton = customerFormModalElement.querySelector('.btn-secondary[data-bs-dismiss="modal"]');
    if (cancelButton) {
        cancelButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cancel button clicked');
            customerFormModal.hide();
        });
    }
    
    // Handle modal close events
    customerFormModalElement.addEventListener('hidden.bs.modal', function() {
        console.log('Modal closed');
        // Reset form when modal is closed
        const customerForm = document.getElementById('customerForm');
        if (customerForm) {
            customerForm.reset();
            // Clear validation states
            const formInputs = customerForm.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            // Remove error messages
            const errorMessages = customerForm.querySelectorAll('.invalid-feedback');
            errorMessages.forEach(error => error.remove());
        }
    });
    
    // Handle backdrop click to close modal
    customerFormModalElement.addEventListener('click', function(e) {
        if (e.target === customerFormModalElement) {
            console.log('Backdrop clicked, closing modal');
            customerFormModal.hide();
        }
    });
    
    console.log('Modal initialized successfully');
}

// Product Image Carousel
function initProductImageCarousel() {
    const images = document.querySelectorAll('.product-image-item');
    const dots = document.querySelectorAll('.dot');
    
    // If no carousel elements exist, skip carousel initialization
    if (images.length === 0) {
        console.log('No carousel elements found, skipping carousel initialization');
        return;
    }
    
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
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }

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
    if (carousel) {
        carousel.addEventListener('mouseenter', stopSlideShow);
        carousel.addEventListener('mouseleave', startSlideShow);
    }
}


// Product Actions
function initProductActions() {
    const addToCartBtn = document.getElementById('addToCart');
    const buyNowBtn = document.getElementById('buyNow');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = document.getElementById('quantity') ? document.getElementById('quantity').value : 1;
            addToCart(quantity);
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            console.log('Buy Now button clicked');
            const quantity = document.getElementById('quantity') ? document.getElementById('quantity').value : 1;
            updateOrderSummary(quantity);
            if (customerFormModal) {
                customerFormModal.show();
            } else {
                console.error('Modal not initialized');
            }
        });
    }

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
    // Only apply loading animation to images that are not in product containers
    // or are part of carousel items
    if (!img.closest('.product-image-container') || img.classList.contains('product-image-item')) {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity only for carousel images
        if (img.classList.contains('product-image-item')) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    }
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
    
    // Check if elements exist
    if (!customerForm || !proceedToPaymentBtn) {
        console.error('Customer form elements not found:', {
            customerForm: !!customerForm,
            proceedToPaymentBtn: !!proceedToPaymentBtn
        });
        return;
    }
    
    console.log('Customer form elements found, setting up form...');
    

    // Form validation - only handle button click to avoid duplicate submissions
    proceedToPaymentBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission
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

    async function processOrder() {
        const formData = new FormData(customerForm);
        const orderData = {
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            email: formData.get('email'),
            phone: formData.get('phone'),
            product: 'Gaming PC Pro',
            quantity: parseInt(document.getElementById('summaryQuantity').textContent),
            message: `Address: ${formData.get('address')}, ${formData.get('city')}, ${formData.get('state')} ${formData.get('zipCode')}, ${formData.get('province')}\nPayment Method: ${formData.get('paymentMethod')}\nSpecial Instructions: ${formData.get('specialInstructions') || 'None'}\nNewsletter: ${formData.get('newsletter') === 'on' ? 'Yes' : 'No'}`
        };

        // Show processing state
        proceedToPaymentBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
        proceedToPaymentBtn.disabled = true;

        try {
            // Check if API utilities are available
            if (typeof APIUtils === 'undefined') {
                throw new Error('API utilities not loaded. Please make sure api.js is included.');
            }

            // Check backend status first
            const status = await APIUtils.getConnectionStatus();
            if (!status.backend) {
                throw new Error('Backend server is not available. Please make sure the backend is running.');
            }

            if (!status.whatsapp) {
                showNotification('WhatsApp service is not ready. Your inquiry will be processed when available.', 'warning');
            }

            // Submit the form using API utility
            const result = await APIUtils.submitProductInquiry(orderData);

            if (result.success) {
                // Show success message
                showNotification('Order submitted successfully! Our team has been notified and will contact you soon.', 'success');
                
                // Close modal and reset form
                if (customerFormModal) {
                    customerFormModal.hide();
                }
                customerForm.reset();
                
                // Clear validation states
                const formInputs = customerForm.querySelectorAll('input, select, textarea');
                formInputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
                
                // Remove error messages
                const errorMessages = customerForm.querySelectorAll('.invalid-feedback');
                errorMessages.forEach(error => error.remove());
            } else {
                // Show error message
                showNotification(result.error || 'Failed to submit order. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            showNotification(error.message || 'Network error. Please check your connection and try again.', 'error');
        } finally {
            // Reset button
            proceedToPaymentBtn.innerHTML = '<i class="bi bi-credit-card me-2"></i>Proceed to Payment';
            proceedToPaymentBtn.disabled = false;
        }
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initCustomerForm();
});
