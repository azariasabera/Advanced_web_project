const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const imageSchema = new Schema({
    email: String,
    name: String,
    encoding: String,
    mimetype: String,
    buffer: Buffer 
});

module.exports = mongoose.model("Image", imageSchema);