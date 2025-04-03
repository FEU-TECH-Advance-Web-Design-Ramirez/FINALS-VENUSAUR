document.addEventListener('DOMContentLoaded', function() {
    // MOBILE NAVIGATION
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('is-active');
        mobileNav.classList.toggle('is-active');
        
        // Update aria-expanded attribute
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });

    // CART FUNCTIONALITY
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Load cart from localStorage or initialize an empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // Initialize cart count and total
    cartTotal.textContent = `₱${total.toFixed(2)}`;
    cartCount.textContent = cart.length;
    updateCartDisplay();

    // Toggle cart visibility when the cart icon is clicked
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.add('active');
    });

    // Close cart when the close button is clicked
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPriceText = productCard.querySelector('.product-price').textContent.trim();
            const productPrice = parseFloat(productPriceText.replace('₱', '').replace(',', ''));
            const productImg = productCard.querySelector('img').src;

            // Ensure the price is valid
            if (isNaN(productPrice)) {
                console.error(`Invalid price for ${productName}: ${productPriceText}`);
                return; // Exit if the price is invalid
            }

            // Add item to cart
            cart.push({
                name: productName,
                price: productPrice,
                img: productImg
            });

            // Update total
            total += productPrice;
            cartTotal.textContent = `₱${total.toFixed(2)}`;
            cartCount.textContent = cart.length;

            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Update cart items display
            updateCartDisplay();

            // Show cart
            cartSidebar.classList.add('active');
        });
    });

    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            return;
        }

        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₱${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add remove functionality
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }

    // Remove item from cart
    function removeFromCart(index) {
        // Remove item from the cart array
        const removedItem = cart.splice(index, 1)[0]; // Remove the item at the given index

        // Update the total
        total -= removedItem.price;
        cartTotal.textContent = `₱${total.toFixed(2)}`;
        cartCount.textContent = cart.length;

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart display
        updateCartDisplay();
    }

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert(`Thank you for your order! Total: ₱${total.toFixed(2)}\nThis is a demo - no actual purchase will be made.`);

        // Reset cart
        cart = [];
        total = 0;
        cartTotal.textContent = '₱0.00';
        cartCount.textContent = '0';

        // Save empty cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartDisplay();
        cartSidebar.classList.remove('active');
    });
});
