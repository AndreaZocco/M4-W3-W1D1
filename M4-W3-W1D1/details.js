document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://striveschool-api.herokuapp.com/books';
    const params = new URLSearchParams(window.location.search);
    const asin = params.get("id");
    const bookDetailsElement = document.getElementById('book-details');

    fetch(`${apiUrl}/${asin}`)
        .then(response => response.json())
        .then(book => {
            const bookDetailsHTML = `
                <div class="text-center">
                    <h1>${book.title}</h1>
                    <img src="${book.img}" alt="${book.title}" class="img-fluid">
                    <p class="mt-3"><strong>Autore:</strong> ${book.author}</p>
                    <p><strong>Prezzo:</strong> €${book.price}</p>
                    <a href="index.html" class="btn btn-primary">Torna alla ricerca</a>
                </div>
            `;
            bookDetailsElement.innerHTML = bookDetailsHTML;
        })
        .catch(error => {
            console.error('Errore:', error);
            bookDetailsElement.innerHTML = `<p>Si è verificato un errore</p>`;
        });
});