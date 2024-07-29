const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    name : String,
    email : String,
    password : String,
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

});
module.exports = mongoose.model("Users", UsersSchema);