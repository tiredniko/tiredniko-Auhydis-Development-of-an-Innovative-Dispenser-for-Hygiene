// Existing JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Your existing code to initialize the page or handle events

    // Example: Event listener for machine links
    const machineLinks = document.querySelectorAll('.machine a');
    machineLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            // Your existing logic for machine link clicks
        });
    });

    // Example: Event listener for product items
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.addEventListener('click', function() {
            // Your existing logic for product clicks
        });
    });

    // Additional existing code
});

// New JavaScript

// Event listener for payment buttons
const paymentButtons = document.querySelectorAll('.payment-button');
paymentButtons.forEach(button => {
    button.addEventListener('click', function() {
        alert('Payment button clicked!');
        // Replace this with actual payment handling logic
    });
});

// Handling form submission for bank details
const bankDetailsForm = document.getElementById('bank-details-form');
if (bankDetailsForm) {
    bankDetailsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Example of getting form data
        const formData = new FormData(bankDetailsForm);
        const bankDetails = {
            accountName: formData.get('account-name'),
            accountNumber: formData.get('account-number'),
            bankName: formData.get('bank-name'),
        };

        // Handle form submission (e.g., send to server or process locally)
        console.log('Bank Details:', bankDetails);

        alert('Bank details submitted!');
        // Clear form fields if needed
        bankDetailsForm.reset();
    });
}

// Additional new code or logic if needed


