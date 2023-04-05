const User = require("../models/User");
const { mongooseToObject } = require("../../util/mongoose");
class LoginController {
  // [GET] /login_form
  login(req, res) {
    const title = "Login";
    res.render("login_form", {
      title,
      layout: "login",
    });
  }

  // [GET] /login/signUp
  signUp(req, res) {
    const title = "Sign Up";
    res.render("signup_form", { title, layout: "login" });
  }

  // [POST] /login/postLogin
  async postLogin(req, res) {
    const title = "Login";
    const { username, password, access } = req.body;
    try {
      // kiểm tra username
      const user = await User.findOne({ username });
      if (!user) {
        return res.render("login_form", {
          title: "Login",
          layout: "login",
          username,
          user_err: "*Incorrect username",
        });
      }
      // Kiểm tra password
      if (user.password !== password) {
        // Nếu mật khẩu không đúng, trả về thông báo lỗi
        return res.render("login_form", {
          title: "Login",
          layout: "login",
          pass_err: "*Incorrect password",
        });
      }
      // Lưu thông tin người dùng vào session và chuyển hướng đến trang chủ
      req.session.user = user;
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("*Internal Server Error");
    }
  }

  // [POST] /login/signupUser
  async signupUser(req, res, next) {
    const title = "Sign Up";
    try {
      const { username, email, password, confirm_password } = req.body;
      // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau hay không
      if (password !== confirm_password) {
        return res.render("signup_form", {
          title,
          layout: "login",
          cf_pass_err: "*Password do not same",
          username,
          email,
        });
      }

      // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        if (existingUser.username === username) {
          return res.render("signup_form", {
            title,
            layout: "login",
            user_ex: "*Username already exists",
            username,
            email,
          });
        } else {
          return res.render("signup_form", {
            title,
            layout: "login",
            email_ex: "*Email already exists",
            username,
            email,
          });
        }
      }

      // Tạo người dùng mới và lưu vào cơ sở dữ liệu
      const newUser = new User({
        username,
        email,
        password,
      });
      await newUser.save();

      // Chuyển hướng đến trang đăng nhập
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("*Internal Server Error");
    }
  }

  // [GET] /login/logout
  logOut(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  }
}

module.exports = new LoginController();
