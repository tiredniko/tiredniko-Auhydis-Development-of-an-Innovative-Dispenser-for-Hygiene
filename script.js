// script.js - Enhanced for robust theme toggle, multi-item/multi-quantity cart (v9)

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
    // console.log(`Theme applied: ${theme}`); // For debugging
}

function toggleTheme() {
    const body = document.body;
    let newTheme;
    if (body.classList.contains("dark-theme")) {
        newTheme = "light";
    } else {
        newTheme = "dark";
    }
    localStorage.setItem('auhydisTheme', newTheme); // Save preference
    applyTheme(newTheme);
    // console.log(`Theme toggled to: ${newTheme}`); // For debugging
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('auhydisTheme');
    // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; // Optional: system preference
    
    // console.log(`Initializing theme. Saved: ${savedTheme}`); // For debugging

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Default to light theme if no preference is saved
        applyTheme("light"); 
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
    const existingProductIndex = cart.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = quantity; 
        if (cart[existingProductIndex].quantity > 5) {
            cart[existingProductIndex].quantity = 5;
        }
    } else {
        cart.push({ productName, price, quantity, productId });
    }
    saveCart();
    displayCart(); 
    alert(`${productName} (${quantity}x) has been added/updated in your cart.`);
}

function saveCart() {
    localStorage.setItem('auhydisCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('auhydisCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            if (!Array.isArray(cart)) cart = [];
        } catch (e) {
            console.error('Error parsing cart from localStorage:', e);
            cart = [];
        }
    } else {
        cart = []; 
    }
    // displayCart() should only be called if the cart elements exist on the page
    // It's called within DOMContentLoaded for pages that need it.
    // Or, individual pages can call displayCart() if they have the elements.
    // For checkout.html, its embedded script calls its own displayCartOnCheckout().
    if (document.getElementById('cart-items') && document.getElementById('total-price')) {
        displayCart();
    }
}

function displayCart() { // This is for machine1.html's cart display
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartItemsElement || !totalPriceElement) {
        // console.log("Cart display elements for general cart not found. Skipping displayCart().");
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
    cart = cart.filter(item => item.productId !== productIdToRemove);
    saveCart();
    displayCart(); // Update the cart display on the current page
}

function checkout() { // Called from machine1.html
    if (cart.length === 0) {
        alert("Your cart is empty. Please add an item to proceed.");
        return;
    }
    // Cart is saved by addToCart/removeFromCart. checkout.html will load it.
    window.location.href = 'checkout.html';
}

// --- Main Initialization on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Global script.js: DOM fully loaded and parsed.");
    
    initializeTheme(); // Apply theme on load
    
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    } else {
        console.warn("Theme toggle button ('theme-toggle-btn') not found by global script.js on this page.");
    }

    // Load cart if cart display elements are present on the page (e.g., machine1.html)
    // checkout.html handles its own cart display via its embedded script.
    if (document.getElementById('cart-items') && document.getElementById('total-price') && !window.location.pathname.includes('checkout.html')) {
        console.log("Global script.js: Loading cart for a non-checkout page.");
        loadCart(); 
    }
    
    const topBar = document.getElementById('top-bar');
    if (topBar && window.scrollY <= 100) {
        topBar.style.display = 'flex';
    }
});
