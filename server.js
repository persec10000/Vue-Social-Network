const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf8");
const resolvers = require("./resolvers");

require("dotenv").config({ path: "variable.env" });
const User = require("./models/User");
const Post = require("./models/Post");

mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch(err => console.log(err));

const todos = [
  { task: "wash car", completed: false },
  { task: "do something", completed: true }
];

const server = new ApolloServer({
  typeDefs,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log("Server is running... " + url);
});
