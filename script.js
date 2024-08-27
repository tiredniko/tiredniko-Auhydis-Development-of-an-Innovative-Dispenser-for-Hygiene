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
        li.textContent = `${item.product} - ${item.quantity} pcs - ₱${item.price * item.quantity}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item.product);
        li.appendChild(removeButton);
        
        cartItems.appendChild(li);
        
        total += item.price * item.quantity;
    });
    
    totalPrice.textContent = `Total: ₱${total}`;
}

// Function to remove items from cart
function removeFromCart(product) {
    cart = cart.filter(item => item.product !== product);
    
    saveCart(); // Save updated cart to local storage
    displayCart();
}

// Function to update quantity of items in the cart
function updateQuantity(product, change) {
    const existingProductIndex = cart.findIndex(item => item.product === product);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += change;
        if (cart[existingProductIndex].quantity < 1) {
            removeFromCart(product);
        } else {
            saveCart(); // Save updated cart to local storage
            displayCart();
        }
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', loadCart);
