let cart = [];

function addToCart(product, price, quantity) {
    quantity = parseInt(quantity);
    let existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ product, price, quantity });
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
        li.textContent = `${item.product} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    totalPrice.textContent = `Total: ₱${total.toFixed(2)}`;
}

function checkout() {
    alert('Proceeding to checkout...');
    // Implement checkout logic here
}

