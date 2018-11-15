const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var db = mongoose.connect('mongodb://localhost:27017/thaparOne');
//mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose : mongoose ,
  db : db
};
