const mongose = require("mongoose");
const { Schema } = mongose;

const photoSchema = new Schema(
    {
        image: String,
        title: String,
        likes: Array,
        comments: Array,
        userId: mongose.ObjectId,
        userName: String,
    },
    {
        timestamps: true,
    },
);

const Photo = mongose.model("Photo", photoSchema);

module.exports = Photo;
