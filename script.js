// script.js - Enhanced for theme toggle, multi-item/multi-quantity cart, and fixes (v7)

let cart = []; // Initialize cart

// --- Theme Toggle Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Function to apply the saved or preferred theme
    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-theme");
            if (themeToggleButton) themeToggleButton.textContent = "☀️"; // Sun icon
        } else {
            body.classList.remove("dark-theme");
            if (themeToggleButton) themeToggleButton.textContent = "🌙"; // Moon icon
        }
    }

    // Function to toggle the theme
    function toggleTheme() {
        let newTheme;
        if (body.classList.contains("dark-theme")) {
            newTheme = "light";
        } else {
            newTheme = "dark";
        }
        localStorage.setItem('auhydisTheme', newTheme);
        applyTheme(newTheme);
    }

    // Initialize theme on page load
    const savedTheme = localStorage.getItem('auhydisTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Optional: Check system preference if no theme is saved
        // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        // if (prefersDark) {
        //     applyTheme("dark");
        // } else {
        //     applyTheme("light");
        // }
        applyTheme("light"); // Default to light if no preference saved and not checking system
    }

    // Add event listener to the toggle button
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // --- End Theme Toggle Logic ---

    // --- Existing Cart and Scroll Logic ---
    loadCart(); // Load cart on page load

    const topBar = document.getElementById('top-bar'); // Define topBar here for scroll function
    if (topBar && window.scrollY <= 100) { // Ensure it's visible on load if not scrolled
        topBar.style.display = 'flex';
    }
    // --- End Existing Cart and Scroll Logic ---
});


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

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add an item to proceed.");
        return;
    }
    console.log("Proceeding to checkout with cart:", cart);
    window.location.href = 'checkout.html';
}

// Note: The DOMContentLoaded listener now also initializes the theme.
// The `submitPayment` logic specific to checkout.html is embedded in that file.
