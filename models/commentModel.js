const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    authorName: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    text: {type: String, text:true, required: true}
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment