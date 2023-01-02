if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schema');
const Review = require('./models/review')
const expresserror = require('./utils/expresserror');
const Campground = require('./models/campground');
const methodOverride = require('method-override'); //used for faking requests,like post req as delete request
const ExpressError = require('./utils/expresserror');
const { join } = require('path');
const campground = require('./models/campground');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const passportLocalMongoose = require('passport-local-mongoose');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL;

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,

    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connection");
});


app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: "this shouldbetterbesecret",
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("session store error", e)
})

const sessionConfig = {
    store,
    secret: 'thisshouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //so that user is logged out after a week of logging in
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs')//set view engine to ejs
app.set('views', path.join(__dirname, 'views'))// joining directory with path


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => { //every req hits this middleware

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home');
})



app.all('*', (req, res, next) => { //app.all is used to select all requests
    next(new expresserror('Page Not Found', 404));
});


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; //err will be above express error or any other error
    if (!err.message) err.message = 'Oh no, Something went wrong'
    res.status(statusCode).render('error', { err });
    //catchAsync call this function
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});
