const express = require("express");
const socket = require("socket.io");
const mongoose = require('mongoose');

const app = express();

//App startup
const server = app.listen(3000, () => {
    console.log("The App Started at PORT :: 3000 ");
});

var notes = [];
//Map Gobal Promise (To get rid of the mongose deprication warning)
mongoose.Promise = global.Promise;

//Connect Mongoose
mongoose.connect("mongodb://localhost/NotesApp", {
    useMongoClient: true
})
    .then(() => {
        console.log("MongoDb connected");
    })
    .catch(err => console.log(err));

//Load Note Model
require("./models/Note.js");
const Note = mongoose.model('notes');    

var notes = [];

//Socket IO setup
var io = socket(server);
io.on('connection', (socket) => {
    console.log("made socket connection", socket.id);
    socket.on("start", () => {
        Note.find({})
        .then(notes => {
            io.sockets.emit("notesUpdated", notes);
        });
    });

    socket.on("newNote", (note) => {
        new Note(note)
        .save()
        .then( note => {
            Note.find({})
            .then(notes => {
                io.sockets.emit("notesUpdated", notes);
            });
        });
    });

    socket.on("checkNote", (id) => {
        Note.findOne({
            _id : id
        })
        .then(note => {
            note.check = true
            note.save()
            .then(note =>{
                Note.find({})
                .then(notes => {
                    io.sockets.emit("notesUpdated", notes);
                });
            });
        })
    });

    socket.on("unCheckNote", (id) => {
        Note.findOne({
            _id : id
        })
        .then(note => {
            note.check = false
            note.save()
            .then(note =>{
                Note.find({})
                .then(notes => {
                    io.sockets.emit("notesUpdated", notes);
                });
            });
        })
    });

    socket.on("delete", (id) => {
        Note.remove({
            _id : id
        })
        .then(()=>{
            Note.find({})
            .then(notes => {
                io.sockets.emit("notesUpdated", notes);
            });
        })
    });

});

function CreateNotesArray(){
    
}