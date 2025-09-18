const { Router } = require("express");

const bookController = require("../controllers/bookController.js");

const bookRouter = Router();

bookRouter.get("/:bookId/details", bookController.getBook);
bookRouter.get("/:bookId/delete", bookController.deleteBook);
bookRouter.get("/new", bookController.newBook);
bookRouter.post("/new", bookController.postNewBook);
bookRouter.get("/:bookId/edit", bookController.editBook);
bookRouter.post("/:bookId/update", bookController.updateBook);
bookRouter.get("/", bookController.getAllBooks);

module.exports = bookRouter;
