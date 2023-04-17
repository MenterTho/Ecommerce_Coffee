const express = require("express");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const app = express();
const port = 3000;
const path = require("path");
const route = require("./routes");
const db = require("./config/db");
const session = require("express-session");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const moment = require("moment");

// app use method
app.use(methodOverride("_method"));

// app use session
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

// app use express
app.use(express.json());

// HTTP Logger
// app.use(morgan("combined"));
// Template engine
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
    helpers: {
      // Mã hóa mật khẩu
      hashPassword: function (password) {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        return hashedPassword;
      },
      // Format ngày của mongoDB
      formatDate: function (date) {
        return moment(date).format("DD/MM/YYYY");
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Router init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
