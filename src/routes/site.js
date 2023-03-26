// File tuyến đường nào cũng cần tuyến đường này
// lưu ý "siteControllers là một tên biến khác với SiteControllers là một Class function"
// Đây là trang liên kết giữa home và search
const express = require("express");
const router = express.Router();
const siteControllers = require("../app/controllers/SiteController");

router.use("/search", siteControllers.search);
// ký tự ("/") muốn đặt tên gì thì đặt này là đường truyền của siteControllers.home
// (qua file SiteControllers, js để biết)
router.use("/", siteControllers.home);

module.exports = router;
