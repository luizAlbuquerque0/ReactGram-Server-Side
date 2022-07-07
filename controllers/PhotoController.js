const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
const photo = require("../models/Photo");

//Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
    const { title } = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const newPhoto = await photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    if (!newPhoto) {
        res.status(422).json({
            erros: ["Houve um problema, por favor tente novamente mais tarde"],
        });
        return;
    }

    res.send(newPhoto);
};

//Remove a photo from db
const deletePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    try {
        const Photo = await photo.findById(mongoose.Types.ObjectId(id));

        if (!Photo) {
            res.status(404).json({ erros: ["Foto não encontrada"] });
            return;
        }

        //Check if photo belongs to user
        if (!Photo.userId.equals(reqUser._id)) {
            res.status(404).json({
                erros: [
                    "Ocorreu um erro, por favor tente novamente mais tarde",
                ],
            });
        }

        await photo.findByIdAndDelete(Photo._id);

        res.status(200).json({
            id: Photo._id,
            message: "Foto excluida com sucesso.",
        });
    } catch (error) {
        res.status(404).json({ erros: ["Foto não encontrada"] });
        return;
    }
};

//Get all photos
const getAllPhotos = async (req, res) => {
    const photos = await photo
        .find({})
        .sort([["createdAt", -1]])
        .exec();

    res.status(200).json(photos);
};

//Get user photos
const getUserPhotos = async (req, res) => {
    const { id } = req.params;

    const photos = await photo
        .find({ userId: id })
        .sort([["createdAt", -1]])
        .exec();

    res.status(200).json(photos);
};

//Get photo by ID
const getPhotoById = async (req, res) => {
    const { id } = req.params;

    const Photo = await photo.findById(mongoose.Types.ObjectId(id));

    //Check if photo exists
    if (!Photo) {
        res.status(404).json({ erros: ["Foto não encontrada"] });
        return;
    }

    res.status(200).json(Photo);
};

//Update a photo
const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const reqUser = req.user;

    const Photo = await photo.findById(id);

    //Check if photo exists
    if (!Photo) {
        res.status(404).json({ erros: ["Foto não encontrada"] });
        return;
    }

    //Check if photo belongs to user
    if (!Photo.userId.equals(reqUser._id)) {
        res.status(404).json({
            erros: ["Ocorreu um erro, por favor tente novamente mais tarde"],
        });
        return;
    }

    if (title) {
        Photo.title = title;
    }

    await Photo.save();

    res.status(200).json({ Photo, message: "Foto atualizada com sucesso" });
};

//Like funcionality
const likePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    const Photo = await photo.findById(id);

    //Check if photo exists
    if (!Photo) {
        res.status(404).json({ erros: ["Foto não encontrada"] });
        return;
    }

    //Check if user already liked the photo
    if (Photo.likes.includes(reqUser._id)) {
        res.status(422).json({ erros: ["Você já curtiu a foto"] });
        return;
    }

    //Put user id into likes array
    Photo.likes.push(reqUser._id);

    Photo.save();

    res.status(200).json({
        photoId: id,
        userId: reqUser._id,
        message: "A foto foi curtida.",
    });
};

//Comment funcionality
const commentPhoto = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const Photo = await photo.findById(id);

    //Check if photo exists
    if (!Photo) {
        res.status(404).json({ erros: ["Foto não encontrada"] });
        return;
    }

    //Put comment into array comments
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };

    Photo.comments.push(userComment);

    await Photo.save();

    res.status(200).json({
        comment: userComment,
        message: "O comentario foi adicionado com sucesso",
    });
};

//Search photos by title
const searchPhoto = async (req, res) => {
    const { q } = req.query;

    const photos = await photo.find({ title: new RegExp(q, "i") }).exec();

    res.status(200).json(photos);
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhoto,
};
