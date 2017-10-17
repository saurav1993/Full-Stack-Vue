<template>
  <div id="app">
    <div class="container">
      <div class="col-lg-12 appBody">
        <h1 class="text-danger">Notes Keep!!</h1>
        <div class="mainBody">
          <div class="input-group input-group-lg ">
            <input type="text" class="form-control" placeholder="Enter Your Note.." v-model="noteText" @keyup.enter="addNote">
            <span class="input-group-btn">
              <button class="btn btn-danger" type="button" @click="addNote">Go!</button>
            </span>
          </div>
          <!-- Dummy Note     -->
          <ul class="list-group notes clear-fix" v-for="(note,index) in notes">
            <li class="list-group-item" v-bind:class="{ checkColor : note.check }">
              <span class="note-txt float-left">{{note.text}}</span>
              <button class="btn btn-danger float-right" @click="deleteNote(note._id)">X</button>
              <template v-if="note.check">
                <button class="btn btn-primary float-right" @click="Uncheck(note._id)">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </button>
              </template>
              <template v-else>
                <button class="btn btn-primary float-right" @click="Check(note._id)">
                  <span style="display:inline-block; width: 10px;"></span>
                </button>
              </template>

            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      noteText : "",
      notes : []
    }
  },
  created(){
    this.start();
  },
  sockets:{
    notesUpdated(notes){
      this.notes = notes;
    }
  },
  methods : {
      start(){
        this.$socket.emit("start");
      },
      addNote(){
        if(this.noteText.length > 0){
            var note = {
            text : this.noteText,
            check : false
          };
          this.$socket.emit('newNote', note);
          this.noteText = "";
        }
      },
      Check(index){
        this.$socket.emit('checkNote', index);
      },
      Uncheck(index){
        this.$socket.emit('unCheckNote', index);
      },
      deleteNote(index){
        this.$socket.emit('delete', index);
      }
    }
}
</script>

<style>
.appBody{
    margin-top: 50px;
    /* border: 1px solid #C0C0C0; */
    border-radius: 20px;
    padding-top: 20px;
    padding-bottom : 30px;
    /* background: #C0C0C0; */
}
.appBody h1{
   text-align: center;
   margin-bottom: 10px;
}
.mainBody{
    width: 50%;
    margin: auto;
}
.notes{
    margin: 10px 0 10px 0;
}
.note-txt{
    width:400px;
}
li button {
    margin : 1px;
}
.checkColor {
    background-color: #9CFF88
}
</style>
