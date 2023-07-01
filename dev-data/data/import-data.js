const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../src/models/tour.model');

dotenv.config();

const mongoURL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log('Connection ready.');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

mongoose.connect(mongoURL).then(() => console.log('connect db...'));

//Read json - arr of js objects
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//import data to database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded!');
  } catch (error) {
    console.log(error);
  }
};

//delete data exist in db
const deleteData = async () => {
  try {
    await Tour.deleteMany(); //delete all colection in Tour collections
    console.log('data loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

//node dev-data/data/import-data.js --import
