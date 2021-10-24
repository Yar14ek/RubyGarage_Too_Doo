const mongoose = require('mongoose');

const toDoListShema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  tasks: [
    {
      description: {
        type: String,
        required: true,
        trim: true,
      },
      isDone: {
        type: Boolean,
        default: false,
      },
      isPriority: {
        type: Boolean,
        default: false,
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const ToDoList = mongoose.model('ToDoList', toDoListShema);

module.exports = {
  ToDoList,
};
