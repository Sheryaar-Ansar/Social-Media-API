const Joi = require('joi')

exports.commentValidators = Joi.object({
    authorName: Joi.object().required(),
    post: Joi.object().required(),
    text: Joi.string().min(5).required()
})