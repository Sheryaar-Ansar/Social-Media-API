const Joi = require('joi')

exports.postValidator = Joi.object({
    authorName: Joi.string().optional(),
    text: Joi.string().min(5).required(),
    image: Joi.string().optional(),
    likes: Joi.array().optional(),
    comments: Joi.array().optional()
})
