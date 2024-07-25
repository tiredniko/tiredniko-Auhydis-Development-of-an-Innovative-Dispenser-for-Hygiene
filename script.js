let cart = [];

function addToCart(product, price) {
    cart.push({ product, price });
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product} - ₱${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
        total += item.price;
    });
    totalPrice.textContent = `Total: ₱${total.toFixed(2)}`;
}

function checkout() {
    alert('Proceeding to checkout...');
    // Implement checkout logic here
}
