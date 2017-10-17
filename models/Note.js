const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    text : {
        type : String,
        required : true
    },
    check : {
        type : Boolean,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

mongoose.model("notes",NoteSchema);