
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
    const sidebarButton = document.getElementById("toggleSidebar");

    if (index === -1) { 
        cartItemsArray.push(book);
        cartButton.classList.replace("btn-success", "btn-danger");
        cardElement.classList.add("border-success");
    } else {
        cartItemsArray.splice(index, 1);
        cartButton.classList.replace("btn-danger", "btn-success");
        cardElement.classList.remove("border-success");
    }

    sidebarButton.classList.toggle("btn-warning", cartItemsArray.length > 0);
    renderCart();
}



// generiamo dinamicamente le card dei libri e le aggiungiamo al DOM , all'inerno di bookContainer
// Modifica `renderBooks` per gestire il click sul bottone del carrello
function renderBooks(allBooks) {
    bookContainer.innerHTML = ""; // Svuota il contenitore prima di aggiungere nuovi elementi

    const elements = allBooks.map(severino => {
        const col = document.createElement("div");
        col.className = "col-auto col-lg-3 col-md-4 col-sm-6 mt-4";

        const card = document.createElement("div");
        card.className = "cardBook shadow-lg position-relative overflow-hidden";

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
        buttonContainer.className = "d-flex justify-content-end mb-0 gap-2";

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

    // Resetta i bottoni del carrello
    document.querySelectorAll(".btn-cart").forEach(button => 
        button.classList.replace("btn-danger", "btn-success")
    );

    // Rimuove il bordo verde dalle card
    document.querySelectorAll(".cardBook").forEach(card => 
        card.classList.remove("border-success")
    );

    // Rimuove la classe btn-warning dalla sidebar
    document.getElementById("toggleSidebar").classList.remove("btn-warning");

    renderCart(); // Aggiorna la UI
});


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
    tBody.innerHTML = ""; // Svuota la tabella prima di riempirla

    const rows = cartItemsArray.map((book, index) => {
        const row = document.createElement("tr");
        row.className = "sidebar-row";

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;

        const priceCell = document.createElement("td");
        priceCell.textContent = `€${book.price.toFixed(2)}`;

        const removeCell = document.createElement("td");

        const removeButton = document.createElement("button");
        removeButton.className = "btn btn-sm btn-danger remove-item";
        removeButton.dataset.index = index;
        removeButton.innerHTML = '<i class="bi bi-trash3"></i>';

        // Event listener per rimuovere un elemento dal carrello
        removeButton.addEventListener("click", function () {
            const removedBook = cartItemsArray.splice(index, 1)[0]; // Rimuove il libro dal carrello
            renderCart(); // Aggiorna la UI del carrello

            // Trova la card corrispondente e aggiorna il bottone carrello
            document.querySelectorAll(".bookImage").forEach(img => {
                if (img.alt === removedBook.title) {
                    const card = img.closest(".cardBook");
                    const cartButton = card.querySelector(".btn-cart");
                    cartButton.classList.replace("btn-danger", "btn-success");
                    card.classList.remove("border-success");
                }
            });
        });

        // Costruzione della riga
        removeCell.appendChild(removeButton);
        row.append(titleCell, priceCell, removeCell);

        return row;
    });

    tBody.append(...rows); // Aggiunge tutte le righe con un'unica operazione

    // Aggiorna il totale
    document.getElementById("totalItems").textContent = cartItemsArray.length;
    document.getElementById("totalPrice").textContent = cartItemsArray
        .reduce((sum, book) => sum + book.price, 0)
        .toFixed(2);
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
