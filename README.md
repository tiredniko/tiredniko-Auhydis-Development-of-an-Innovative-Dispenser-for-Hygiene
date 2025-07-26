# Auhydis - Innovative Hygiene Dispenser

**Project Auhydis** is an IoT-enabled vending machine system designed to provide easy and convenient access to hygiene essentials. Users can interact with the system via a web interface, accessible by scanning a QR code on the physical machine or using a provided tablet, to select products and (in future implementations) make payments.

**Live Website:** [https://auhydis.com](https://auhydis.com) 

## 🌟 Features

* **Web-Based Product Selection:** Users browse and select products via a user-friendly website.
* **Remote Dispensing:** Selected items are dispensed from the physical machine triggered via the website.
* **Multi-Product & Multi-Quantity:** Supports multiple products mapped to different motors and allows users to select quantities.
* **Real-time Updates:** (Current) Status messages on the website during the dispensing process.
* **Responsive Design:** Website is designed to be accessible on various devices.
* **Dark/Light Theme Toggle:** User-selectable theme for website appearance, with preference saved in `localStorage`.
* **Cloud-Powered Backend:** Utilizes serverless functions for API logic and an MQTT broker for device communication.
* **Arduino Controlled:** An Arduino Uno R4 WiFi manages the physical vending machine motors.

## 🛠️ Technology Stack

* **Frontend (Website):**
    * HTML5
    * CSS3 (with CSS Custom Properties for theming)
    * Client-Side JavaScript (for interactivity, cart management, API calls, theme toggle)
    * Hosted on: Cloudflare Pages (or GitHub Pages)
* **Backend API (Serverless):**
    * Cloudflare Workers (JavaScript)
* **IoT Communication Bridge:**
    * Adafruit IO (acting as an MQTT broker and providing an HTTP API for the Worker to publish to)
* **Physical Vending Machine Controller:**
    * Arduino Uno R4 WiFi
    * Arduino Programming Language (C/C++)
    * MQTT Client Library (`PubSubClient.h`)
    * WiFi Library (`WiFiS3.h`)
* **Motor Control Hardware:**
    * 12V DC Motors (1.5-2A)
    * NPN Power Transistors (e.g., C5198, with appropriate base resistors)
    * Flyback Diodes (e.g., 1N400x series)
* **Version Control:** Git & GitHub
* **Domain & CDN:** Cloudflare

## 🏗️ System Architecture Overview

1.  **User Interaction:** The user accesses the website (`auhydis.com`) via a QR code on the vending machine or a provided tablet.
2.  **Frontend Request:** The user selects products and quantities, adds them to a cart, and proceeds to checkout. On "Confirm Purchase & Dispense," the website's client-side JavaScript makes an HTTPS POST request to a Cloudflare Worker endpoint, sending the cart details.
3.  **Cloudflare Worker (Backend API):**
    * Receives the cart data from the website.
    * (Future: Will integrate with a payment gateway to verify payment).
    * For each item and quantity in the cart, it determines the appropriate motor command (e.g., "DISPENSE_MOTOR_1").
    * It makes an HTTPS POST request to the Adafruit IO REST API to publish this command message to a specific Adafruit IO Feed (acting as an MQTT topic).
    * Returns a success or error response to the website frontend.
4.  **Adafruit IO (MQTT Broker):**
    * Receives the command message published by the Cloudflare Worker on the designated feed.
    * Forwards this message to all MQTT clients subscribed to that feed.
5.  **Arduino Uno R4 WiFi (Device Controller):**
    * Connects to the local Wi-Fi network.
    * Connects to Adafruit IO as an MQTT client using MQTTS.
    * Subscribes to the specific Adafruit IO feed for dispense commands.
    * Receives the command message (e.g., "DISPENSE_MOTOR_1").
    * Activates the corresponding motor (e.g., Motor 1) for a predefined duration to dispense the product.
6.  **Motor & Dispensing:** The physical motor spins, dispensing the item.

## ⚙️ Setup and Installation (Conceptual)

This project involves distinct parts: the website frontend, the Cloudflare Worker backend, and the Arduino firmware.

### Frontend Website (`auhydis.com`)

* **Code:** HTML, CSS, JavaScript files located in the GitHub repository.
* **Dependencies:** None beyond standard web browser capabilities.
* **Deployment:**
    1.  Clone the repository: `git clone https://github.com/tiredniko/tiredniko-Auhydis-Development-of-an-Innovative-Dispenser-for-Hygiene.git`
    2.  Deploy the static files (HTML, CSS, JS, images) to a static hosting provider like Cloudflare Pages or GitHub Pages.
    3.  Ensure the `workerUrl` in `checkout.html` (or `script.js`) points to your deployed Cloudflare Worker URL.

### Cloudflare Worker (Backend API)

* **Code:** `src/index.js` and `wrangler.toml` in a local project directory (e.g., `auhydis-worker`).
* **Dependencies:** `mqtt` npm package (though the current Adafruit IO version does not use this). If reverting to direct MQTT from Worker, `npm install mqtt`.
* **Setup:**
    1.  Install Node.js and npm.
    2.  Install Wrangler CLI: `npm install -g wrangler`
    3.  Log in: `wrangler login`
    4.  Set up the project directory with `package.json` (if using npm modules), `wrangler.toml`, and `src/index.js`.
    5.  **Configure Secrets in Cloudflare Dashboard:** For the Adafruit IO version, set `AIO_USERNAME`, `AIO_KEY`, and `AIO_FEED_NAME` in your Worker's settings (Settings > Variables > Environment Variables (Secrets)).
* **Deployment:**
    * Navigate to your local Worker project directory in the terminal.
    * Run: `wrangler deploy`

### Arduino Firmware (Vending Machine Controller)

* **Hardware:** Arduino Uno R4 WiFi, C5198 (or similar) transistor circuits for each motor, flyback diodes, 12V DC motors, 12V power supply.
* **Software:** Arduino IDE.
* **Libraries:**
    * `WiFiS3.h` (for Uno R4 WiFi connectivity)
    * `PubSubClient.h` (by Nick O'Leary, for MQTT communication) - Install via Arduino Library Manager.
* **Setup:**
    1.  Open the Arduino sketch (`.ino` file).
    2.  Update Wi-Fi credentials (`ssid` and `pass`).
    3.  Update Adafruit IO credentials (`aio_server`, `aio_mqtt_port`, `aio_username`, `aio_key`) and the feed path (`aio_feed_dispense_command`).
    4.  Define `motorControlPin` constants for each motor and their `motorOnTime` durations.
    5.  Connect the Arduino to your computer and upload the sketch.
    6.  Monitor via Serial Monitor (9600 baud) for connection status and messages.

## 📖 How to Use (User Perspective)

1.  **Scan QR / Use Tablet:** Scan the QR code on the vending machine or use the provided tablet. This will open the [auhydis.com](https://auhydis.com) website.
2.  **Select Machine:** Choose the active vending machine (e.g., "AUHYDIS 1").
3.  **Browse Products:** View available items, select quantities. Unavailable items will be greyed out.
4.  **Add to Cart:** Add desired items and quantities to your shopping cart.
5.  **Checkout:** Proceed to the checkout page. Review your order summary.
6.  **Payment:** (Currently) The website will instruct you to "Please pay at the counter" via Cash or GCash.
7.  **Dispense:** Click "Confirm Purchase & Dispense All". The website sends the command, and the machine will dispense your items sequentially.
8.  **Collect Items:** Take your purchased products from the machine.
9.  **Theme:** Use the 🌙/☀️ button in the top bar to toggle between light and dark themes.

## 🚀 Future Enhancements

* **Online Payment Gateway Integration:** Implement a secure online payment system (e.g., GCash API, PayMongo, Stripe) so users can pay directly on the website.
* **Real-time Stock Levels:** Add sensors to the vending machine to detect stock levels. The Arduino can publish this data to Adafruit IO, and the website can display "out of stock" or low stock warnings.
* **User Accounts & Order History:** Allow users to create accounts and view their past purchases.
* **Admin Dashboard:** A separate interface for managing products, prices, stock, and viewing sales data.
* **Error Feedback from Machine:** If an item fails to dispense, have the Arduino send an error message back (via MQTT) to be potentially displayed to the user or logged for an admin.
* **Multiple Vending Machine Support:** Scale the system to manage and select from multiple physical vending machines from the website.
* **Enhanced UI/UX:** Further refine the website design and user experience.

## 🤝 Contributing

This project is currently under development by Group 3 for CCT-401. For contributions, please contact the repository owner or open an issue/pull request.

## 📝 License

All Rights Reserved
