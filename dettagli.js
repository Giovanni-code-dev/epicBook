// Recupera l'ASIN dalla URL
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

if (bookId) {
    fetch(`https://striveschool-api.herokuapp.com/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            document.getElementById("bookTitle").textContent = book.title;
            document.getElementById("bookAsin").textContent = `ASIN: ${book.asin}`;
            document.getElementById("bookImage").src = book.img;
            document.getElementById("bookPrice").textContent = book.price.toFixed(2);
            document.getElementById("bookCategory").textContent = book.category || "Non specificata";
        })
        .catch(error => console.error("Errore nel caricamento dei dettagli:", error));
} else {
    document.body.innerHTML = "<h2 class='text-center mt-5'>Nessun libro selezionato</h2>";
}