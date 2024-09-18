const Joi = require('joi')

const validator = schema => (req, res, next) => {
    const {error} = schema.validate(req.body, {abortEarly: false})
    if(error){
        var message= "";
        for(let key in error.details){
            var detail = error.details[key]
            message += detail.message + "\n"
        }
        return res.status(400).json({
            message:message
        })
    }
    next()
}

const UserSchema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),

    email: Joi.string().required(),
    password: Joi.string().min(8).required()
});

module.exports = {
       validateUser: validator(UserSchema)
}