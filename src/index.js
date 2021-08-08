const express = require("express");
require("./db/mongoose");
require("dotenv").config();
const { logger, requestLogger } = require("./logger");

const User = require("./models/user.js");
const Task = require("./models/task.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (req, res) => {
  const ip = req.ip;
  const user = new User(req.body);
  try {
    await user.save();
    requestLogger.log({
      method: 'USER POST',
      level: "info",
      message: `User POST request from Ip Address ${ip}`,
      meta: {data: user}
    });
    res.status(201).send(user);
  } catch (error) {
    requestLogger.log({
      method: 'USER POST',
      level: "error",
      message: `User POST request from Ip Address ${ip} with ERROR: ${error}`,
      meta: {data: user}
    });
    res.status(400).send(error.message);
  }
});

app.get("/users", async (req, res) => {
  const ip = req.ip;

  try {
    const users = await User.find({})
    requestLogger.log({
      method: 'USER GET',
      level: "info",
      message: `User GET ALL request from Ip Address ${ip}`,
    });
    res.send(users)
  } catch (error) {
    requestLogger.log({
      method: 'USER GET',
      level: "error",
      message: `User GET ALL request from Ip Address ${ip} with ERROR: ${error}`,

    });
    res.status(500).send()
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  const ip = req.ip;
  const _id = req.params.id;
  
  try {
    const user = await User.findById(_id)
    if (!user) {
      requestLogger.log({
        method: 'USER GET',
        level: "error",
        message: `User GET request from Ip Address ${ip} with ERROR: User Not Found`,
      });
      return res.status(404).send("User not found");
    }
    requestLogger.log({
      method: 'USER GET',
      level: "info",
      message: `User GET request from Ip Address ${ip}`,
      data: user
    });
    res.send(user)
  } catch (error) {
    requestLogger.log({
      method: 'USER GET',
      level: "error",
      message: `User GET request from Ip Address ${ip} with ERROR: ${error}`,
    });
    res.status(500).send()
  }
});

app.patch('/users/:id', async (req, res) => {
  const ip = req.ip;
  const _id = req.params.id;
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidUpdate = updates.every((update) => {
    return allowedUpdates.includes(update)
  })


  if (!isValidUpdate) {
    requestLogger.log({
      method: 'USER PATCH',
      level: "error",
      message: `User PATCH request from Ip Address ${ip} with ERROR: Invalid Update, field either does not exist or is not editable`,
      meta: {dataToModify: updates}
    });
    return res.status(400).send({error: 'Invalid Update, field either does not exist or is not editable'})
  }
  try {
    const preUpdateUser = await User.findById(_id)
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

    if (!user) {
      requestLogger.log({
        method: 'USER PATCH',
        level: "error",
        message: `User PATCH request from Ip Address ${ip} with ERROR: User not found`,

      });
      return res.status(404).send
    }
    requestLogger.log({
      method: 'USER PATCH',
      level: "info",
      message: `User PATCH request from Ip Address ${ip} with requested updates: [${updates}]`,
      meta: { dataToModify: updates, fieldsModified: req.body}

    });
    res.send(user)
  } catch (error) {
    requestLogger.log({
      method: 'USER PATCH',
      level: "error",
      message: `User PATCH request from Ip Address ${ip} with ERROR: ${error}`,
      meta: {dataToModify: {id: _id, fields: updates}}
    });
    res.status(400).send(error.message)
  }
})

app.delete('/users/:id', async(req, res) => {
  const ip = req.ip
  _id = req.params.id
  try {
    const user = await User.findByIdAndDelete(_id)

    if (!user) {
      requestLogger.log({
        method: 'USER DELETE',
        level: "error",
        message: `User DELETE request from Ip Address ${ip} with ERROR: User Not Found`,
      });
    }
    requestLogger.log({
      method: 'USER DELETE',
      level: "info",
      message: `User DELETE request from Ip Address ${ip}: ${user.name} deleted`,
      meta: {data: user}
    });
    res.send(user)
  } catch (error) {
    requestLogger.log({
      method: 'USER DELETE',
      level: "error",
      message: `User DELETE request from Ip Address ${ip} failed with ERROR: ${error.message}`,
    });
    res.status(500).send(error.message)
  }
})

app.post("/tasks", async (req, res) => {
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

//Get all tasks
app.get("/tasks", async (req, res) => {
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

app.get("/tasks/:id", async (req, res) => {
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

app.patch('/tasks/:id', async (req, res) => {
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
    const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

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

app.delete('/tasks/:id', async(req, res) => {
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


app.listen(port, () => {
  logger.log({
    level: "info",
    message: `Server is running on port ${port}`,
  });
});
