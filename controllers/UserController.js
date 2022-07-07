const User = require("../models/User");

const bCrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

const genereteToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    });
};

//REgister user and sing in
const register = async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        res.status(422).json({ errors: ["Por favor, utilizar outro email"] });
        return;
    }

    //password hash
    const salt = await bCrypt.genSalt();
    const passwordHash = await bCrypt.hash(password, salt);

    //create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash,
    });

    if (!newUser) {
        res.status(422).json({
            errors: ["Houve um erro, por favor tente novamente mais tarde"],
        });
        return;
    }

    //if user was created successfullu, return the token
    res.status(201).json({
        _id: newUser._id,
        token: genereteToken(newUser._id),
    });
};

// Sign user in
const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
        res.status(404).json({ errors: ["Usuário não encontrado!"] });
        return;
    }

    // Check if password matches
    if (!(await bCrypt.compare(password, user.password))) {
        res.status(422).json({ errors: ["Senha inválida!"] });
        return;
    }

    // Return user with token
    res.status(200).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: genereteToken(user._id),
    });
};

const getCurrentUser = async (req, res) => {
    const user = req.user;

    res.status(200).json(user);
};

//update a user
const update = async (req, res) => {
    const { name, password, bio } = req.body;

    let profileInage = null;

    if (req.file) {
        profileInage = req.file.filename;
    }

    const reqUser = req.user;

    const user = await User.findById(
        mongoose.Types.ObjectId(reqUser._id),
    ).select("-password");

    if (name) {
        user.name = name;
    }

    if (password) {
        //password hash
        const salt = await bCrypt.genSalt();
        const passwordHash = await bCrypt.hash(password, salt);

        user.password = passwordHash;
    }

    if (profileInage) {
        user.profileImage = profileInage;
    }

    if (bio) {
        user.bio = bio;
    }

    await user.save();

    res.status(200).json(user);
};

// Get user by id
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(mongoose.Types.ObjectId(id)).select(
            "-password",
        );

        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado"] });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(402).json({ errors: ["Usuário não encontrado"] });
        return;
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
};
