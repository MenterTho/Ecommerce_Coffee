const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/AdminController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "src/public/upload");
  },
  filename: (req, file, res) => {
    res(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
// -----------------
router.patch("/:id/restoreUser", adminController.restoreUser);
router.put(
  "/:id/editProducts",
  upload.single("image"),
  adminController.editProducts
);
router.post("/addProduct", upload.single("image"), adminController.addProduct);
router.delete("/:id/deleteRealUser", adminController.deleteRealUser);
router.delete("/:id/deleteProduct", adminController.deleteProduct);
router.delete("/:id", adminController.lookUser);
router.get("/errorPage", adminController.errorPage);
router.get("/:id/editFromProducts", adminController.editFromProducts);
router.get("/", adminController.admin_index);

module.exports = router;
