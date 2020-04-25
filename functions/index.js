const functions = require("firebase-functions");
const app = require("express")();

const 
{
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo
} = require("./Api/todos");


app.get('/todos', getAllTodos);
app.post('/todos', postOneTodo);
app.delete('/todo/:id', deleteTodo);
app.put('/todo/:id', editTodo);

exports.api = functions.https.onRequest(app);