let selectedBook = {}; // Variabile globale per salvare il libro

// Recupera l'ASIN dalla URL
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

if (bookId) {
    fetch(`https://striveschool-api.herokuapp.com/books/${bookId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(book => {
            if (!book || Object.keys(book).length === 0) {
                throw new Error("Libro non trovato o oggetto vuoto");
            }

            selectedBook = book; // Salviamo il libro nella variabile globale

            renderBookDetail(selectedBook); // Chiamata alla funzione per aggiornare il DOM
        })
        .catch(error => {
            console.error("Errore nel caricamento dei dettagli:", error);
            document.body.innerHTML = "<h3 class='text-center mt-5'>Errore nel caricamento del libro</h3>";
        });
} else {
    document.body.innerHTML = "<h2 class='text-center mt-5'>Nessun libro selezionato</h2>";
}



function renderBookDetail(book) {
    const bookDetailContainer = document.getElementById("bookDetailContainer");

    // Generiamo direttamente l'HTML
    bookDetailContainer.innerHTML = `
        <h1 class="text-center">${book.title}</h1>
        <p class="text-center text-secondary">ASIN: ${book.asin}</p>
        <div class="row justify-content-center mt-4">
            <div class="col-md-6 text-center">
                <img class="img-fluid shadow-lg border border-light rounded imageBook" src="${book.img}" alt="${book.title}">
                <p><strong>Prezzo:</strong> €${book.price.toFixed(2)}</p>
                <p><strong>Categoria:</strong> ${book.category || "Non specificata"}</p>
                <button onclick="window.history.back()" class="btn btn-primary">Torna Indietro</button>
            </div>
        </div>
    `;
}