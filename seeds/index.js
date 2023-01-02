
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const Campground = require('../models/campground');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/project', {
    useNewUrlParser: true,

    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 20) + 10;
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '63ae7b9772d02d2ff850d29e',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi illo, incidunt ab illum aliquid maiores quis doloremque perferendis molestiae, consequatur eveniet debitis similique sint quod blanditiis tenetur rem, veritatis perspiciatis.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dynjc2qcb/image/upload/v1672559543/yelpcamp/k7cnfmfxk7nffzlhcttu.jpg',
                    filename: 'yelpcamp/k7cnfmfxk7nffzlhcttu',

                },
                {
                    url: 'https://res.cloudinary.com/dynjc2qcb/image/upload/v1672559543/yelpcamp/k7cnfmfxk7nffzlhcttu.jpg',
                    filename: 'yelpcamp/k7cnfmfxk7nffzlhcttu',

                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})//updating databse with this new entry