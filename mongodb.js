//CRUD create read update delete

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log("Unable to connect to database");
  }

  const db = client.db(databaseName);
  
  db.collection("users").findOne({ name: "James" }, (error, user) => {
    if (error) {
      return console.log(error);
    }

    console.log(user);
  });

  db.collection('users').find({age: 38}).toArray((error, users) => {
    if (error) {
      return console.log('Can not return user')
    }

    console.log(users)
  })

});
