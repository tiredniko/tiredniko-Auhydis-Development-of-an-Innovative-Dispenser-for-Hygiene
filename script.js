let cart = [];
let total = 0;

function addToCart(product, price, quantity) {
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.product === product);
    if (existingProductIndex > -1) {
        // Update quantity and total if product is already in the cart
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product to the cart
        cart.push({ product, price, quantity });
    }

    // Update the total
    total += price * quantity;
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product} - ₱${item.price.toFixed(2)} x ${item.quantity}`;
        cartItems.appendChild(li);
    });
    totalPrice.textContent = `Total: ₱${total.toFixed(2)}`;
}

function checkout() {
    alert(`Total amount: ₱${total.toFixed(2)}\nThank you for your purchase!`);
    cart = [];
    total = 0;
    displayCart();
}
