// Function to show card details section
function showCardDetails() {
    document.getElementById('card-details').style.display = 'block';
}

// Function to handle form submission
function submitPayment(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect card details
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvc = document.getElementById('card-cvc').value;

    // You can log these details to verify if they are being captured correctly
    console.log(`Card Number: ${cardNumber}, Expiry Date: ${cardExpiry}, CVC: ${cardCvc}`);

    // Send payment signal to the Cloudflare Worker
    sendPaymentSignal();

    // Optionally, redirect or show a confirmation message
    window.location.href = 'thank-you.html'; // Redirect to a thank you page or show a confirmation message
}

// Function to send payment signal
function sendPaymentSignal() {
    fetch('https://arduino.nikopaned-official.workers.dev/', { // Use the Worker URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'dispense',
            cart: JSON.parse(localStorage.getItem('cart')) // Adjust based on how you store cart data
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally, show a confirmation message to the user here
    })
    .catch((error) => {
        console.error('Error:', error);
        // Optionally, handle errors here (e.g., show an error message to the user)
    });
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', loadCart);

