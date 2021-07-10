//CRUD create read update delete

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log("Unable to connect to database");
  }

  const db = client.db(databaseName);

  updatePromise = db.collection('tasks').updateMany(
    {
      completed: false
    },
    {
      $set: { completed: true },
    }
  );

  updatePromise.then((user) => {
    console.log(user)
  }).catch((error) => {
    console.log(error)
  })
});
