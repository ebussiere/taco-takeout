// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
exports.app = app;
const morgan = require('morgan');
const { webRoutes } = require("./routes/webRoutes");
const menuItemHelpers = require('./db/dbHelpers/menuItemHelpers');
const menuItemFormatter = require("./helperfunctions/menuItemFormatter");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
// Middleware

app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
webRoutes();

app.get("/", (req, res) => {
  menuItemHelpers.getAllMenuItems()
    .then(data => {
      const info = menuItemFormatter.formatMenuItems(data);
      return info;
    })
    .then(data => {
      res.render('index', { menu_items: data });
    })
    .catch(e => {
      res.send(e);
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
