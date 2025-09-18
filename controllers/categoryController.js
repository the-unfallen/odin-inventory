const db = require("../db/queries.js");
const { body, validationResult } = require("express-validator");

const validateCategory = [
    body("new_category")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Category title must contain atleast one letter"),
];

const validateCategoryEdit = [
    body("edit_category")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Category title must contain atleast one letter"),
];

// create category controller
async function createCategory(req, res) {
    res.render("new_category", { title: "New Category" });
}

const saveCategory = [
    validateCategory,
    async (req, res) => {
        const errors = validationResult(req).array();
        const { new_category } = req.body;
        // check if the category title to be added already exists in the database.
        const categoryCheck = await db.checkCategoryName(new_category);
        if (categoryCheck) {
            errors.push({
                msg: "Category title already exists. ",
                param: "new_category",
                location: "body",
            });
        }
        if (errors.length > 0) {
            return res.status(400).render("new_category", {
                title: "New Category",
                errors: errors,
            });
        }

        await db.newCategory(new_category);
        res.redirect("/categories");
    },
];

// update category controller
async function editCategory(req, res) {
    const { categoryId } = req.params;
    const subjectCategory = await db.viewCategory(categoryId);
    res.render("edit_category", {
        title: "Edit Category",
        category: subjectCategory,
    });
}

const updateCategory = [
    validateCategoryEdit,
    async (req, res) => {
        const { categoryId } = req.params;
        const errors = validationResult(req).array();
        const { edit_category } = req.body;
        // check if the category title to be added already exists in the database.
        const categoryCheck = await db.checkCategoryName(edit_category);
        if (categoryCheck) {
            errors.push({
                msg: "Category title already exists. ",
                param: "edit_category",
                location: "body",
            });
        }
        if (errors.length > 0) {
            const subjectCategory = await db.viewCategory(categoryId);
            return res.status(400).render("edit_category", {
                title: "Edit Category",
                errors: errors,
                category: subjectCategory,
            });
        }
        await db.updateCategory(categoryId, edit_category);
        res.redirect("/categories");
    },
];
// read category controller
async function readAllCategories(req, res) {
    const categoryList = await db.readCategories();
    res.render("all_categories", {
        title: "All Categories",
        categories: categoryList,
        errorTarget: null,
    });
}
// delete category controller

async function deleteCategory(req, res) {
    const { categoryId } = req.params;

    // check the number of books within category
    const bookCount = await db.numberOfBooksInACategory(categoryId);
    let errorMessage;

    if (bookCount > 0) {
        if (bookCount === 1) {
            errorMessage = `There is still a book attached to this category`;
        } else {
            errorMessage = `There are still ${bookCount} book(s) attached to this category`;
        }
        const categoryList = await db.readCategories();
        const categoryIdNumber = Number(categoryId);
        res.render("all_categories", {
            title: "All Categories",
            categories: categoryList,
            errorTarget: categoryIdNumber,
            errorMsg: errorMessage,
            // errors: errorArray,
        });
        // return;
    } else {
        await db.deleteCategory(categoryId);
        res.redirect("/categories");
    }
}

async function viewBooksInCategory(req, res) {
    const { categoryId } = req.params;
    // check if categoryId exist
    const categoriesIdCheck = await db.checkCategoriesId(categoryId);
    if (categoriesIdCheck) {
        const booksInThisCategory = await db.booksInCategory(categoryId);
        return res.render("view_books_in_category", {
            title: "Books in Category",
            booksInCategory: booksInThisCategory,
        });
    } else {
        const errors = [
            {
                msg: "CategoryId Does not exist",
                param: "Books in Category",
                location: "body",
            },
        ];

        return res.status(400).render("view_books_in_category", {
            title: "Books in Category",
            errors: errors,
            booksInCategory: [],
        });
    }
}

module.exports = {
    readAllCategories,
    createCategory,
    saveCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    viewBooksInCategory,
};
