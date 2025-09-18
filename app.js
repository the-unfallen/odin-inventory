const express = require("express");
const path = require("path");
const app = express();
const assetsPath = path.join(__dirname, "public");
// const indexRouter = require("./routes/indexRouter.js");
const bookRouter = require("./routes/bookRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));

app.use("/{categories}", categoryRouter);
app.use("/books", bookRouter);
// app.use("/", indexRouter);

PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.error("Error while starting the server: ", error);
        process.exit(1); //Optional: stop the process if server fails to start
    }
    console.log(`Express app is live on port: ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});
