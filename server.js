const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config();

const mongoURL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log('Connection ready.');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

const startServer = async () => {
  await mongoose.connect(mongoURL);

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Listen to ${port}...`);
  });
};

startServer();
