function loadHomePage(req, res) {
    res.render("home", { title: "Home Page" });
}

module.exports = { loadHomePage };
