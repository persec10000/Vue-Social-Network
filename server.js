const { ApolloServer, gql } = require("apollo-server");

const todos = [
  { task: "wash car", completed: false },
  { task: "do something", completed: true }
];

const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }
  type Query {
    getTodos: [Todo]
  }
  # type Mutation {
  #   addTodo(task: String, completed: Boolean): Todo
  # }
`;

// const resolvers = {
//   Query: {
//     getTodos: () => {
//       return todos;
//     }
//   }
// Mutation: {
//   addTodo: (_, { task, completed }) => {
//     const todo = {
//       task,
//       completed
//     };
//     todos.push(todo);
//     return todo;
//   }
// }
// };

const server = new ApolloServer({
  typeDefs
});

server.listen().then(({ url }) => {
  console.log("Server is running... " + url);
});
