const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  sender: { type: String, required: true }, // email of the sender
  recipient: { type: String, required: true }, // email of the recipient
  text: { type: String, required: true }, // message text
  timestamp: { type: Date, default: Date.now } // to order messages chronologically
});

module.exports = mongoose.model("Chat", chatSchema);