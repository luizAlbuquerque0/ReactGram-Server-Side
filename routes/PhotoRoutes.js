const express = require("express");
const router = express.Router();

//Controllers
const {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhoto,
} = require("../controllers/PhotoController");

//Middlewares
const {
    photoInsertionValidation,
    photoUpdateValidation,
    commentValidation,
} = require("../middleware/photoValidation");
const authGuard = require("../middleware/authGaurd");
const validate = require("../middleware/handleValidation");
const { imageUpload } = require("../middleware/imageUpload");

//Routes
router.post(
    "/",
    authGuard,
    imageUpload.single("image"),
    photoInsertionValidation(),
    validate,
    insertPhoto,
);
router.delete("/:id", authGuard, deletePhoto);
router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos);
router.get("/search", authGuard, searchPhoto);
router.get("/:id", authGuard, getPhotoById);
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
router.put("/like/:id", authGuard, likePhoto);
router.put(
    "/comment/:id",
    authGuard,
    commentValidation(),
    validate,
    commentPhoto,
);

module.exports = router;
