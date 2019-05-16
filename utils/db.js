const mongoose = require("mongoose")
const options = require("../config")

module.exports.connect = (url = options.dbUrl, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true })
}
