const pool = require("./pool.js");

// create category
async function newCategory(categoryName) {
    await pool.query("INSERT INTO categories (name) VALUES ($1)", [
        categoryName,
    ]);
}

// read categories
async function readCategories() {
    const result = await pool.query(`
        SELECT c.name AS category_name,
            c.id AS category_id,
            COUNT(B.ID) AS books_count
        FROM categories c
        LEFT JOIN books b
            ON b.category = c.id
        GROUP BY c.name, c.id
        ORDER BY c.name
    `);
    return result.rows;
}

// get categories Id
async function getCategoriesId() {
    const result = await pool.query("SELECT id FROM categories");
    return result.rows;
}

// check categories Id
async function checkCategoriesId(cat_id) {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
        cat_id,
    ]);
    if (result.rowCount > 0) {
        return true;
    } else {
        return false;
    }
}

// check categories Name
async function checkCategoryName(cat_name) {
    const result = await pool.query(
        "SELECT * FROM categories WHERE name = $1",
        [cat_name]
    );
    if (result.rowCount > 0) {
        return true;
    } else {
        return false;
    }
}

// update categories
async function updateCategory(categoryId, newName) {
    await pool.query("UPDATE categories SET name = $1 WHERE id = $2", [
        newName,
        categoryId,
    ]);
}

// delete categories
async function deleteCategory(categoryId) {
    await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);
}

// create books
async function newBook(
    title,
    author,
    published_year,
    publisher,
    pages,
    category
) {
    await pool.query(
        "INSERT INTO books (title, author, published_year, publisher, pages, category) VALUES ($1, $2, $3, $4, $5, $6)",
        [title, author, published_year, publisher, pages, category]
    );
}

// read books
async function allBooks() {
    const result = await pool.query(
        `SELECT 
            books.id AS book_id, 
            books.title, books.author, 
            books.published_year, 
            books.publisher, 
            books.pages, 
            categories.name AS category_title 
        FROM books 
        JOIN categories 
            ON books.category = categories.id 
        ORDER BY books.title`
    );
    return result.rows;
}

// get Books In Category
async function booksInCategory(categoryId) {
    const result = await pool.query(
        `
        SELECT 
            books.id AS book_id, 
            books.title, books.author, 
            books.published_year, 
            books.publisher, 
            books.pages, 
            categories.name AS category_title 
        FROM books
        JOIN categories 
            ON books.category = categories.id
        WHERE books.category = $1 
        ORDER BY books.title 
        `,
        [categoryId]
    );
    return result.rows;
}

// update books
async function updateBooks(
    title,
    author,
    published_year,
    publisher,
    pages,
    category,
    book_id
) {
    await pool.query(
        "UPDATE books SET title = $1, author = $2, published_year = $3, publisher = $4, pages = $5, category = $6 WHERE id = $7",
        [title, author, published_year, publisher, pages, category, book_id]
    );
}

// delete books
async function deleteBook(bookId) {
    await pool.query("DELETE FROM books WHERE id = $1", [bookId]);
}

// view book
async function viewBook(bookId) {
    const result = await pool.query(
        "SELECT books.id AS book_id, books.title, books.author, books.published_year, books.publisher, books.pages, categories.id AS category_id, categories.name AS category_title FROM books JOIN categories ON books.category = categories.id WHERE books.id = $1",
        [bookId]
    );
    return result.rows[0];
}

// Number of books in a category
async function numberOfBooksInACategory(cat_id) {
    const result = await pool.query("SELECT * FROM books WHERE category = $1", [
        cat_id,
    ]);
    return result.rowCount;
}

async function viewCategory(cat_Id) {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
        cat_Id,
    ]);
    return result.rows[0];
}

module.exports = {
    newCategory,
    readCategories,
    updateCategory,
    deleteCategory,
    newBook,
    allBooks,
    updateBooks,
    deleteBook,
    viewBook,
    getCategoriesId,
    checkCategoriesId,
    checkCategoryName,
    viewCategory,
    numberOfBooksInACategory,
    booksInCategory,
};
