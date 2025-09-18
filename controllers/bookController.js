const db = require("../db/queries.js");
const { body, validationResult } = require("express-validator");
const customNotFoundError = require("../errors/customNotFoundError.js");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 400 characters";
const d = new Date();
let year = d.getFullYear();

const validateBook = [
    body("book_title")
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage(`Book Title ${lengthErr}`),
    body("book_author")
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage(`Book Author name ${lengthErr}`),
    body("book_publisher")
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage(`Book Publisherrs ${lengthErr}`),
    body("book_published_year")
        .isInt({ min: 1, max: year })
        .withMessage(`Published year must be an integer within 1 and ${year}`),
    body("book_pages")
        .isInt({ min: 1 })
        .withMessage(`Pages must be an integer`),
    body("book_category")
        .isInt({ min: 1 })
        .withMessage(`Book Category must be an integer`),
];

async function getAllBooks(req, res) {
    const myBooks = await db.allBooks();
    if (myBooks.length === 0) {
        throw new customNotFoundError("Books not found!");
        return;
    }
    // res.send(myBooks);
    res.render("all_books", { allBooks: myBooks });
}

async function getBook(req, res) {
    const { bookId } = req.params;
    const myBook = await db.viewBook(bookId);
    if (myBook.length === 0) {
        throw new customNotFoundError("Book not found!");
        return;
    }
    res.render("view_book", { book: myBook, title: "Book Details" });
}

async function deleteBook(req, res) {
    const { bookId } = req.params;
    await db.deleteBook(bookId);
    res.redirect("/books");
}

async function newBook(req, res) {
    const categoryList = await db.readCategories();
    res.render("new_book", {
        categories: categoryList,
        title: "New Book",
    });
}

const postNewBook = [
    validateBook,
    async (req, res) => {
        const categoryList = await db.readCategories();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("new_book", {
                title: "New Book",
                errors: errors.array(),
                categories: categoryList,
            });
        }

        const {
            book_title,
            book_author,
            book_publisher,
            book_published_year,
            book_pages,
            book_category,
        } = req.body;
        // check if book_category is valid.
        const categoriesExist = await db.checkCategoriesId(book_category);
        if (!categoriesExist) {
            return res.status(400).render("new_book", {
                title: "New Book",
                errors: [{ msg: "Category does not exist" }],
                categories: categoryList,
            });
        }
        await db.newBook(
            book_title,
            book_author,
            book_published_year,
            book_publisher,
            book_pages,
            book_category
        );
        res.redirect("/books");
    },
];

async function editBook(req, res) {
    const { bookId } = req.params;
    const myBook = await db.viewBook(bookId);
    const categoryList = await db.readCategories();
    res.render("edit_book", {
        title: "Edit Book",
        book: myBook,
        categories: categoryList,
    });
}

const updateBook = [
    validateBook,
    async (req, res) => {
        const { bookId } = req.params;
        const categoryList = await db.readCategories();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const myBook = await db.viewBook(bookId);
            return res.status(400).render("edit_book", {
                title: "Edit Book",
                errors: errors.array(),
                categories: categoryList,
                book: myBook,
            });
        }

        const {
            book_title,
            book_author,
            book_publisher,
            book_published_year,
            book_pages,
            book_category,
        } = req.body;
        // check if book_category is valid.
        const categoriesExist = await db.checkCategoriesId(book_category);
        if (!categoriesExist) {
            return res.status(400).render("edit_book", {
                title: "Edit Book",
                errors: [{ msg: "Category does not exist" }],
                categories: categoryList,
            });
        }
        await db.updateBooks(
            book_title,
            book_author,
            book_published_year,
            book_publisher,
            book_pages,
            book_category,
            bookId
        );

        // async function updateBooks(
        //     title,
        //     author,
        //     published_year,
        //     publisher,
        //     pages,
        //     category,
        //     id
        // )
        const updatedBook = res.redirect(`/books/${bookId}/details`);
    },
];

module.exports = {
    getAllBooks,
    getBook,
    deleteBook,
    newBook,
    postNewBook,
    updateBook,
    editBook,
};
