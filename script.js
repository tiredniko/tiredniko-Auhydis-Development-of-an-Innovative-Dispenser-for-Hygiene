// script.js - Enhanced for multi-item/multi-quantity cart and better UX (v4)

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
    const productCard = document.getElementById(`product-${productIdentifier}`); // Assuming product cards have id="product-tissue", etc.
    
    if (!display || (productCard && productCard.classList.contains('unavailable'))) {
        return; 
    }

    let currentQuantity = parseInt(display.textContent, 10);
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1; // Min quantity 1
    if (currentQuantity > 5) { // Max quantity 5 per item type
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
        cart[existingProductIndex].quantity = quantity; // Set to new quantity from input
        // Or, if you want to add to existing quantity:
        // cart[existingProductIndex].quantity += quantity; 
        // Ensure new total quantity doesn't exceed max (e.g., 5)
        if (cart[existingProductIndex].quantity > 5) {
            cart[existingProductIndex].quantity = 5;
            alert(`Maximum quantity for ${productName} is 5. Quantity updated.`);
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
    console.log('Saving cart:', cart);
    localStorage.setItem('auhydisCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('auhydisCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Loaded cart:', cart);
    } else {
        cart = [];
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

function clearCartAndStorage() {
    console.log("Clearing cart and localStorage.");
    cart = [];
    localStorage.removeItem('auhydisCart'); 
    displayCart(); // Update display on current page
    
    // If on checkout page, its own displayCartOnCheckout will handle it.
    // No need to explicitly target checkout elements from here if it has its own logic.
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add an item to proceed.");
        return;
    }
    // Cart is saved to localStorage by addToCart/removeFromCart.
    // checkout.html will load it.
    window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); 
});
