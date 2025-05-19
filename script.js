// script.js - Enhanced for product identifiers and cart clearing

let cart = []; // Initialize cart

// Function to hide top bar on scroll (remains the same)
window.onscroll = function () {
    const topBar = document.getElementById('top-bar');
    if (!topBar) return; // Defensive check
    if (window.scrollY > 100) {
        topBar.style.display = 'none';
    } else {
        topBar.style.display = 'flex';
    }
};

function updateQuantity(productIdentifier, change) {
    const display = document.getElementById(`${productIdentifier}-quantity-display`);
    if (!display) return;

    let currentQuantity = parseInt(display.textContent, 10);
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1; // Minimum quantity is 1
    display.textContent = currentQuantity;
}

function getQuantity(productIdentifier) {
    const display = document.getElementById(`${productIdentifier}-quantity-display`);
    if (!display) return 1; // Default to 1 if not found
    return parseInt(display.textContent, 10);
}

// Modified addToCart to include a productId (which will map to motor1, motor2, etc.)
function addToCart(productName, price, quantity, productId) {
    console.log(`Adding to cart: ${productName}, Price: ${price}, Quantity: ${quantity}, ProductID/Motor: ${productId}`);
    
    // For simplicity in a vending machine, let's assume one item type per transaction.
    // If you want multiple different items, the logic here and in checkout needs to be more complex.
    // For now, if a new item is added, it replaces the old one.
    // Or, a better approach for vending: only allow one item in the cart at a time.
    
    // Simplification: Cart holds only one item type at a time for vending.
    // If you want a multi-item cart that then dispenses one by one, this needs significant change.
    // For now, let's assume the user selects one item, then checks out.
    // So, adding to cart essentially means "this is the item I want to buy now".
    
    if (cart.length > 0 && cart[0].productId !== productId) {
        // If a different item is already in the cart, ask to replace or clear.
        // For now, let's just replace it for simplicity.
        console.log("Replacing item in cart with new selection.");
        cart = []; 
    }

    const existingProductIndex = cart.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
        // If same product, update quantity (though for vending, usually just one of an item)
        cart[existingProductIndex].quantity = quantity; // Or += quantity if allowing multiple of same
        console.log(`Updated quantity for ${productName}`);
    } else {
        // Add new product
        cart.push({ productName, price, quantity, productId });
        console.log(`${productName} added to cart.`);
    }

    saveCart();
    displayCart(); // Update cart display on the current page (e.g., machine1.html)
}

function saveCart() {
    console.log('Saving cart:', cart);
    localStorage.setItem('auhydisCart', JSON.stringify(cart)); // Used a more specific key
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

    // These elements might not exist on all pages (e.g., index.html)
    if (!cartItemsElement || !totalPriceElement) {
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
            removeButton.className = 'remove-item'; // Added class for styling
            // Pass productId to removeFromCart to identify which item to remove if needed
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

// Modified removeFromCart to use productId if you have multiple distinct items
function removeFromCart(productIdToRemove) {
    console.log(`Removing product with ID: ${productIdToRemove}`);
    cart = cart.filter(item => item.productId !== productIdToRemove);
    saveCart();
    displayCart();
}

// Function to clear the entire cart, e.g., after successful dispense
function clearCart() {
    console.log("Clearing cart.");
    cart = [];
    saveCart(); // This will save an empty array to localStorage
    displayCart(); // Update display on current page if cart elements exist
    
    // If on checkout page, also clear its specific display if it's separate
    const checkoutCartItems = document.getElementById('cart-items'); // Assuming same ID on checkout.html
    const checkoutTotalPrice = document.getElementById('total-price');
    if (checkoutCartItems) checkoutCartItems.innerHTML = '<li>Cart is now empty.</li>';
    if (checkoutTotalPrice) checkoutTotalPrice.textContent = 'Total: ₱0.00';
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

    // The submitPayment button and its logic are now primarily handled
    // by the embedded script in checkout.html to avoid conflicts.
    // If you had other global initializations, they would go here.
});
