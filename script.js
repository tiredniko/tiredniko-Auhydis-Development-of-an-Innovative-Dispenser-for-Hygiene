// script.js - Enhanced for product identifiers and cart clearing (v3)

let cart = []; // Initialize cart

// Function to hide top bar on scroll
window.onscroll = function () {
    const topBar = document.getElementById('top-bar');
    if (!topBar) return;
    if (window.scrollY > 100) {
        topBar.style.display = 'none';
    } else {
        topBar.style.display = 'flex';
    }
};

function updateQuantity(productIdentifier, change) {
    const display = document.getElementById(`${productIdentifier}-quantity-display`);
    const productCard = document.getElementById(`product-${productIdentifier}`);
    if (!display || (productCard && productCard.classList.contains('unavailable'))) {
        return; // Do nothing if product is unavailable or display not found
    }

    let currentQuantity = parseInt(display.textContent, 10);
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    display.textContent = currentQuantity;
}

function getQuantity(productIdentifier) {
    const display = document.getElementById(`${productIdentifier}-quantity-display`);
    if (!display) return 1;
    return parseInt(display.textContent, 10);
}

// Modified addToCart to include a productId (which will map to motor1, motor2, etc.)
// For vending machine, we'll enforce only one type of item in the cart at a time.
function addToCart(productName, price, quantity, productId) {
    console.log(`Attempting to add to cart: ${productName}, Price: ${price}, Quantity: ${quantity}, ProductID/Motor: ${productId}`);
    
    // Clear the cart and add the new item. This enforces one item type per transaction.
    cart = [{ productName, price, quantity, productId }];
    console.log(`${productName} (ID: ${productId}) added to cart, replacing previous items.`);
    
    saveCart();
    displayCart(); // Update cart display on the current page (e.g., machine1.html)
    alert(`${productName} has been added to your cart.`); // User feedback
}

function saveCart() {
    console.log('Saving cart:', cart);
    localStorage.setItem('auhydisCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('auhydisCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Loaded cart:', cart);
    } else {
        cart = []; // Ensure cart is an empty array if nothing in localStorage
    }
    displayCart(); // Always try to display, even if empty
}

function displayCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartItemsElement || !totalPriceElement) {
        // These elements might not exist on all pages (e.g., index.html)
        return; 
    }

    cartItemsElement.innerHTML = ''; // Clear previous items
    let total = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.productName} - ${item.quantity} pcs - ₱${(item.price * item.quantity).toFixed(2)}`;
            
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-item';
            removeButton.onclick = () => removeFromCart(item.productId); 
            li.appendChild(removeButton);

            cartItemsElement.appendChild(li);
            total += item.price * item.quantity;
        });
        totalPriceElement.textContent = `Total: ₱${total.toFixed(2)}`;
    } else {
        cartItemsElement.innerHTML = '<li>Your cart is empty.</li>';
        totalPriceElement.textContent = 'Total: ₱0.00';
    }
}

// removeFromCart now effectively clears the cart since we only allow one item type.
// If you later allow multiple distinct items, this would need to filter by productId.
function removeFromCart(productIdToRemove) { 
    console.log(`Removing item from cart (effectively clearing for single item type). Product ID was: ${productIdToRemove}`);
    cart = []; // Clear the cart
    saveCart();
    displayCart();
}

// Function to clear the entire cart, e.g., after successful dispense
// This is now also called from checkout.html after a successful dispense signal
function clearCartAndStorage() {
    console.log("Clearing cart and localStorage.");
    cart = [];
    localStorage.removeItem('auhydisCart'); // More explicit removal
    displayCart(); // Update display on current page if cart elements exist
    
    // If on checkout page, also clear its specific display if it's separate
    // (checkout.html's embedded script now handles its own display update after clearing)
}


function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add an item to proceed.");
        return;
    }
    // The cart is already saved in localStorage by addToCart.
    // The checkout.html page will load it from localStorage.
    window.location.href = 'checkout.html';
}


// Load cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    // Event listeners for buttons not on checkout.html are handled by inline onclick or
    // could be added here if preferred, but keep checkout.html's button logic separate.
});
