// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('crunchaveCart')) || [];
    let orderType = ''; // 'pickup' or 'delivery'
    let deliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress')) || null;
    
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.getElementById('cartCount');
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Address Modal Elements
    const addressModal = document.getElementById('addressModal');
    const addressForm = document.getElementById('addressForm');
    const btnCancel = document.querySelector('.btn-cancel');
    const btnConfirm = document.querySelector('.btn-confirm');
    
    // Menu Modal Elements
    const menuModal = document.getElementById('menuModal');
    const viewMenuBtn = document.getElementById('viewMenuBtn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Update cart count display
    function updateCartCount() {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'block' : 'none';
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('crunchaveCart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Save address to localStorage
    function saveAddress(address) {
        localStorage.setItem('deliveryAddress', JSON.stringify(address));
        deliveryAddress = address;
    }
    
    // Add item to cart
    function addToCart(productName, price = 0) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: productName, price: price, quantity: 1 });
        }
        saveCart();
        updateCartDisplay();
    }
    
    // Add cart animation
    function addCartAnimation(button) {
        const cartIcon = document.getElementById('cartIcon');
        if (!cartIcon) return;
        
        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        const flyElement = document.createElement('div');
        flyElement.innerHTML = '🛒';
        flyElement.style.position = 'fixed';
        flyElement.style.left = (buttonRect.left + buttonRect.width / 2 - 15) + 'px';
        flyElement.style.top = (buttonRect.top + buttonRect.height / 2 - 15) + 'px';
        flyElement.style.zIndex = '9999';
        flyElement.style.fontSize = '30px';
        flyElement.style.background = 'white';
        flyElement.style.borderRadius = '50%';
        flyElement.style.padding = '5px';
        flyElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        flyElement.style.transition = 'all 0.8s ease-out';
        flyElement.style.pointerEvents = 'none';
        
        document.body.appendChild(flyElement);
        
        // Trigger animation
        setTimeout(() => {
            flyElement.style.left = (cartRect.left + cartRect.width / 2 - 15) + 'px';
            flyElement.style.top = (cartRect.top + cartRect.height / 2 - 15) + 'px';
            flyElement.style.transform = 'scale(0.5)';
            flyElement.style.opacity = '0.7';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            flyElement.remove();
        }, 810);
    }
    
    // Show notification
    function showNotification(message) {
        // Simple alert for now
        alert(message);
    }
    
    // Update quantity
    function updateQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(index);
        } else {
            cart[index].quantity = newQuantity;
            saveCart();
            updateCartDisplay();
        }
    }
    
    // Remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartDisplay();
    }
    
    // Update cart quantity
    function updateQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(index);
        } else {
            cart[index].quantity = newQuantity;
            saveCart();
            updateCartDisplay();
        }
    }
    
    // Clear cart
    function clearCart() {
        cart = [];
        saveCart();
        updateCartDisplay();
    }
    
    // Calculate total
    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add some crunchy items!</p>';
            cartTotal.innerHTML = '<p>Total: <span>₱0.00</span></p>';
            return;
        }
        
        let itemsHTML = '';
        cart.forEach((item, index) => {
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₱${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" ${item.quantity == 1 ? 'disabled' : ''} onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        cartTotal.innerHTML = `<p>Total: <span>₱${calculateTotal().toFixed(2)}</span></p>`;
    }
    
    // Make functions global for onclick handlers
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    
    // Initialize cart display
    updateCartCount();
    updateCartDisplay();
    
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Order Now Buttons
    const orderButtons = document.querySelectorAll('.btn-order, .btn-primary, .btn-purchase, .btn-product');
    const orderModal = document.getElementById('orderModal');
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuAddButtons = document.querySelectorAll('.btn-add-menu');
    
    // Order Options in Order Modal
    const orderOptions = document.querySelectorAll('.order-option');
    const pickupOption = document.querySelector('.order-option:first-child');
    const deliveryOption = document.querySelector('.order-option:nth-child(2)');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if(this.classList.contains('btn-product')) {
                // For product buttons, add to cart
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.product-name').textContent;
                
                // Set price based on product name
                let productPrice = 199; // default
                if (productName.includes('Burger')) {
                    productPrice = 299;
                } else if (productName.includes('Fries')) {
                    productPrice = 99;
                } else if (productName.includes('Sundae')) {
                    productPrice = 199;
                }
                
                addToCart(productName, productPrice);
                
                showNotification(`Added ${productName} to your cart!`);
                
                // Add cart animation
                addCartAnimation(this);
                
            } else if(this.classList.contains('btn-purchase')) {
                // For pricing buttons, add meal deal to cart
                const pricingCard = this.closest('.pricing-card');
                const planName = pricingCard.querySelector('.plan-name').textContent;
                const planPriceText = pricingCard.querySelector('.plan-price').textContent;
                const planPrice = parseFloat(planPriceText.replace('₱', ''));
                
                addToCart(planName, planPrice);
                
                showNotification(`Added ${planName} to your cart!`);
                
                // Add cart animation
                addCartAnimation(this);
                
            } else {
                // For other order buttons, show the menu modal
                menuModal.style.display = 'flex';
            }
        });
    });
    
    // Menu Add to Cart Buttons
    menuAddButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name');
            const itemPrice = parseFloat(this.getAttribute('data-price'));

            // Check if it's an affordable crunch item
            if (itemName.includes('Wave Solo') || itemName.includes('Crunch Duo') || itemName.includes('Family Wave')) {
                showCustomizationModal(itemName, itemPrice);
            } else if (isChickenOrBurgerItem(itemName)) {
                // Chicken Crunch and Burger Waves - add directly without size selection
                addToCart(itemName, itemPrice);
                showNotification(`Added ${itemName} to your cart!`);
                addCartAnimation(document.querySelector('.cart-icon'));
            } else {
                // Other menu items - show size selection
                showSizeSelectionModal(itemName, itemPrice);
            }
        });
    });
    
    // Close modals
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
        updateCartDisplay();
    });
    
    // Clear cart button
    clearCartBtn.addEventListener('click', function() {
        clearCart();
        showNotification('Cart cleared!');
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        cartModal.style.display = 'none';
        orderModal.style.display = 'flex';
        showNotification('Select your order type');
    });
    
    // Order option buttons (Pickup, Delivery, App Order)
    orderOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add some items before selecting an order type.");
                return;
            }
            
            const optionText = this.querySelector('span').textContent.toLowerCase();
            
            if (optionText === 'delivery') {
                // For delivery, show address modal
                orderModal.style.display = 'none';
                orderType = 'delivery';
                
                // If address exists, show confirmation, else show address form
                if (deliveryAddress) {
                    showOrderSummary('delivery');
                } else {
                    addressModal.style.display = 'flex';
                }
                
            } else if (optionText === 'pickup') {
                // For pickup, show summary first
                orderModal.style.display = 'none';
                orderType = 'pickup';
                showOrderSummary('pickup');
                
            } else if (optionText === 'app order') {
                // For app order
                orderType = 'app';
                showNotification('Redirecting to our mobile app...');
                
                // Simulate redirect
                setTimeout(() => {
                    orderModal.style.display = 'none';
                    showNotification('Please complete your order in the Crunchave app!');
                }, 1500);
            }
        });
    });
    
    // Cancel address button
    btnCancel.addEventListener('click', function() {
        addressModal.style.display = 'none';
        orderModal.style.display = 'flex';
    });
    
    // Address form submission
    addressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get address data
        const address = {
            fullName: document.getElementById('fullName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            streetAddress: document.getElementById('streetAddress').value,
            barangay: document.getElementById('barangay').value,
            city: document.getElementById('city').value,
            province: document.getElementById('province').value,
            landmark: document.getElementById('landmark').value,
            deliveryNotes: document.getElementById('deliveryNotes').value,
            timestamp: new Date().toISOString()
        };
        
        // Save address
        saveAddress(address);
        
        // Close address modal
        addressModal.style.display = 'none';
        
        // Show delivery summary
        showOrderSummary('delivery');
    });
    
    // Menu category switching
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            // Remove active from all
            categoryLinks.forEach(l => l.classList.remove('active'));
            menuCategories.forEach(c => c.classList.remove('active'));
            // Add active
            this.classList.add('active');
            document.getElementById(category).classList.add('active');
        });
    });
    
    // Close menu modal
    document.querySelectorAll('.close-modal').forEach(close => {
        close.addEventListener('click', () => {
            if (close.closest('#menuModal')) {
                menuModal.style.display = 'none';
            }
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === menuModal) {
            menuModal.style.display = 'none';
        }
    });
    
    // Footer menu category links
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent.toLowerCase();
            let category = '';
            if (text.includes('chicken')) category = 'chicken';
            else if (text.includes('burger')) category = 'burgers';
            else if (text.includes('sides')) category = 'sides';
            else if (text.includes('sweet')) category = 'sweets';
            else if (text.includes('beverages')) category = 'beverages';
            if (category) {
                // Open menu modal
                menuModal.style.display = 'flex';
                // Switch to category
                categoryLinks.forEach(l => l.classList.remove('active'));
                menuCategories.forEach(c => c.classList.remove('active'));
                const activeLink = document.querySelector(`.category-link[data-category="${category}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    document.getElementById(category).classList.add('active');
                }
            }
        });
    });
    
    // Show delivery summary
    function showOrderSummary(orderType) {
        const subtotal = calculateTotal();
        const deliveryFee = orderType === 'delivery' ? 50 : 0;
        const total = subtotal + deliveryFee;
        
        // Create summary modal
        const summaryModal = document.createElement('div');
        summaryModal.className = 'modal';
        summaryModal.style.display = 'flex';
        
        const addressSection = orderType === 'delivery' ? `
            <div class="delivery-address-section">
                <h4>Delivery Address:</h4>
                <div class="delivery-summary-content">
                    <p><strong>Name:</strong> ${deliveryAddress.fullName}</p>
                    <p><strong>Phone:</strong> ${deliveryAddress.phoneNumber}</p>
                    <p><strong>Address:</strong> ${deliveryAddress.streetAddress}, ${deliveryAddress.barangay}</p>
                    <p><strong>City/Province:</strong> ${deliveryAddress.city}, ${deliveryAddress.province}</p>
                    ${deliveryAddress.landmark ? `<p><strong>Landmark:</strong> ${deliveryAddress.landmark}</p>` : ''}
                    ${deliveryAddress.deliveryNotes ? `<p><strong>Instructions:</strong> ${deliveryAddress.deliveryNotes}</p>` : ''}
                </div>
            </div>
        ` : `
            <div class="pickup-location-section">
                <h4>Pickup Location:</h4>
                <div class="pickup-summary-content">
                    <p><strong>Store:</strong> Crunchave Main Branch</p>
                    <p><strong>Address:</strong> 123 Crunch Avenue, Digos City</p>
                    <p><strong>Phone:</strong> 63+ 987 654 3210</p>
                    <p><strong>Ready for pickup in:</strong> 15-20 minutes</p>
                </div>
            </div>
        `;
        
        summaryModal.innerHTML = `
            <div class="modal-content order-summary-modal">
                <span class="close-modal">&times;</span>
                <h3>${orderType === 'delivery' ? 'Delivery' : 'Pickup'} <span class="highlight">Summary</span></h3>
                
                <div class="summary-layout">
                    ${addressSection}
                    
                    <div class="order-details-section">
                        <h4>Order Details:</h4>
                        <div class="order-items-scrollable">
                            ${cart.map(item => `<p>${item.quantity}x ${item.name} - ₱${(item.price * item.quantity).toFixed(2)}</p>`).join('')}
                        </div>
                        <div class="order-total-breakdown">
                            <p><strong>Subtotal:</strong> ₱${subtotal.toFixed(2)}</p>
                            ${deliveryFee > 0 ? `<p><strong>Delivery Fee:</strong> ₱${deliveryFee.toFixed(2)}</p>` : ''}
                            <p class="total-amount"><strong>Total:</strong> ₱${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                
                ${orderType === 'delivery' ? `
                <div class="map-container">
                    <div class="map-placeholder">
                        <i class="fas fa-map-marker-alt"></i>
                        <p>Delivery location confirmed</p>
                        <small>Driver will navigate to this address</small>
                    </div>
                </div>
                ` : `
                <div class="pickup-container">
                    <div class="pickup-placeholder">
                        <i class="fas fa-store"></i>
                        <p>Ready for pickup at store</p>
                        <small>We'll prepare your order for pickup</small>
                    </div>
                </div>
                `}
                
                <div class="order-confirmation">
                    <button class="btn-confirm-order">Confirm ${orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order</button>
                    ${orderType === 'delivery' ? '<button class="btn-edit-address">Edit Address</button>' : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(summaryModal);
        
        // Close summary modal
        summaryModal.querySelector('.close-modal').addEventListener('click', function() {
            summaryModal.remove();
            orderModal.style.display = 'flex';
        });
        
        // Confirm order button
        summaryModal.querySelector('.btn-confirm-order').addEventListener('click', function() {
            processOrder(orderType);
            summaryModal.remove();
        });
        
        // Edit address button (only for delivery)
        if (orderType === 'delivery') {
            summaryModal.querySelector('.btn-edit-address').addEventListener('click', function() {
                summaryModal.remove();
                addressModal.style.display = 'flex';
            });
        }
        
        // Close modal when clicking outside
        summaryModal.addEventListener('click', function(e) {
            if (e.target === summaryModal) {
                summaryModal.remove();
                orderModal.style.display = 'flex';
            }
        });
        
        // Close when clicking outside
        summaryModal.addEventListener('click', function(e) {
            if (e.target === summaryModal) {
                summaryModal.remove();
                orderModal.style.display = 'flex';
            }
        });
    }
    
    // Process order
    function processOrder(type) {
        const orderDetails = {
            type: type,
            items: cart,
            total: calculateTotal(),
            timestamp: new Date().toISOString(),
            orderId: 'CRV-' + Date.now().toString().slice(-6)
        };
        
        if (type === 'delivery') {
            orderDetails.address = deliveryAddress;
            orderDetails.total += 50; // Add delivery fee
        }
        
        // Save order to localStorage (in real app, send to server)
        localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
        
        // Show order confirmation
        showOrderConfirmation(orderDetails);
        
        // Clear cart after order
        clearCart();
    }
    
    // Show order confirmation
    function showOrderConfirmation(order) {
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'modal';
        confirmationModal.style.display = 'flex';
        
        const itemsList = order.items.map(item => 
            `${item.quantity}x ${item.name} - ₱${(item.price * item.quantity).toFixed(2)}`
        ).join('<br>');
        
        const addressInfo = order.type === 'delivery' ? 
            `<p><strong>Delivery to:</strong> ${order.address.streetAddress}, ${order.address.barangay}</p>` :
            `<p><strong>Pickup at:</strong> 123 Crunch Avenue, Digos City</p>`;
        
        const deliveryFee = order.type === 'delivery' ? 
            `<p><strong>Delivery Fee:</strong> ₱50.00</p>` : '';
        
        confirmationModal.innerHTML = `
            <div class="modal-content">
                <h3>Order <span class="highlight">Confirmed!</span></h3>
                <div style="text-align: center; margin: 20px 0;">
                    <i class="fas fa-check-circle" style="font-size: 4rem; color: #10b981;"></i>
                </div>
                
                <div class="order-details">
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    ${addressInfo}
                    <p><strong>Items:</strong><br>${itemsList}</p>
                    ${deliveryFee}
                    <p><strong>Total Amount:</strong> ₱${order.total.toFixed(2)}</p>
                </div>
                
                <div class="estimated-time">
                    <p><strong>Estimated ${order.type === 'delivery' ? 'Delivery' : 'Pickup'} Time:</strong></p>
                    <p>${order.type === 'delivery' ? '30-45 minutes' : '15-20 minutes'}</p>
                </div>
                
                <div class="confirmation-buttons">
                    <button class="btn-close-confirmation">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmationModal);
        
        // Close confirmation
        confirmationModal.querySelector('.btn-close-confirmation').addEventListener('click', function() {
            confirmationModal.remove();
        });
        
        confirmationModal.addEventListener('click', function(e) {
            if (e.target === confirmationModal) {
                confirmationModal.remove();
            }
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if(e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if(e.target === orderModal) {
            orderModal.style.display = 'none';
        }
        if(e.target === menuModal) {
            menuModal.style.display = 'none';
        }
        if(e.target === addressModal) {
            addressModal.style.display = 'none';
            orderModal.style.display = 'flex';
        }
    });

    // Check if item is from Chicken Crunch or Burger Waves category
    function isChickenOrBurgerItem(itemName) {
        const chickenItems = ['Crunchy Chicken Wave', 'Spicy Chicken Crunch', 'Chicken Tenders Wave', 'Chicken Nuggets Crunch'];
        const burgerItems = ['Wave Burger Deluxe', 'Crunchy Bacon Burger', 'Veggie Wave Burger', 'Spicy Jalapeño Burger'];
        return chickenItems.includes(itemName) || burgerItems.includes(itemName);
    }

    // Size Selection Modal for regular menu items
    function showSizeSelectionModal(itemName, basePrice) {
        const sizeModal = document.createElement('div');
        sizeModal.className = 'modal';
        sizeModal.style.display = 'flex';

        const sizeOptions = [
            { size: 'Small', multiplier: 0.8, price: Math.round(basePrice * 0.8) },
            { size: 'Medium', multiplier: 1.0, price: basePrice },
            { size: 'Large', multiplier: 1.2, price: Math.round(basePrice * 1.2) },
            { size: 'Extra Large', multiplier: 1.5, price: Math.round(basePrice * 1.5) }
        ];

        sizeModal.innerHTML = `
            <div class="modal-content size-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Select Size for ${itemName}</h3>
                <div class="size-options">
                    ${sizeOptions.map(option => `
                        <button class="size-option" data-size="${option.size}" data-price="${option.price}">
                            <span class="size-name">${option.size}</span>
                            <span class="size-price">₱${option.price}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(sizeModal);

        // Handle size selection
        sizeModal.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', function() {
                const selectedSize = this.getAttribute('data-size');
                const selectedPrice = parseFloat(this.getAttribute('data-price'));
                const fullItemName = `${itemName} (${selectedSize})`;

                addToCart(fullItemName, selectedPrice);
                showNotification(`Added ${fullItemName} to your cart!`);
                addCartAnimation(document.querySelector('.cart-icon'));

                sizeModal.remove();
            });
        });

        // Close modal
        sizeModal.querySelector('.close-modal').addEventListener('click', function() {
            sizeModal.remove();
        });

        sizeModal.addEventListener('click', function(e) {
            if (e.target === sizeModal) {
                sizeModal.remove();
            }
        });
    }

    // Customization Modal for affordable crunch items
    function showCustomizationModal(itemName, basePrice) {
        const customModal = document.createElement('div');
        customModal.className = 'modal';
        customModal.style.display = 'flex';

        const reqBeverages = itemName.includes('Wave Solo') ? 1 : itemName.includes('Crunch Duo') ? 2 : 4;
        const reqDesserts = itemName.includes('Wave Solo') ? 0 : itemName.includes('Crunch Duo') ? 1 : 2;

        const beverageCards = `
            <button class="beverage-option" data-beverage="Classic Cola Wave" data-price="59">
                <img src="assets/classic_cola_wave.jpg" alt="Classic Cola Wave">
                <span>Classic Cola Wave</span>
            </button>
            <button class="beverage-option" data-beverage="Lemonade Splash" data-price="69">
                <img src="assets/lemonade_splash.jpg" alt="Lemonade Splash">
                <span>Lemonade Splash</span>
            </button>
            <button class="beverage-option" data-beverage="Iced Tea Wave" data-price="59">
                <img src="assets/iced_tea_wave.jpg" alt="Iced Tea Wave">
                <span>Iced Tea Wave</span>
            </button>
            <button class="beverage-option" data-beverage="Orange Crush" data-price="59">
                <img src="assets/orange_crush.jpg" alt="Orange Crush">
                <span>Orange Crush</span>
            </button>
        `;

        const dessertCards = `
            <button class="dessert-option" data-dessert="Crunchy Sundae Wave" data-price="99">
                <img src="assets/crunchy_sundae_wave.jpg" alt="Crunchy Sundae Wave">
                <span>Crunchy Sundae Wave</span>
            </button>
            <button class="dessert-option" data-dessert="Chocolate Wave Cake" data-price="119">
                <img src="assets/chocolate_wave_cake.jpg" alt="Chocolate Wave Cake">
                <span>Chocolate Wave Cake</span>
            </button>
            <button class="dessert-option" data-dessert="Apple Pie Crunch" data-price="89">
                <img src="assets/apple_pie_crunch.jpg" alt="Apple Pie Crunch">
                <span>Apple Pie Crunch</span>
            </button>
            <button class="dessert-option" data-dessert="Cinnamon Crunch Donuts" data-price="79">
                <img src="assets/cinnamon_crunch_donuts.jpg" alt="Cinnamon Crunch Donuts">
                <span>Cinnamon Crunch Donuts</span>
            </button>
        `;

        const customizationOptions = `
            <div class="customization-section">
                <h4>Choose Your Beverage</h4>
                <div class="selection-indicator">Tap to choose beverages • ${reqBeverages} required</div>
                <div class="beverage-options">${beverageCards}</div>
            </div>
            ${reqDesserts > 0 ? `
            <div class="customization-section">
                <h4>Choose Your Dessert</h4>
                <div class="selection-indicator">Tap to choose desserts • ${reqDesserts} required</div>
                <div class="dessert-options">${dessertCards}</div>
            </div>` : ``}
        `;

        customModal.innerHTML = `
            <div class="modal-content custom-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Customize Your ${itemName}</h3>
                <p>Base price: ₱${basePrice}</p>
                ${customizationOptions}
                <div class="customization-summary">
                    <p>Total: <span id="customTotal">₱${basePrice}</span></p>
                    <button class="btn-add-custom">Add to Cart</button>
                </div>
            </div>
        `;

        document.body.appendChild(customModal);

        let totalPrice = basePrice;
        const addBtn = customModal.querySelector('.btn-add-custom');
        addBtn.disabled = true;

        const bevMap = new Map();
        const desMap = new Map();
        function sumMap(m){ let s=0; for(const v of m.values()) s+=v; return s; }
        function updateIndicators(){
            const bevInd = customModal.querySelector('.customization-section .selection-indicator');
            if(bevInd) bevInd.textContent = `Tap to choose beverages • ${reqBeverages} required • Selected ${sumMap(bevMap)}/${reqBeverages}`;
            const desSection = customModal.querySelectorAll('.customization-section')[1];
            if(desSection){
                const desInd = desSection.querySelector('.selection-indicator');
                desInd.textContent = `Tap to choose desserts • ${reqDesserts} required • Selected ${sumMap(desMap)}/${reqDesserts}`;
            }
            addBtn.disabled = !((sumMap(bevMap) === reqBeverages) && (reqDesserts === 0 || sumMap(desMap) === reqDesserts));
        }
        function toggleCount(type, name, element){
            const map = type === 'bev' ? bevMap : desMap;
            const req = type === 'bev' ? reqBeverages : reqDesserts;
            const total = sumMap(map);
            const current = map.get(name) || 0;
            if (total < req) {
                map.set(name, current + 1);
                element.classList.add('selected');
            } else if (current > 0) {
                map.set(name, current - 1);
                if (current - 1 === 0) element.classList.remove('selected');
            }
            customModal.querySelector('#customTotal').textContent = `₱${basePrice}`;
            updateIndicators();
        }
        customModal.querySelectorAll('.beverage-option').forEach(option => {
            option.addEventListener('click', function(){
                toggleCount('bev', this.getAttribute('data-beverage'), this);
            });
        });
        customModal.querySelectorAll('.dessert-option').forEach(option => {
            option.addEventListener('click', function(){
                toggleCount('des', this.getAttribute('data-dessert'), this);
            });
        });
        updateIndicators();
        addBtn.addEventListener('click', function() {
            const bevList = [];
            bevMap.forEach((count, name) => { for(let i=0;i<count;i++) bevList.push(name); });
            const desList = [];
            desMap.forEach((count, name) => { for(let i=0;i<count;i++) desList.push(name); });
            const parts = bevList.concat(desList);
            const fullItemName = parts.length > 0 ? `${itemName} with ${parts.join(' & ')}` : itemName;
            addToCart(fullItemName, totalPrice);
            showNotification(`Added ${fullItemName} to your cart!`);
            addCartAnimation(document.querySelector('.cart-icon'));
            customModal.remove();
        });

        // Close modal
        customModal.querySelector('.close-modal').addEventListener('click', function() {
            customModal.remove();
        });

        customModal.addEventListener('click', function(e) {
            if (e.target === customModal) {
                customModal.remove();
            }
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // In a real application, you would send this data to a server
        console.log('Contact form submission:', { name, email, message });
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you soon.');
        
        // Reset form
        this.reset();
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if(email) {
            console.log('Newsletter subscription:', email);
            showNotification('Thanks for subscribing to Crunchave updates!');
            emailInput.value = '';
        }
    });
    
    // Notification function
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if(existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff9a00 0%, #ff5e00 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if(document.body.contains(notification)) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => {
                    notification.remove();
                    style.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Add cart animation function
    function addCartAnimation(button) {
        const cartAnimation = document.createElement('div');
        cartAnimation.className = 'cart-animation';
        cartAnimation.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        document.body.appendChild(cartAnimation);
        
        const rect = button.getBoundingClientRect();
        cartAnimation.style.left = rect.left + rect.width/2 + 'px';
        cartAnimation.style.top = rect.top + 'px';
        
        setTimeout(() => {
            cartAnimation.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            cartAnimation.style.left = window.innerWidth - 100 + 'px';
            cartAnimation.style.top = '20px';
            cartAnimation.style.opacity = '0.5';
            cartAnimation.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                cartAnimation.remove();
            }, 800);
        }, 100);
    }
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if(window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if(window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
        // Add cart animation styles
    const cartAnimationStyle = document.createElement('style');
    cartAnimationStyle.textContent = 
        `.cart-animation {
            position: fixed;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #ff9a00 0%, #ff5e00 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            z-index: 10000;
            pointer-events: none;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .order-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            text-align: left;
        }
        
        .estimated-time {
            background: #fff7ed;
            padding: 15px;
            border-radius: 15px;
            margin: 20px 0;
            text-align: center;
        }
        
        .confirmation-buttons {
            margin-top: 20px;
        }
        
        .btn-close-confirmation {
            background: var(--crunch-gradient);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            width: 100%;
        }
        
        .btn-close-confirmation:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }
        
        .order-confirmation {
            text-align: center;
        }
        
        .btn-confirm-order, .btn-edit-address {
            width: 100%;
            padding: 15px;
            margin: 10px 0;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            border: none;
        }
        
        .btn-confirm-order {
            background: var(--crunch-gradient);
            color: white;
        }
        
        .btn-confirm-order:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }
        
        .btn-edit-address {
            background: #e2e8f0;
            color: var(--text-dark);
        }
        
        .btn-edit-address:hover {
            background: #cbd5e1;
        } `;
    document.head.appendChild(cartAnimationStyle);
        // No canvas generation; cards use static thumbnails
});
