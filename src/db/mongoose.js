const mongoose = require("mongoose");
const validator = require('validator')

mongoose.connect("mongodb://127.0.0.1:27017/task-manager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// const User = mongoose.model("user", {
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value) {
//       if (value < 0) {
//         throw new Error('Age must be a positive number')
//       }
//     }
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error('Invalid email format')
//       }
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     minLength: 7,
//     validate(value) {
//       if (value.toLowerCase().includes('password')) {
//         throw new Error('Password can not contain "password" ')
//       }
//     }

//   }
// });

// const newUser = new User({
//   name: 'James',
//   age: 38,
//   email: " jedensuscg@gmail.com",
//   password: "PassTt"
// })

// newUser.save().then(() => {
//   console.log(newUser)
// }).catch((error) => {
//   console.log(error.message)
// })


const Task = mongoose.model("task", {
  description: { 
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

const newTask = new Task({
  description: 'Clean Room ',
  completed: false,
})
newTask.save().then(() => {
  console.log(newTask)
}).catch((error) => {
  console.log(error)
})

