const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS-SHELF';

const someCheckbox = document.getElementById('checkSelesai');
const spanText = document.getElementById('spanText');

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    });
    someCheckbox.addEventListener('change', (e) => {
        if (e.target.checked === true) {
            spanText.innerHTML = 'Selesai dibaca';
        }
        if (e.target.checked === false) {
            spanText.innerHTML = 'Belum selesai dibaca';
        }
    });
});

const addBook = () => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isCompleted = document.getElementById('checkSelesai').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, title, author, year, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const makeBook = (bookObject) => {

    const { id, title, author, year, isCompleted } = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${year}`;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);
    container.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum selesai di Baca';
        undoButton.classList.add('green');

        undoButton.addEventListener('click', () => {
            undoBookFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus buku';
        trashButton.classList.add('red');

        undoButton.addEventListener('click', () => {
            removeBookFromCompleted(id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');

        actionButton.append(undoButton, trashButton);
        container.append(actionButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Selesai dibaca';
        checkButton.classList.add('green');

        checkButton.addEventListener('click', () => {
            addBookCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus buku';
        trashButton.classList.add('red');

        trashButton.addEventListener('click', () => {
            removeBookFromUncompleted(id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');

        actionButton.append(checkButton, trashButton);
        container.append(actionButton);
    }

    return container;
}

const generateId = () => +new Date();

const generateBookObject = (id, title, author, year, isCompleted) => {
    return {
        id, title, author, year, isCompleted
    }
}

const addBookCompleted = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const undoBookFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const removeBookFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const removeBookFromUncompleted = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const findBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) return index;
    }
    return -1;
}

const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id == bookId) return bookItem;
    }
    return null;
}

document.addEventListener(RENDER_EVENT, () => {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        console.log(bookItem);
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }
    }
});