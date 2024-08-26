let cart = [];

function addToCart(product, price, quantity) {
    // Find if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.product === product);
    
    // Update quantity if product exists, otherwise add new product
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += parseInt(quantity, 10);
    } else {
        cart.push({ product, price, quantity: parseInt(quantity, 10) });
    }
    
    // Update cart display
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    // Clear previous cart items
    cartItems.innerHTML = '';
    
    // Calculate total price
    let total = 0;
    
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product} - ₱${(item.price * item.quantity).toFixed(2)} (x${item.quantity})`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    
    // Display total price
    totalPrice.textContent = `Total: ₱${total.toFixed(2)}`;
}

function checkout() {
    window.location.href = 'checkout.html'; // Redirect to checkout page
}




