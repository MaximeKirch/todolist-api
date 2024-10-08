const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user_id: {
      type:String,
      required:true
    },
    task_name: {
        type: String,
        required:true
    },
    due_date: {
        type:String,
        required:true
    },
    is_complete: {
        type: Boolean,
        required:false
    }
})

module.exports = mongoose.model("Todo", todoSchema);