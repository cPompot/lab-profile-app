//const { Schema, model } = require("mongoose");
 const mongoose = require('mongoose');


// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true
    },
    password: String,
    campus: {type:String, enum:["Madrid", "Barcelona", "Miami", "Paris", "Berlin", "Amsterdam", "Mexico", "Sao Paulo", "Lisbon"]},
    course: {type:String, enum:["Web Dev", "UX/UI", "Data Analytics"]}, 
    image: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
