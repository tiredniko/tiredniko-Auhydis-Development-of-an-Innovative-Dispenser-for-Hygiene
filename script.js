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
  displayCart();
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
    displayCart();
  }
}

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

function removeFromCart(product) {
  cart = cart.filter(item => item.product !== product);

  saveCart();
  displayCart();
}

function checkout() {
  // Retrieve the cart items from localStorage
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);

    // Display the cart items on the checkout page
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = '';

    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.product} - ${item.quantity} pcs - ₱${item.price * item.quantity}`;
      cartItemsElement.appendChild(li);
    });

    // Calculate and display the total price
    const totalPriceElement = document.getElementById('total-price');
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    totalPriceElement.textContent = `Total: ₱${total}`;

    // Redirect to checkout.html
    window.location.href = 'checkout.html';
  } else {
    // Handle the case where the cart is empty
    alert('Your cart is empty.');
  }
}

function submitPayment() {
  // Simulate payment processing (optional)
  // You can add a message or logic to simulate processing time
  // alert('Processing payment...');

  // Redirect to success.html
  window.location.href = 'success.html';
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();

  // Attach event listener to the submitPayment button
  const submitButton = document.getElementById('submitPayment');
  submitButton.addEventListener('click', submitPayment);
});
