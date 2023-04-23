const User = require("../models/User");
const { mongooseToObject } = require("../../util/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class LoginController {
  // [GET] /login_form
  login(req, res) {
    const title = "Login";
    // xóa đăng nhập token
    req.session.token = false;
    res.locals.session = req.session;
    if (req.session.signUp) {
      req.session.signUp = false;
      res.locals.signUpMess = "Đăng ký thành công!";
    } else if (req.session.reset_pass) {
      req.session.reset_pass = false;
      res.locals.resetPassMess = "Cập nhật mật khẩu thành công";
    } else if (req.session.noLogin) {
      req.session.noLogin = false;
      res.locals.noLoginMess = "Vui lòng đăng nhập để vào trang";
    } else if (req.session.relogin) {
      req.session.relogin = false;
      res.locals.reloginMess = "Phiên đăng nhập đã hết hạn";
    }
    res.render("logins/login_form", {
      title,
      layout: "login",
    });
  }
  // [GET] /login/resetPassform
  resetPass_form(req, res) {
    const title = "Reset Password";
    res.locals.session = req.session;
    res.render("logins/resetPass_form", {
      title,
      layout: "login",
    });
  }

  // [GET] /login/signUp
  signUp(req, res) {
    const title = "Sign Up";
    res.render("logins/signup_form", { title, layout: "login" });
  }

  // [POST] /login/postLogin
  async postLogin(req, res) {
    const title = "Login";
    const { username, password } = req.body;

    try {
      // Kiểm tra username và password
      const user = await User.findOne({ username });
      if (!user) {
        return res.render("logins/login_form", {
          title,
          layout: "login",
          user_err: "*Incorrect username.",
          success: false,
          username,
          password,
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.render("logins/login_form", {
          title,
          layout: "login",
          pass_err: "*Incorrect password.",
          success: false,
          username,
          password,
        });
      }
      const userInfo = {
        id: user._id,
        username: user.username,
        password: user.password,
        image: user.image,
        access: user.access,
      };
      // Tạo token với thông tin user
      const token = jwt.sign(userInfo, "secret_key", {
        expiresIn: 600, // Thời gian sống của token là 10p
      });

      // Lưu thông tin user vào cookie
      res.cookie("jwt_token", token, { httpOnly: true });

      // Chuyển trang
      req.session.login = true;
      return res.redirect("/");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // ------------------------
  // [POST] /login/signupUser
  async signupUser(req, res, next) {
    const title = "Sign Up";
    try {
      const { username, email, password, confirm_password } = req.body;
      // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau hay không
      if (password !== confirm_password) {
        return res.render("logins/signup_form", {
          title,
          layout: "login",
          cf_pass_err: "*Password do not same",
          username,
          email,
          password,
          confirm_password,
        });
      }

      // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        if (existingUser.username === username) {
          return res.render("logins/signup_form", {
            title,
            layout: "login",
            user_ex: "*Username already exists",
            username,
            email,
            password,
            confirm_password,
          });
        } else {
          return res.render("logins/signup_form", {
            title,
            layout: "login",
            email_ex: "*Email already exists",
            username,
            email,
            password,
            confirm_password,
          });
        }
      }

      // Tạo người dùng mới và lưu vào cơ sở dữ liệu
      const saltRounds = 10;
      const hashPassword = bcrypt.hashSync(password, saltRounds);
      const newUser = new User({
        username,
        password: hashPassword,
        email,
      });
      await newUser.save();

      // Chuyển hướng đến trang profile
      req.session.signUp = true;
      res.redirect("/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("*Internal Server Error");
    }
  }
  // [PUT] /login/resetPass
  async resetPass(req, res) {
    const title = "Reset password";
    const { email, password, confirm_password } = req.body;

    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return res.render("logins/resetPass_form", {
          title,
          layout: "login",
          email_not_found: "*Email not found",
          email,
          password,
          confirm_password,
        });
      }

      if (password !== confirm_password) {
        return res.render("logins/resetPass_form", {
          title,
          layout: "login",
          pass_err: "*Passwords do not match",
          email,
          password,
          confirm_password,
        });
      }

      // Mã hóa mật khẩu trước khi vào database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Cập nhật mật khẩu của user trên database
      user.password = hashedPassword;
      await user.save();

      req.session.reset_pass = true;
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      return res.status(500).send("*Internal Server Error");
    }
  }
  // ------------------------
  // [GET] /login/logout
  logOut(req, res) {
    // Xóa Cookie user
    res.clearCookie("jwt_token");
    // Xóa session kiểm tra hết hạn
    req.session.token = false;
    req.session.logOut = true;
    res.redirect("/");
  }
}

module.exports = new LoginController();
