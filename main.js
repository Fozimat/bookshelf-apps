const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS-SHELF';

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
        resetForm();
    });
    const checkBox = document.getElementById('checkSelesai');
    checkBox.addEventListener('change', (ev) => {
        isChecked(ev);
    });
    if (isStorageExist()) {
        loadBookFromStorage();
    }
});

const saveBook = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert("Browser tidak mendukung");
        return false;
    }
    return true;
}

const loadBookFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data != null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const isChecked = (ev) => {
    const spanText = document.getElementById('spanText');
    if (ev.target.checked === true) {
        spanText.innerText = 'Selesai dibaca';
    }
    if (ev.target.checked === false) {
        spanText.innerText = 'Belum selesai dibaca';
    }
}

const resetForm = () => {
    const input = document.querySelectorAll('#title, #author, #year');
    const check = document.getElementById('checkSelesai');
    input.forEach(input => {
        input.value = '';
    });
    check.checked = false;
}

const addBook = () => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isCompleted = document.getElementById('checkSelesai').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, title, author, year, isCompleted);
    books.push(bookObject);
    alertBox('ditambahkan');
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBook();
}

const alertBox = (pesan) => {
    alert(`Buku berhasil ${pesan}`);
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

        trashButton.addEventListener('click', () => {
            removeBook(id);
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
            removeBook(id);
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

    alertBox('ditandai selesai dibaca');
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBook();
}

const undoBookFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    alertBox('ditandai belum dibaca');

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBook();
}

const removeBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    const remove = confirm('Apakah anda yakin ingin menghapus buku?');
    if (remove) {
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        alertBox('dihapus');
    }
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBook();
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

const renderBooks = () => {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }
    }
}

document.addEventListener(RENDER_EVENT, () => {
    renderBooks();
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
})