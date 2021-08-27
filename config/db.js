const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log('Database connection established....');
  } catch (error) {
    console.log(error.message);
    // Exit process with status failure.
    process.exit(1);
  }
};

module.exports = connectDB;
