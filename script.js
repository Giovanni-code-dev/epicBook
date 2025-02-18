const baseUrl = 'https://striveschool-api.herokuapp.com/books';
const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const sidebarButton = document.getElementById("toggleSidebar");
const sidebarContainer = document.getElementById("sidebarContainer");

let allBooks = [];
let cartItemsArray = [];

// Funzione per recuperare i dati dall'API
function fetchBooks() {
    fetch(baseUrl)
        .then(response => response.json())
        .then((books) => {
            allBooks = books;
            renderBooks(allBooks);
        })
        .catch(error => console.error("Errore nel recupero dei dati:", error));
}

// Funzione per aggiungere/rimuovere un libro dal carrello
function toggleCartItem(book, cartButton, cardElement) {
    const index = cartItemsArray.findIndex(item => item.title === book.title);

    if (index === -1) {
        cartItemsArray.push(book);
        cartButton.classList.replace("btn-success", "btn-warning");
        cardElement.classList.add("border-success");
    } else {
        cartItemsArray.splice(index, 1);
        cartButton.classList.replace("btn-warning", "btn-success");
        cardElement.classList.remove("border-success");
    }

    updateCartCount();
    renderCart();
}

// Funzione per generare le card dei libri
function renderBooks(books) {
    bookContainer.innerHTML = "";

    const elements = books.map(book => {
        const col = document.createElement("div");
        col.className = "col-lg-3 col-md-4 p-2";

        const card = document.createElement("div");
        card.className = "cardBook shadow-lg position-relative overflow-hidden";

        const img = document.createElement("img");
        img.src = book.img;
        img.alt = book.title;
        img.className = "card-img-top img-fluid bookImage";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body position-absolute bottom-0 start-0 w-100 text-white text-center p-0";

        const title = document.createElement("p");
        title.className = "responsiveText mb-0";
        title.textContent = book.title;

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "d-flex justify-content-evenly align-items-center mb-1 gap-2";

        const detailsButton = document.createElement("button");
        detailsButton.className = "btn btn-primary";
        detailsButton.innerHTML = '<i class="bi bi-info-circle-fill fs-5"></i>';

        const cartButton = document.createElement("button");
        cartButton.className = "btn btn-success btn-cart";
        cartButton.innerHTML = '<i class="bi bi-cart-fill fs-5"></i>';

        const dismissButton = document.createElement("button");
        dismissButton.className = "btn btn-danger";
        dismissButton.innerHTML = '<i class="bi bi-x-circle-fill fs-5"></i>';

        // Evento per aggiungere/rimuovere dal carrello
        cartButton.addEventListener("click", () => {toggleCartItem(book, cartButton, card);});

        // Evento per rimuovere la card dalla UI
        dismissButton.addEventListener("click",  () => {removeBook(book);});

        // Evento per aprire la pagina dei dettagli con l'ASIN come parametro
        detailsButton.addEventListener("click", () => {window.location.href = `dettagli.html?id=${book.asin}`;});

        buttonContainer.append(detailsButton, cartButton, dismissButton);
        cardBody.append(title, buttonContainer);
        card.append(img, cardBody);
        col.append(card);

        return col;
    });

    bookContainer.append(...elements);

}



// Funzione per rimuovere una card dal DOM e dall'array allBooks
function removeBook(book) {
    // Rimuove il libro dalla lista allBooks
    allBooks = allBooks.filter(item => item.title !== book.title);

    // Ricarica il contenuto della pagina senza il libro rimosso
    renderBooks(allBooks);
}

function updateCartCount() {
    cartCount.textContent = cartItemsArray.length;

    // Seleziona il bottone che apre il modale
    const cartButton = document.getElementById("cartButton");

    // Usa toggle per gestire le classi dinamicamente, senza condizioni extra
    cartButton.classList.toggle("btn-warning", cartItemsArray.length > 0);
    cartButton.classList.toggle("btn-success", cartItemsArray.length === 0);
}



// Event listener per aprire il modale carrello
cartButton.addEventListener("click", function () {
    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    cartModal.show();
});

// Funzione per svuotare il carrello e ripristinare i bottoni delle card
document.getElementById("clearCart").addEventListener("click", function () {
    cartItemsArray = []; // Svuota l'array del carrello
    updateCartCount();
    renderCart();

    // Ripristina i bottoni delle card (da rosso a verde) e rimuove il bordo verde
    document.querySelectorAll(".btn-cart").forEach(button =>
        button.classList.replace("btn-warning", "btn-success")
    );
    document.querySelectorAll(".cardBook").forEach(card =>
        card.classList.remove("border-success")
    );
});

// Funzione per mostrare il carrello nel modale
// Funzione per mostrare il carrello nel modale
function renderCart() {
    const tBody = document.getElementById("cartItems");
    tBody.innerHTML = "";

    cartItemsArray.forEach((book, index) => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;

        const priceCell = document.createElement("td");
        priceCell.textContent = `€${book.price.toFixed(2)}`;

        const removeCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.className = "btn btn-sm btn-danger";
        removeButton.innerHTML = '<i class="bi bi-trash3"></i>';

        // Evento per rimuovere un elemento dal carrello
        removeButton.addEventListener("click", function () {
            const removedBook = cartItemsArray.splice(index, 1)[0]; // Rimuove il libro dal carrello
            renderCart(); // Aggiorna la UI del carrello
            updateCartCount(); // Aggiorna il numero nel bottone carrello

            // Trova la card corrispondente e aggiorna il bottone carrello
            document.querySelectorAll(".bookImage").forEach(img => {
                if (img.alt === removedBook.title) {
                    const card = img.closest(".cardBook");
                    const cartButton = card.querySelector(".btn-cart");
                    cartButton.classList.replace("btn-warning", "btn-success");
                    card.classList.remove("border-success");
                }
            });
        });

        removeCell.appendChild(removeButton);
        row.append(titleCell, priceCell, removeCell);
        tBody.appendChild(row);
    });

    document.getElementById("totalItems").textContent = cartItemsArray.length;
    document.getElementById("totalPrice").textContent = cartItemsArray
        .reduce((sum, book) => sum + book.price, 0)
        .toFixed(2);
}


// Funzione per filtrare i libri con la barra di ricerca
function filterBooks() {
    const query = searchInput.value.toLowerCase();

    if (query.length >= 3) {
        const filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(query));
        renderBooks(filteredBooks);
    } else {
        renderBooks(allBooks);
    }
}

// Event listener per attivare la ricerca dopo 3 caratteri digitati
searchInput.addEventListener("keyup", filterBooks);

// Event listener per aprire/chiudere la sidebar (anche se è vuota)
sidebarButton.addEventListener("click", function () {
    sidebarContainer.classList.toggle("open");
});

// Avvia il fetch dei libri al caricamento della pagina
fetchBooks();