document.addEventListener('DOMContentLoaded', function() {
    // MOBILE NAVIGATION
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('is-active');
            mobileNav.classList.toggle('is-active');
            
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // CART FUNCTIONALITY
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Initialize cart with proper error handling
    let cart = [];
    let total = 0;
    
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            cart = JSON.parse(cartData);
            // Validate each item in the cart
            cart = cart.filter(item => item && typeof item.price === 'number' && !isNaN(item.price));
            total = cart.reduce((sum, item) => sum + item.price, 0);
        }
    } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        localStorage.removeItem('cart');
    }

    // Helper function to format price
    const formatPrice = (price) => {
        return `₱${parseFloat(price).toFixed(2)}`;
    };

    // Update cart display
    const updateCartDisplay = () => {
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            return;
        }

        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            if (!item || typeof item.price !== 'number') return;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.img || ''}" alt="${item.name || 'Product'}">
                <div class="cart-item-details">
                    <h4>${item.name || 'Unnamed Product'}</h4>
                    <p>${formatPrice(item.price)}</p>
                </div>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (!isNaN(index)) removeFromCart(index);
            });
        });
    };

    // Update cart total
    const updateCartTotal = () => {
        if (cartTotal) cartTotal.textContent = formatPrice(total);
        if (cartCount) cartCount.textContent = cart.length;
    };

    // Save cart to localStorage
    const saveCart = () => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    };

    // Remove item from cart
    const removeFromCart = (index) => {
        if (index < 0 || index >= cart.length) return;
        
        const removedItem = cart.splice(index, 1)[0];
        if (removedItem && typeof removedItem.price === 'number') {
            total -= removedItem.price;
        }
        
        updateCartTotal();
        saveCart();
        updateCartDisplay();
    };

    // Initialize cart display
    updateCartTotal();
    updateCartDisplay();

    // Event listeners
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }

    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }

    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                if (!productCard) return;
                
                const productName = productCard.querySelector('h3')?.textContent || 'Unnamed Product';
                const productPriceText = productCard.querySelector('.product-price')?.textContent?.trim() || '0';
                const productPrice = parseFloat(productPriceText.replace(/[^\d.]/g, ''));
                const productImg = productCard.querySelector('img')?.src || '';

                if (isNaN(productPrice)) {
                    console.error(`Invalid price for ${productName}: ${productPriceText}`);
                    return;
                }

                cart.push({
                    name: productName,
                    price: productPrice,
                    img: productImg
                });

                total += productPrice;
                updateCartTotal();
                saveCart();
                updateCartDisplay();
                
                if (cartSidebar) cartSidebar.classList.add('active');
            });
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert(`Thank you for your order! Total: ${formatPrice(total)}\nThis is a demo - no actual purchase will be made.`);
            
            cart = [];
            total = 0;
            updateCartTotal();
            saveCart();
            updateCartDisplay();
            
            if (cartSidebar) cartSidebar.classList.remove('active');
        });
    }
});