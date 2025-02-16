const baseUrl = 'https://striveschool-api.herokuapp.com/books';
const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let allBooks = []; // variabile globale per salvare tutti i libri
let cartItemsArray = []; // Array globale per salvare i libri nel carrello

// funzione per recuperare fare fetch API
function fetchBooks() {
    fetch(baseUrl) // richiesta http API
        .then(response => response.json()) // convertiamo la risposta in JSON
        .then((malachia) => { // seconda promise per response.json() malachia ora è un array di oggetti libro 
            allBooks = malachia; // salva i dati globalmente in allBooks
            renderBooks(allBooks); // mostra tutti i libri inizialmente sulla pagina zebbe
        })
        .catch(error => console.error("Houston, we have a problem! With code:", error));
}

// Funzione per aggiungere/rimuovere un libro dal carrello
function toggleCartItem(book, cartButton, cardElement) {
    const index = cartItemsArray.findIndex(item => item.title === book.title);

    if (index === -1) { 
        // Se il libro non è nel carrello, lo aggiunge
        cartItemsArray.push(book);
        cartButton.classList.add("btn-danger"); // Cambia colore al bottone per indicare che è nel carrello
        cardElement.classList.add("border-success"); // Cambia bordo alla card
    } else {
        // Se il libro è già nel carrello, lo rimuove
        cartItemsArray.splice(index, 1);
        cartButton.classList.remove("btn-danger");
        cardElement.classList.remove("border-success");
    }

    renderCart(); // Aggiorna la UI del carrello
}

// generiamo dinamicamente le card dei libri e le aggiungiamo al DOM , all'inerno di bookContainer
// Modifica `renderBooks` per gestire il click sul bottone del carrello
function renderBooks(allBooks) {
    bookContainer.innerHTML = ""; // Svuota il contenitore prima di aggiungere nuovi elementi

    const elements = allBooks.map(severino => {
        const col = document.createElement("div");
        col.className = "col-auto col-lg-3 col-md-4 col-sm-6 mt-4";

        const card = document.createElement("div");
        card.className = "card shadow-lg position-relative overflow-hidden";

        const img = document.createElement("img");
        img.src = severino.img;
        img.alt = severino.title;
        img.className = "card-img-top img-fluid bookImage";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body position-absolute bottom-0 start-0 w-100 text-white text-center p-0";

        const title = document.createElement("p");
        title.className = "responsiveText mb-0";
        title.textContent = severino.title;

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "d-flex justify-content-between mb-0 gap-2";

        const cartButton = document.createElement("button");
        cartButton.className = "btn btn-success btn-cart";
        cartButton.innerHTML = '<i class="bi bi-cart-fill fs-5"></i>';

        const detailsButton = document.createElement("button");
        detailsButton.className = "btn btn-primary";
        detailsButton.innerHTML = '<i class="bi bi-info-circle-fill fs-5"></i>';

        // Event listener per aggiungere al carrello
        cartButton.addEventListener("click", function () {
            toggleCartItem(severino, cartButton, card);
        });

        // Costruzione della card
        buttonContainer.append(cartButton, detailsButton);
        cardBody.append(title, buttonContainer);
        card.append(img, cardBody);
        col.append(card);

        return col;
    });

    bookContainer.append(...elements); // Aggiunge tutti gli elementi con un'unica operazione
}

// Event listener per svuotare il carrello
document.getElementById("clearCart").addEventListener("click", function () {
    cartItemsArray = []; // Svuota l'array
    renderCart(); // Aggiorna la UI
});
/*
// funzione per filtrare i libri
function filterBooks() {
    const query = searchInput.value.toLowerCase();
    const filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(query));
    renderBooks(filteredBooks);
}

// event listener per attivare la ricerca dopo 3 keyup
let keyupCount = 0;
searchInput.addEventListener("keyup", function () {
    keyupCount++;
    if (keyupCount === 3) {
        filterBooks();
        keyupCount = 0; 
    }
}); */

// funzione per filtrare i libri
function filterBooks() {
    const query = searchInput.value.toLowerCase();

    if (query.length >= 3) { // Esegue il filtro solo se il testo ha più di 3 caratteri
        const filteredBooks = allBooks.filter(malachia => malachia.title.toLowerCase().includes(query));
        renderBooks(filteredBooks);
    }
    else {
        renderBooks(allBooks)
    }
}

// event listener per attivare la ricerca dopo 3 keyup
searchInput.addEventListener("keyup", filterBooks);

function renderCart() {
    const tBody = document.getElementById("cartItems");
    const totalItems = document.getElementById("totalItems");
    const totalPrice = document.getElementById("totalPrice");

    tBody.innerHTML = ""; // Svuota la tabella prima di riempirla
    let total = 0;

    // Usa map() per creare le righe della tabella
    const rows = cartItemsArray.map((book, index) => {
        const row = document.createElement("tr");
        row.classList.add("sidebar-row")
        row.innerHTML = `
            <td>${book.title}</td>
            <td>€${book.price.toFixed(2)}</td>
            <td><button class="btn btn-sm btn-danger remove-item" data-index="${index}"><i class="bi bi-trash3"></i></button></td>
        `;
        total += book.price;
        return row; // Restituisce la riga creata
    });

    // Aggiunge tutte le righe in un'unica operazione
    tBody.append(...rows);

    totalItems.textContent = cartItemsArray.length;
    totalPrice.textContent = total.toFixed(2);

    // Aggiunge gli event listener ai pulsanti di rimozione
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            const removedBook = cartItemsArray[index]; // Ottieni il libro rimosso
            cartItemsArray.splice(index, 1);
            renderCart();

            // 🔹 Trova la card corrispondente e aggiorna il bottone carrello
            const bookCards = document.querySelectorAll(".bookImage");
            bookCards.forEach(img => {
                if (img.alt === removedBook.title) {
                    const card = img.closest(".card");
                    const cartButton = card.querySelector(".btn-cart");
                    cartButton.classList.remove("btn-danger"); // Torna verde
                    cartButton.classList.add("btn-success");
                    card.classList.remove("border-success"); // Rimuove bordo verde
                }
            });
        });
    });
}


//sidebar
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebarContainer = document.getElementById("sidebarContainer");

// Apri/chiudi la sidebar con un solo bottone
toggleSidebar.addEventListener("click", function () {
    sidebarContainer.classList.toggle("open");
});

// esegui fetchBooks() per popolare `allBooks`
fetchBooks();
