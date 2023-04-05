const express = require("express");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const app = express();
const port = 3000;
const path = require("path");
const route = require("./routes");
const db = require("./config/db");
const session = require("express-session");

app.use(
  session({
    secret: "001", // Chuỗi bí mật để mã hóa session ID, có thể tự chọn
    resave: false,
    saveUninitialized: true,
  })
);

// Connect DB
db.connect();

// Lấy ảnh (img/logo.png)
app.use(express.static(path.join(__dirname, "public")));
// Middleware xử lý từ form submit
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// HTTP Logger
// app.use(morgan("combined"));
// Template engine
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Router init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
