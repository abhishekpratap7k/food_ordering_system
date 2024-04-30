document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.getElementById('cart-items');
    const totalPriceDisplay = document.getElementById('total-price');
    const cartQuantityDisplay = document.getElementById('cart-quantity');
    const checkoutButton = document.getElementById('checkout');
    const shoppingDiv = document.querySelector('.shopping'); // Select the shopping div
    const weekday = ["Sun","Mon","Tue","Wed","Thu","fri","Sat"];

    let grandTotal = 0;
    const cart = {}; // Object to store cart items

    addToCartButtons.forEach(button => {
        const loggedIn = sessionStorage.getItem("loggedIn");
        button.addEventListener('click', function () {
            // Boolean(loggedIn);
            console.log(loggedIn);
            if(loggedIn != "true"){
                alert("To add items you must log In");
                const date = new Date(Date.now());
                console.log(date.getDate());
                console.log(weekday[date.getDay()]);
                console.log(date.getHours() + ":"+date.getMinutes() + ":"+date.getSeconds())
                window.location.href = "index.html";
                // console.log(date.getMinutes())
                // console.log(date.getSeconds())
            }
            else if(loggedIn == "true"){
                const item = this.parentElement;
            const itemName = item.querySelector('span:nth-of-type(1)').textContent;
            const itemPrice = parseFloat(item.getAttribute('data-price'));

            // Check if item already exists in cart
            if (cart[itemName]) {
                cart[itemName].quantity++;
            } else {
                cart[itemName] = {
                    price: itemPrice,
                    quantity: 1
                };
            }

            updateCart();


            }
        });
    });

    function updateCart() {
        cartItems.innerHTML = '';
        grandTotal = 0;

        for (const itemName in cart) {
            const item = cart[itemName];
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            const li = document.createElement('li');
            li.innerHTML = `
                <span>${itemName}</span>
                <span>₹${item.price.toFixed(2)}</span>
                <span>${item.quantity}</span>
                <span>₹${itemTotal.toFixed(2)}</span>
                <button class="remove-from-cart" data-item="${itemName}">Remove</button>
            `;
            cartItems.appendChild(li);
        }

        totalPriceDisplay.textContent = `₹${grandTotal.toFixed(2)}`;
        cartQuantityDisplay.textContent = Object.keys(cart).length; // Update cart quantity display

        // Close sidebar if cart is empty
        if (Object.keys(cart).length === 0) {
            toggleSidebar();
        }
    }

    // Function to toggle the sidebar
    function toggleSidebar() {
        var sidebar = document.getElementById('sidebar');
        if (sidebar.style.left =='0px') {
            sidebar.style.left = '-500px'; // Slide the sidebar out of view
        } else {
            sidebar.style.left = '0px'; // Slide the sidebar into view
            activateCartFunctionality(); // Activate cart functionality when sidebar is opened
        }
    }

    // Event delegation for remove buttons
    cartItems.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-from-cart')) {
            const itemName = event.target.getAttribute('data-item');
            if (cart[itemName].quantity > 1) {
                cart[itemName].quantity--; // Decrease quantity by one
            } else {
                delete cart[itemName]; // Remove item from cart if quantity is 1
            }

            updateCart();
        }
    });

    // Checkout functionality
    const checkOut = () => {
        sessionStorage.setItem("orders",JSON.stringify(cart));
        alert("Order placed successfully")
        const date = new Date(Date.now());
        let today = date.getDate();
        let day = weekday[date.getDay()];
        let time = date.getHours() + ":"+date.getMinutes()+":"+date.getSeconds();
        sessionStorage.setItem("time",today+", "+day+", "+time);
        console.log(JSON.parse(sessionStorage.getItem("orders")));
        window.location.href = "index.html";
    }

    checkoutButton.addEventListener('click', checkOut)

    // Activate cart functionality when clicking on the shopping div
    shoppingDiv.addEventListener('click', function () {
        toggleSidebar();
    });
});
