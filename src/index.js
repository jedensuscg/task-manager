const express = require("express");
require("./db/mongoose");
require("dotenv").config();
const { logger } = require("./logger");

const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
  logger.log({
    level: "info",
    message: `Server is running on port ${port}`,
  });
});
