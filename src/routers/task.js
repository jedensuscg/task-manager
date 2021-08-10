const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const { logger, requestLogger } = require("../logger");

// Post New Task
router.post("/tasks", async (req, res) => {
  const ip = req.ip;
  const task = new Task(req.body);
  try {
    await task.save();
    requestLogger.log({
      method: 'TASK POST',
      level: "info",
      message: `Task POST request from Ip Address ${ip}`,
      meta: {data: task}
    });
    res.status(201).send(task);
  } catch (error) {
    requestLogger.log({
      method: 'TASK POST',
      level: "error",
      message: `Task POST request from Ip Address ${ip} with ERROR: ${error}`,
      meta: {data: task}
    });
    res.status(400).send(error.message);
  }
});

// Get All Tasks
router.get("/tasks", async (req, res) => {
  const ip = req.ip;

  try {
    const tasks = await Task.find({})
    requestLogger.log({
      method: 'TASK GET',
      level: "info",
      message: `Task GET ALL request from Ip Address ${ip}`,
      status: 'Success',
    });
    res.send(tasks)
  } catch (error) {
    requestLogger.log({
      method: 'TASK GET',
      level: "error",
      message: `Task GET ALL request from Ip Address ${ip} with ERROR: ${error}`,
    });
    res.status(500).send()
  }
});

// Get Task by ID
router.get("/tasks/:id", async (req, res) => {
  const ip = req.ip;
  const _id = req.params.id;
  
  try {
    const task = await Task.findById(_id)
    if (!task) {
      requestLogger.log({
        method: 'TASK GET',
        level: "error",
        message: `Task GET request from Ip Address ${ip} with ERROR: Task Not Found`,
      });
      return res.status(404).send("Task not found");
    }
    requestLogger.log({
      method: 'TASK GET',
      level: "info",
      message: `Task GET request from Ip Address ${ip}`,
      meta: {data: task}
    });
    res.send(task)
  } catch (error) {
    requestLogger.log({
      method: 'TASK GET',
      level: "error",
      message: `Task GET request from Ip Address ${ip} with ERROR: ${error}`,
    });
    res.status(500).send()
  }
});

// Update Task by ID
router.patch('/tasks/:id', async (req, res) => {
  const ip = req.ip;
  const _id = req.params.id;
  const updates = Object.keys(req.body)
  const allowedUpdates = ['completed', 'description']
  const isValidUpdate = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidUpdate) {
    requestLogger.log({
      method: 'TASK PATCH',
      level: "error",
      message: `Task PATCH request from Ip Address ${ip} with ERROR: Invalid Update, field either does not exist or is not editable`,
      meta: {dataToModify: updates}
    });
    return res.status(400).send({error: 'Invalid Update, field either does not exist or is not editable'})
  }

  try {
    const task = await Task.findById(_id)

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()

    if (!task) {
      requestLogger.log({
        method: 'TASK PATCH',
        level: "error",
        message: `Task PATCH request from Ip Address ${ip} with ERROR: Task not found`,
      });
      return res.status(404).send
    }
    requestLogger.log({
      method: 'TASK PATCH',
      level: "info",
      message: `Task PATCH request from Ip Address ${ip}: Requested updates [${updates}]`,
      meta: { dataToModify: updates, fieldsModified: req.body}

    });
    res.send(task)
  } catch (error) {
    requestLogger.log({
      method: 'TASK PATCH',
      level: "error",
      message: `Task PATCH request from Ip Address ${ip} with ERROR: ${error}`,
      meta: {dataToModify: {id: _id, fields: updates}}
    });
    res.status(400).send(error.message)
  }
})

// Delete Task by ID
router.delete('/tasks/:id', async(req, res) => {
  const ip = req.ip
  _id = req.params.id
  try {
    const task = await Task.findByIdAndDelete(_id)

    if (!task) {
      requestLogger.log({
        method: 'TASK DELETE',
        level: "error",
        message: `Task DELETE request from Ip Address ${ip} with ERROR: User Not Found`,
      });
    }
    requestLogger.log({
      method: 'TASK DELETE',
      level: "info",
      message: `Task DELETE request from Ip Address ${ip}: ${task.description} deleted`,
      meta: {data: task}
    });
    res.send(task)
  } catch (error) {
    requestLogger.log({
      method: 'TASK DELETE',
      level: "error",
      message: `Task DELETE request from Ip Address ${ip} failed with ERROR: ${error.message}`,
    });
    res.status(500).send(error.message)
  }
})

module.exports = router