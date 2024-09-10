const mongoose = require('mongoose');

    
mongoose
.connect(process.env.MONGODB_URI)  
.then(() => {
  console.log("Connected to Mongo Db");
})
.catch((err) => {
  console.log("Error connecting to MongoDb", err);
});     
