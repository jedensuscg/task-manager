const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const { logger, requestLogger } = require("../logger");

// Post New User
router.post("/users", async (req, res) => {
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

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.FindByCredentials(req.body.email, req.body.password, req.ip)
    res.send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

// Get All Users
router.get("/users", async (req, res) => {
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

// Get User By ID
router.get("/users/:id", async (req, res) => {
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

//Update User by ID
router.patch('/users/:id', async (req, res) => {
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
    const user = await User.findById(_id)

    updates.forEach((update) => user[update] = req.body[update])
    await user.save()

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

//Delete User by ID
router.delete('/users/:id', async(req, res) => {
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

module.exports = router