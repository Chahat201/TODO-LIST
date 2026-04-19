const mongoose = require("mongoose");
const user = require("./user");

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  userId: String,
  date: String 
});

module.exports = mongoose.model("Todo", todoSchema);