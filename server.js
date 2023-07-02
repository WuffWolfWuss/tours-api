const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config();

const mongoURL = process.env.MONGO_URL;

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  console.log(process.env.NODE_ENV);
}

mongoose.connection.once('open', () => {
  console.log('Connection ready.');
});

mongoose.connection.on('error', (err) => {
  console.error('Connect to DB failed. Check and try again.');
});

const startServer = async () => {
  await mongoose.connect(mongoURL);

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Listen to ${port}...`);
  });
};

startServer();
