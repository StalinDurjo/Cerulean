const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post_title: {
        type: String,
        required: true
    },
    post_image: {
        type: String,
        required: true
    },
    post_description: {
        type: String,
        required: true,
        trim: true
    },
    post_created: {
        type: Date,
        default: Date.now
    },
    post_author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    post_comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model('Post', postSchema);