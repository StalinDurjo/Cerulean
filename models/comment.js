const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment_text: {
        type: String,
        required: true
    },
    comment_created: {
        type: Date,
        default: Date.now
    },
    comment_author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
        username: String,
        user_image: String
    }
});

module.exports = mongoose.model('Comment', commentSchema);