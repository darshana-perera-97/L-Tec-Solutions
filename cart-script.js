// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.displayCartItems();
        this.updateCartCount();
        this.bindEvents();
    }

    loadCart() {
        const cartData = localStorage.getItem('ltec_cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    saveCart() {
        localStorage.setItem('ltec_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.displayCartItems();
        this.showCartNotification();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.displayCartItems();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.displayCartItems();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.displayCartItems();
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = this.getCartCount();
        }
    }

    displayCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartElement = document.getElementById('emptyCart');
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartElement.style.display = 'block';
            document.getElementById('buyNowBtn').disabled = true;
            return;
        }

        emptyCartElement.style.display = 'none';
        document.getElementById('buyNowBtn').disabled = false;

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item mb-3">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px;">
                            </div>
                            <div class="col-md-4">
                                <h5 class="card-title mb-1">${item.name}</h5>
                                <p class="text-muted mb-0">Product ID: ${item.id}</p>
                            </div>
                            <div class="col-md-2">
                                <div class="quantity-controls d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                    <input type="number" class="form-control form-control-sm mx-2" value="${item.quantity}" min="1" max="10" 
                                           onchange="cartManager.updateQuantity('${item.id}', parseInt(this.value))" style="width: 60px;">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <span class="fw-bold">Rs. ${item.price.toLocaleString()}</span>
                            </div>
                            <div class="col-md-2">
                                <span class="fw-bold text-primary">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-12 text-end">
                                <button class="btn btn-sm btn-outline-danger" onclick="cartManager.removeFromCart('${item.id}')">
                                    <i class="fas fa-trash me-1"></i>Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateOrderSummary();
    }

    updateOrderSummary() {
        const subtotal = this.getCartTotal();
        const tax = subtotal * 0.15; // 15% tax
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
        document.getElementById('tax').textContent = `Rs. ${tax.toLocaleString()}`;
        document.getElementById('total').textContent = `Rs. ${total.toLocaleString()}`;
    }

    showCartNotification() {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed';
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = '<i class="fas fa-check-circle me-2"></i>Item added to cart!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    bindEvents() {
        // Buy Now button
        document.getElementById('buyNowBtn').addEventListener('click', () => {
            if (this.cart.length > 0) {
                const modal = new bootstrap.Modal(document.getElementById('customerFormModal'));
                modal.show();
            }
        });

        // Submit order button
        document.getElementById('submitOrderBtn').addEventListener('click', () => {
            this.submitOrder();
        });

        // Phone number input restriction
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    }

    async submitOrder() {
        const form = document.getElementById('customerForm');
        const formData = new FormData(form);
        
        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const customerData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            requirements: document.getElementById('requirements').value
        };

        // Prepare order summary
        const orderSummary = this.cart.map(item => 
            `${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`
        ).join('\n');

        const subtotal = this.getCartTotal();
        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        const orderMessage = `🛒 *New Order from L-Tec Solutions Website*

👤 *Customer Details:*
Name: ${customerData.firstName} ${customerData.lastName}
Email: ${customerData.email}
Phone: ${customerData.phone}
Address: ${customerData.address}
City: ${customerData.city}
Postal Code: ${customerData.postalCode}

📦 *Order Items:*
${orderSummary}

💰 *Order Summary:*
Subtotal: Rs. ${subtotal.toLocaleString()}
Tax (15%): Rs. ${tax.toLocaleString()}
Total: Rs. ${total.toLocaleString()}

📝 *Additional Requirements:*
${customerData.requirements || 'None'}

---
Order placed on: ${new Date().toLocaleString()}`;

        try {
            // Send to WhatsApp
            await sendToWhatsApp(orderMessage);
            
            // Clear cart after successful order
            this.clearCart();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('customerFormModal'));
            modal.hide();
            
            // Show success message
            alert('Order sent successfully! We will contact you soon.');
            
        } catch (error) {
            console.error('Error sending order:', error);
            alert('Error sending order. Please try again or contact us directly.');
        }
    }
}

// Initialize cart manager when DOM is loaded
let cartManager;
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
});

// Global functions for cart operations
function addToCart(productId, productName, productPrice, productImage) {
    if (cartManager) {
        cartManager.addToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        });
    }
}

function removeFromCart(productId) {
    if (cartManager) {
        cartManager.removeFromCart(productId);
    }
}

function updateQuantity(productId, newQuantity) {
    if (cartManager) {
        cartManager.updateQuantity(productId, newQuantity);
    }
}
