const mongoose = require('mongoose');

// define the User model schema
const ProxySchema = new mongoose.Schema({
  email:String }, {collection: 'proxy'});

module.exports = mongoose.model('Proxy', ProxySchema);
