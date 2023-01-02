const { string } = require('joi');
const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]

});

CampgroundSchema.post('findOneAndDelete', async function (doc) { //delete associated reviews when we delete a campground
    if (doc) {
        await review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }

})

module.exports = mongoose.model('Campground', CampgroundSchema);//export capground schema to wherever required
