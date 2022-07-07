const express = require("express");
const router = express.Router();

//Controlers
const {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
} = require("../controllers/UserController");

//middlewares
const validate = require("../middleware/handleValidation");
const {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
} = require("../middleware/userValidations");
const authGuard = require("../middleware/authGaurd");
const { imageUpload } = require("../middleware/imageUpload");

//Routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
    "/",
    authGuard,
    userUpdateValidation(),
    validate,
    imageUpload.single("profileImage"),
    update,
);
router.get("/:id", getUserById);

module.exports = router;
