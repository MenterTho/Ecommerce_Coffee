const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');

class LoginController {
    // [GET] /login_form
    login(req, res) {
        const title = 'Login';
        res.locals.session = req.session;
        // Kiểm tra thông báo đăng ký
        if (req.session.signUp) {
            // Gán biến signUp
            req.session.signUp = false;
            // Gán biến thông báo
            res.locals.signUpMessage = 'Đăng ký thành công!';
        }
        // Kiểm tra thông báo cập nhật mật khẩu
        if (req.session.reset_pass) {
            // Gán biến reset_pass
            req.session.reset_pass = false;
            // Gán biến thông báo
            res.locals.resetPassMessage = 'Cập nhật mật khẩu thành công!';
        }

        res.render('login_form', {
            title,
            layout: 'login',
        });
    }
    // [GET] /login/resetPassform
    resetPass_form(req, res) {
        const title = 'Reset Password';
        res.locals.session = req.session;
        res.render('resetPass_form', {
            title,
            layout: 'login',
        });
    }

    // ------------------------
    // [GET] /login/signUp
    signUp(req, res) {
        const title = 'Sign Up';
        res.render('signup_form', { title, layout: 'login' });
    }

    // ------------------------
    // [POST] /login/postLogin
    async postLogin(req, res) {
        const title = 'Login';
        const { username, password } = req.body;
        try {
            // kiểm tra username
            const user = await User.findOne({ username });
            if (!user) {
                return res.render('login_form', {
                    title: 'Login',
                    layout: 'login',
                    user_err: '*Incorrect user',
                    password,
                });
            }
            // Kiểm tra password
            if (user.password !== password) {
                // Nếu mật khẩu không đúng, trả về thông báo lỗi
                return res.render('login_form', {
                    title: 'Login',
                    layout: 'login',
                    pass_err: '*Incorrect password',
                    username,
                });
            }
            // Lưu thông tin người dùng vào session và chuyển hướng đến trang chủ
            req.session.user = user;
            req.session.login = true;
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('*Internal Server Error');
        }
    }

    // ------------------------
    // [POST] /login/signupUser
    async signupUser(req, res, next) {
        const title = 'Sign Up';
        try {
            const { username, email, password, confirm_password } = req.body;
            // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau hay không
            if (password !== confirm_password) {
                return res.render('signup_form', {
                    title,
                    layout: 'login',
                    cf_pass_err: '*Password do not same',
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
                    return res.render('signup_form', {
                        title,
                        layout: 'login',
                        user_ex: '*Username already exists',
                        username,
                        email,
                        password,
                        confirm_password,
                    });
                } else {
                    return res.render('signup_form', {
                        title,
                        layout: 'login',
                        email_ex: '*Email already exists',
                        username,
                        email,
                        password,
                        confirm_password,
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
            req.session.signUp = true;
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('*Internal Server Error');
        }
    }
    // [PUT] /login/resetPass
    async resetPass(req, res) {
        const title = 'Reset password';
        const { email, password, confirm_password } = req.body;

        try {
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.render('resetPass_form', {
                    title,
                    layout: 'login',
                    email_not_found: '*Email not found',
                    password,
                    confirm_password,
                });
            }

            if (password !== confirm_password) {
                return res.render('resetPass_form', {
                    title,
                    layout: 'login',
                    pass_err: '*Passwords do not match',
                    password,
                    email,
                });
            }

            // Tạo mật khẩu mới và cập nhật vào cơ sở dữ liệu
            user.password = password;
            await user.save();

            // Chuyển hướng đến trang đăng nhập và thông báo thành công
            req.session.reset_pass = true;
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            return res.status(500).send('*Internal Server Error');
        }
    }
    // ------------------------
    // [GET] /login/logout
    logOut(req, res) {
        // Xóa user và những dòng code khác
        delete req.session.user;
        delete req.session.login;
        // Chuyển hướng đến trang chủ
        req.session.logout = true;
        res.redirect('/');
    }
}

module.exports = new LoginController();
