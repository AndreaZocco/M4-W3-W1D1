document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://striveschool-api.herokuapp.com/books';
    const booksElement = document.getElementById('books');
    const searchInput = document.getElementById('searchInput');
    const cartElement = document.getElementById('cart');
    const clearCartButton = document.getElementById('clearCart');
    let cart = [];

    function fetchBooks() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                renderBooks(data);
                updateCartCount();
            })
            .catch(error => console.error('Error:', error));
    }

    function renderBooks(books) {
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchInput.value.toLowerCase()));
        booksElement.innerHTML = '';
        filteredBooks.forEach(book => {
            const bookHTML = `<div class="col-md-4 mb-3">
                <div class="card" style="${cart.find(item => item.asin === book.asin) ? 'border: 2px solid green;' : ''}">
                    <img src="${book.img}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <button class="btn btn-primary add-to-cart" data-asin="${book.asin}">Aggiungi al carrello</button>
                        <button class="btn btn-secondary skip-book">Salta</button>
                        <button class="btn btn-info go-to-details" data-asin="${book.asin}">Dettagli</button>
                    </div>
                </div>
            </div>`;
            booksElement.insertAdjacentHTML('beforeend', bookHTML);
        });
    
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    
        document.querySelectorAll('.skip-book').forEach(button => {
            button.addEventListener('click', function(event) {
                event.target.closest('.col-md-4.mb-3').remove();
            });
        });
    
        document.querySelectorAll('.go-to-details').forEach(button => {
            button.addEventListener('click', function(event) {
                const asin = event.target.getAttribute('data-asin');
                window.location.href = `dettagli.html?id=${asin}`;
            });
        });
    }


    function addToCart(event) {
        const asin = event.target.getAttribute('data-asin');
        fetch(`${apiUrl}/${asin}`)
            .then(response => response.json())
            .then(book => {
                if (!cart.find(item => item.asin === book.asin)) {
                    cart.push(book);
                    updateCartUI();
                    updateCartCount();
                    event.target.closest('.card').style.border = '2px solid green';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        cartCountElement.innerText = cart.length.toString();
    }

    function updateCartUI() {
        cartElement.innerHTML = '';
        cart.forEach(book => {
            const cartItemHTML = `<li class="list-group-item d-flex justify-content-between align-items-center">
                ${book.title}
                <button class="btn btn-danger remove-from-cart" data-asin="${book.asin}">X</button>
            </li>`;
            cartElement.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }


    function removeFromCart(event) {
        const asin = event.target.getAttribute('data-asin');
        cart = cart.filter(book => book.asin !== asin);
        updateCartUI();
        updateCartCount();
    
        const cardElement = document.querySelector(`.add-to-cart[data-asin="${asin}"]`);
        if (cardElement) {
            cardElement.closest('.card').style.border = '';
        }
    }

    searchInput.addEventListener('keyup', () => {
        if (searchInput.value.length > 3 || searchInput.value.length === 0) {
            fetchBooks();
        }
    });

    clearCartButton.addEventListener('click', () => {
        cart = [];
        updateCartUI();
        updateCartCount();
        document.querySelectorAll('.card').forEach(card => {
            card.style.border = '';
        });
    });

    fetchBooks();
});

