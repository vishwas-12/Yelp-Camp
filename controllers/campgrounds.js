const Campground = require('../models/campground');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })//rendering all the campgrounds
}
module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {


    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}