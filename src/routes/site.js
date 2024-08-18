const express = require("express");
const router = express.Router();
const siteControllers = require("../app/controllers/SiteController");
const multer = require("multer");
// lấy ảnh từ trong file máy tính
const storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "src/public/upload/");
  },
  filename: (req, file, res) => {
    res(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
// Sản phẩm
router.get("/shoping", siteControllers.shoping); // xem giỏ hàng
router.get("/shoping/:id", siteControllers.destroy); // delete product
router.get("/user", siteControllers.page);
// ---------
router.put("/editImage", upload.single("image"), siteControllers.editImage);
router.put("/editUser", siteControllers.editUser);
router.get("/profile", siteControllers.profile);
router.get("/products", siteControllers.product);
router.get("/search", siteControllers.search);
router.get("/", siteControllers.home);

module.exports = router;
