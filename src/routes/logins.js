const express = require("express");
const router = express.Router();
const loginControllers = require("../app/controllers/LoginController");

// Lưy ý mỗi thứ tự đầu tiên điều sử dụng /
router.post("/signupUser", loginControllers.signupUser);
router.get("/signUp", loginControllers.signUp);
router.post("/postLogin", loginControllers.postLogin);
router.get("/logOut", loginControllers.logOut);
router.get("/", loginControllers.login);

module.exports = router;
