const { Router } = require("express");
const categoryController = require("../controllers/categoryController.js");

const categoryRouter = Router();

categoryRouter.get("/", categoryController.readAllCategories);
categoryRouter.get("/new", categoryController.createCategory);
categoryRouter.post("/new", categoryController.saveCategory);
categoryRouter.get("/:categoryId/edit", categoryController.editCategory);
categoryRouter.post("/:categoryId/update", categoryController.updateCategory);
categoryRouter.get("/:categoryId/delete", categoryController.deleteCategory);
categoryRouter.get(
    "/viewbooksinCategory/:categoryId",
    categoryController.viewBooksInCategory
);

module.exports = categoryRouter;
