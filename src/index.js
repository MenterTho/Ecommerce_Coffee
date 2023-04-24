const express = require("express");
const app = express();
const morgan = require("morgan");
const hbs = require("express-handlebars");
const port = 3000;
const path = require("path");
const route = require("./routes");
const db = require("./config/db");
const methodOverride = require("method-override");
const moment = require("moment");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
// app use method
app.use(methodOverride("_method"));

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
      // Format ngày của mongoDB
      formatDateHourMin: function (date) {
        return moment(date).format("hh:mm A | DD/MM/YYYY");
      },
      // Cho thứ tự cột
      sum: (a, b) => a + b,
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
