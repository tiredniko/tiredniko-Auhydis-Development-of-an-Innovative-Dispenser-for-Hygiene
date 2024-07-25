let cart = [];

function addToCart(product, price, quantity) {
    const existingProductIndex = cart.findIndex(item => item.product === product);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += parseInt(quantity, 10);
    } else {
        cart.push({ product, price, quantity: parseInt(quantity, 10) });
    }
    displayCart();
}

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

function checkout() {
    alert('Proceeding to checkout...');
    // Implement checkout logic here
}

