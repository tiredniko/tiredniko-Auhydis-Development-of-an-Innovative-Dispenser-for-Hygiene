let cart = [];

// Function to save cart to local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart from local storage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        displayCart(); // Update the cart display
    }
}

// Function to add items to cart
function addToCart(product, price, quantity) {
    const existingProductIndex = cart.findIndex(item => item.product === product);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += parseInt(quantity, 10);
    } else {
        cart.push({ product, price, quantity: parseInt(quantity, 10) });
    }
    
    saveCart(); // Save cart to local storage
    displayCart();
}

// Function to display cart items
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product} - ₱${(item.price * item.quantity).toFixed(2)} (x${item.quantity})`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    
    totalPrice.textContent = `Total: ₱${total.toFixed(2)}`;
}

// Function to handle checkout
function checkout() {
    window.location.href = 'checkout.html'; // Redirect to checkout page
}

// Load cart when the page is loaded
window.addEventListener('load', loadCart);




