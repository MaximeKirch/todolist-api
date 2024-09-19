const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware')
const {v4:uuidv4} = require('uuid')

// Get all tasks
router.get('/todos',  authenticateToken, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post a new task
router.post('/todos', authenticateToken,async(req, res) => {
    const todo = new Todo({
        task_name:req.body.task_name,
        due_date:req.body.due_date,
        is_complete: req.body.is_complete || false,
        user_id:req.user.id

    })

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch(e) {
        res.status(400).json({message: err.message})
    }
})

// Patch an existing task (only if user is the owner of this task
router.patch('/todo/:id', authenticateToken, async(req,res) => {
    try {
        const todo = await Todo.findOne({id:req.params._id});

        if(!todo) {
            return res.status(404).json({message: 'Task not found.'});
        }

        if (todo.user_id !== req.user.id) {
            return res.status(403).json({message: "Forbidden. The task is not owned by user."})
        }

        // Update task if everything is ok
        const updatedTodo = await Todo.findByIdAndUpdate(todo._id, req.body, { new: true });
        res.status(200).json(updatedTodo);
    } catch (e) {
        res.status(400).json({message:e.message});
    }
})

// Remove a task only if user own it
router.delete('/todo/:id', authenticateToken, async(req,res) => {
    try {
        const todo = await Todo.findOne({id:req.params._id})
        if(!todo) return res.status(404).json({message:"Task not found"});
        if(todo.id !== req.user.id) {
            return res.status(403).json({message: "Forbidden. The task is not owned by user."})
        }

        // Delete task if everything is ok
        await Todo.findByIdAndDelete(todo.id);
        res.status(200).json({message: "Todo deleted."})

    } catch(e) {
        return res.status(400).json({message: 'Error while deleting', e})
    }
})

module.exports = router;