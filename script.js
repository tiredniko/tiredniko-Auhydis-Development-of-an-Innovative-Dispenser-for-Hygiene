// script.js (Your original, with a note)
let cart = [];

window.onscroll = function () {
    const topBar = document.getElementById('top-bar');
    if (window.scrollY > 100) {
        topBar.style.display = 'none';
    } else {
        topBar.style.display = 'flex';
    }
};

function updateQuantity(product, change) {
    const display = document.getElementById(`${product}-quantity-display`);
    let currentQuantity = parseInt(display.textContent, 10);
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    display.textContent = currentQuantity;
}

function getQuantity(product) {
    return parseInt(document.getElementById(`${product}-quantity-display`).textContent, 10);
}

function addToCart(product, price, quantity) {
    console.log(`Adding to cart: ${product}, ${price}, ${quantity}`);
    const existingProductIndex = cart.findIndex(item => item.product === product);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({ product, price, quantity });
    }

    saveCart();
    displayCart(); // This should only run if on a page with cart display elements
}

function saveCart() {
    console.log('Saving cart:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Loaded cart:', cart);
        displayCart(); // This should only run if on a page with cart display elements
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items'); // Used on machine1.html and checkout.html
    const totalPrice = document.getElementById('total-price'); // Used on machine1.html and checkout.html

    // Check if these elements exist before trying to modify them
    if (!cartItems || !totalPrice) {
        // console.warn("Cart display elements not found on this page. Skipping displayCart().");
        return; 
    }

    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.product} - ${item.quantity} pcs - ₱${(item.price * item.quantity).toFixed(2)}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeFromCart(item.product);
            li.appendChild(removeButton);

            cartItems.appendChild(li);
            total += item.price * item.quantity;
        });
        totalPrice.textContent = `Total: ₱${total.toFixed(2)}`;
    } else {
        cartItems.innerHTML = '<li>Your cart is empty.</li>';
        totalPrice.textContent = `Total: ₱0.00`;
    }
}

function removeFromCart(product) {
    cart = cart.filter(item => item.product !== product);
    saveCart();
    displayCart();
}

function checkout() { // This function is called from machine1.html
    // Save cart just before redirecting (though addToCart already does)
    saveCart(); 
    // Redirect to checkout.html
    window.location.href = 'checkout.html';
}

// This function was likely intended for a simpler checkout flow before Worker integration
function submitPayment() { 
    // This function in script.js might conflict with the embedded script in checkout.html
    // if it's also attached to the same button.
    // For the new flow, checkout.html's embedded script handles the dispense logic.
    // This function might only be relevant if you had a scenario where payment submission
    // *only* redirects without trying to trigger a motor.
    // alert('Processing payment...'); // Simulate payment processing (optional)
    // window.location.href = 'success.html';
    console.warn("script.js submitPayment() called. If on checkout.html, this might be unintended if the embedded script is active.");
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Load and display cart on pages that have the cart elements (e.g., machine1.html)

    // Be careful with this part if checkout.html ALSO links script.js:
    // The embedded script in checkout.html now handles its own "submitPayment" button.
    // This event listener in script.js might cause issues or be redundant on checkout.html.
    const submitButton = document.getElementById('submitPayment');
    // You could add a check: if (!document.querySelector('body#checkoutPage')) { /* then add listener */ }
    // Or ensure checkout.html does not link this script, or its embedded script handles everything.
    if (submitButton && !window.location.pathname.endsWith('checkout.html')) { // Example: only attach if NOT on checkout.html
        submitButton.addEventListener('click', submitPayment);
    }
});
