const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  recepientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  message: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;