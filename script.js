// script.js - Enhanced for robust theme toggle, multi-item/multi-quantity cart (v8)

let cart = []; // Initialize cart

// --- Theme Toggle Logic ---
function applyTheme(theme) {
    const body = document.body;
    const themeToggleButton = document.getElementById('theme-toggle-btn');

    if (theme === "dark") {
        body.classList.add("dark-theme");
        if (themeToggleButton) themeToggleButton.textContent = "☀️"; // Sun icon
    } else {
        body.classList.remove("dark-theme");
        if (themeToggleButton) themeToggleButton.textContent = "🌙"; // Moon icon
    }
    console.log(`Theme applied: ${theme}`);
}

function toggleTheme() {
    const body = document.body;
    let newTheme;
    if (body.classList.contains("dark-theme")) {
        newTheme = "light";
    } else {
        newTheme = "dark";
    }
    localStorage.setItem('auhydisTheme', newTheme);
    applyTheme(newTheme);
    console.log(`Theme toggled to: ${newTheme}`);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('auhydisTheme');
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log(`Saved theme: ${savedTheme}, System prefers dark: ${prefersDark}`);

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme("dark"); // Default to system dark mode if no preference saved
    } else {
        applyTheme("light"); // Default to light
    }
}
// --- End Theme Toggle Logic ---


// --- Scroll and Cart Logic ---
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
        cart[existingProductIndex].quantity = quantity; 
        if (cart[existingProductIndex].quantity > 5) {
            cart[existingProductIndex].quantity = 5;
        }
        console.log(`Updated quantity for ${productName} (ID: ${productId}) to ${cart[existingProductIndex].quantity}`);
    } else {
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
        try {
            cart = JSON.parse(savedCart);
            if (!Array.isArray(cart)) { // Basic validation
                console.warn('Loaded cart is not an array, resetting.');
                cart = [];
            }
        } catch (e) {
            console.error('Error parsing saved cart from localStorage, resetting cart.', e);
            cart = [];
        }
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
        // These elements might not exist on all pages (e.g., index.html might not have a visible cart)
        // console.log("Cart display elements not found on this page. Skipping displayCart().");
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

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add an item to proceed.");
        return;
    }
    console.log("Proceeding to checkout with cart:", cart);
    window.location.href = 'checkout.html';
}

// This function is now primarily called from checkout.html after a successful dispense signal
// by directly removing the item from localStorage and then calling displayCartOnCheckout().
// However, having it here might be useful for other contexts if needed.
function clearCartAndStorage() {
    console.log("Clearing cart and localStorage (called from script.js).");
    cart = []; 
    localStorage.removeItem('auhydisCart'); 
    displayCart(); 
}

// --- Main Initialization on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Initializing script.js...");
    
    initializeTheme(); // Apply theme on load
    
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    } else {
        console.warn("Theme toggle button not found on this page.");
    }

    // Load cart if cart elements are present (e.g., on machine1.html or checkout.html)
    // The displayCart() function itself checks for the existence of cart-items and total-price elements.
    loadCart(); 

    // The submitPayment button logic is specific to checkout.html and handled by its embedded script.
    // Other page-specific initializations could go here if needed.
});
