// File tuyến đường nào cũng cần tuyến đường này
// lưu ý "newControllers là một tên biến khác với NewControllers là một Class function"
// Đây là trang news và các tập tin con nếu có
const express = require("express");
const router = express.Router();
const newControllers = require("../app/controllers/NewControllers");

router.get("/:slug", newControllers.show);
router.get("/", newControllers.index);

module.exports = router;
