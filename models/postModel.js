const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    authorName: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: {type:String, required:true},
    image: {type: String, default: null},
    likes: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)
module.exports = Post