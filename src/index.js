const express = require('express')
require('./db/mongoose')
require('dotenv').config()
const {
  logger,
  requestLogger
} = require('./logger')

const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())


app.post('/users', (req, res) => {
  const ip = req.ip
  const user = new User(req.body)
  console.log(user)
  requestLogger.log({
    level: 'info',
    message: `User POST request from Ip Address ${ip}: ${JSON.stringify(user)}`
  })

  user.save().then(() => {
    requestLogger.log({
      level: 'info',
      message: `New user added by IP Address ${ip}. ID: ${user._id}`
    })
    res.status(201).send(user)
  }).catch((error) => {
    requestLogger.log({
      level: 'error',
      message: `IP Address: ${ip}: ${error}`
    })
    res.status(400).send(error.message)
  })
})

app.get('/users', (req, res) => {
  const ip = req.ip
  requestLogger.log({
    level: 'info',
    message: `User GET ALL request from IP Address ${ip}`
  })
  User.find({}).then((users) => {
    requestLogger.log({
      level: 'info',
      message: `Successful User GET ALL request from IP Address ${ip}`
    })
    res.send(users)
  }).catch(() => {

  })
})

app.post('/tasks', (req, res) => {
  const ip = req.ip
  const task = new Task(req.body)
  requestLogger.log({
    level: 'info',
    message: `Task POST request from IP Address ${ip}: ${JSON.stringify(task)}`
  })

  task.save().then(() => {
    requestLogger.log({
      level: 'info',
      message: `New task added by IP Address ${ip}. ID: ${task._id}`
    })
    res.status(201).send(task)
  }).catch((error) => {
    requestLogger.log({
      level: 'error',
      message: `IP Address: ${ip}: ${error}`
    })
    res.status(400).send(error.message)
  })
})

app.listen(port, () => {
  logger.log({
    level: 'info',
    message: `Server is running on port ${port}`
  })
})