const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({ //client side validation without involvement of mongoose
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0), //min price of campgroudn is 0 ,JOI is used for server side validation
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})
