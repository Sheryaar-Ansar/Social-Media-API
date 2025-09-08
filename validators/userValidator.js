const Joi = require('joi')
const allowedRoles = require('../constant/allowedRoles')

exports.userValidator = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid(...allowedRoles).default('user').optional(),
    bio: Joi.string().max(120).optional(),
    avatar: Joi.string().optional(),
    followers: Joi.array().optional(),
    following: Joi.array().optional(),
    followersCount: Joi.number().min(0).default(0),
    followingCount: Joi.number().min(0).default(0)

})