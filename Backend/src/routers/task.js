const express = require('express');
const router = express.Router();
const { ToDoList } = require('../models/task');
const { User } = require('../models/user');
const { auth } = require('../middleware/auth');

//Create todo list
router.post('/todoList', auth, async (req, res) => {
  const todoList = new ToDoList({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const user = await User.findById(req.user._id.toString());
    user.todoLists.push(todoList._id);
    await user.save();
    if (!todoList) {
      res.status(400).send();
    }
    await todoList.save();
    res.send(todoList);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Rename todo list
router.patch('/todoList/:id', auth, async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(400).send();
    }
    const _id = req.params.id;
    const todo = await ToDoList.findOne({ _id });
    if (!todo) {
      res.status(404).send();
    }
    todo.name = req.body.name;
    await todo.save();
    res.send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete todo list
router.delete('/todoList/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const todo = await ToDoList.findOneAndDelete({ _id });
    if (!todo) {
      res.status(404).send();
    }
    res.send(todo);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Get all todo lists by user
router.get('/todoList', auth, async (req, res) => {
  const userId = req.user._id.toString();
  const todoLists = await User.findById(userId).populate('todoLists');
  res.send(todoLists);
  try {
  } catch (e) {
    res.status(404).send(e);
  }
});

//Create new task
router.post('/task/:listId', auth, async (req, res) => {
  const _id = req.params.listId;
  const todo = await ToDoList.findOne({ _id });
  try {
    if (!todo) {
      res.status(400).send();
    }
    await todo.tasks.push({ ...req.body });
    await todo.save();
    res.status(201).send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Update task by id
router.patch('/task/:listId/:taskId', auth, async (req, res) => {
  try {
    const list = await ToDoList.findById(req.params.listId.toString());
    if (!list) res.status(404).send();

    const task = list.tasks.find((e) => e._id.toString() === req.params.taskId);
    if (!task) res.status(404).send();

    const data = req.body;
    const key = Object.keys(data);
    key.forEach((e) => (task[e] = data[e]));
    await list.save();
    res.status(201).send(list);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete task
router.delete('/task/:listId/:taskId', auth, async (req, res) => {
  const list = await ToDoList.findById(req.params.listId.toString());
  try {
    if (!list) {
      res.status(404).send();
    }
    list.tasks = list.tasks.filter(
      (e) => e._id.toString() !== req.params.taskId
    );
    await list.save();
    res.send(list);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
