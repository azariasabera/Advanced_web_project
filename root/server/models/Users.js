const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    name : String,
    email : String,
    password : { type: String, optional: true }, // because user can also sign in with google
    date : {
        type : String,
        default : Date.now
    },
    likedBy : {
        type : Array,
        default : []
    },
    liked : {
        type : Array,
        default : []
    },

    title : { type: String, default: "Title" },
    detail: { type: String, default: "Nothing added yet" },
    googleId : { type: String, optional: true },
    resetToken : { type: String, optional: true },
    resetTokenExpiration : { type: Date, optional: true }
});
module.exports = mongoose.model("Users", UsersSchema);