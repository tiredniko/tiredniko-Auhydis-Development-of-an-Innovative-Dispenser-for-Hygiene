// script.js - Enhanced for multi-item/multi-quantity cart, cart clearing, and fixes (v5)

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
        return; 
    }

    let currentQuantity = parseInt(display.textContent, 10);
    currentQuantity += change;
    
    if (currentQuantity < 1) currentQuantity = 1; 
    if (currentQuantity > 5) { 
        currentQuantity = 5;
        alert("You can add a maximum of 5 units for this item per transaction.");
    }
    display.textContent = currentQuantity;
}

function getQuantity(productIdentifier) {
    const display = document.getElementById(`${productIdentifier}-quantity-display`);
    if (!display) return 1;
    return parseInt(display.textContent, 10);
}

function addToCart(productName, price, quantity, productId) {
    console.log(`Adding to cart: ${productName}, Price: ${price}, Quantity: ${quantity}, ProductID/Motor: ${productId}`);
    
    const existingProductIndex = cart.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
        // If product already in cart, update its quantity
        cart[existingProductIndex].quantity = quantity; 
        if (cart[existingProductIndex].quantity > 5) { // Enforce max quantity again
            cart[existingProductIndex].quantity = 5;
        }
        console.log(`Updated quantity for ${productName} (ID: ${productId}) to ${cart[existingProductIndex].quantity}`);
    } else {
        // Add new product to cart
        cart.push({ productName, price, quantity, productId });
        console.log(`${productName} (ID: ${productId}) added to cart.`);
    }

    saveCart();
    displayCart(); 
    alert(`${productName} (${quantity}x) has been added/updated in your cart.`);
}

function saveCart() {
    console.log('Saving cart to localStorage:', cart);
    localStorage.setItem('auhydisCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('auhydisCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Loaded cart from localStorage:', cart);
    } else {
        cart = []; 
        console.log('No cart in localStorage, initialized empty cart.');
    }
    displayCart(); 
}

function displayCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartItemsElement || !totalPriceElement) {
        return; 
    }

    cartItemsElement.innerHTML = ''; 
    let total = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            const li = document.createElement('li');
            
            const itemDetailsSpan = document.createElement('span');
            itemDetailsSpan.className = 'item-details';
            itemDetailsSpan.textContent = `${item.productName} - ${item.quantity} pcs`;
            
            const itemPriceSpan = document.createElement('span');
            itemPriceSpan.className = 'item-price';
            itemPriceSpan.textContent = `₱${(item.price * item.quantity).toFixed(2)}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-item';
            removeButton.onclick = () => removeFromCart(item.productId); 
            
            li.appendChild(itemDetailsSpan);
            li.appendChild(itemPriceSpan);
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

function removeFromCart(productIdToRemove) {
    console.log(`Removing product with ID: ${productIdToRemove} from cart`);
    cart = cart.filter(item => item.productId !== productIdToRemove);
    saveCart();
    displayCart();
}

// This function will be called from checkout.html after a successful dispense signal
function clearCartAfterCheckout() {
    console.log("Clearing cart from localStorage after checkout.");
    cart = []; // Clear in-memory cart
    localStorage.removeItem('auhydisCart'); // Clear stored cart
    // displayCart(); // No need to call displayCart here, checkout.html handles its own UI update
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add an item to proceed.");
        return;
    }
    // The cart is already saved in localStorage by addToCart/removeFromCart.
    // checkout.html will load it from localStorage.
    console.log("Proceeding to checkout with cart:", cart);
    window.location.href = 'checkout.html';
}

// Load cart when any page loads that includes this script
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Loading cart...");
    loadCart(); 
});
