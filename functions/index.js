const functions = require("firebase-functions");
const app = require("express")();

const auth = require("./Util/auth");

const 
{
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo
} = require("./Api/todos");

const 
{
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require("./Api/users");

//TODO: getOneTodo
app.get('/todos', auth,getAllTodos);
app.post('/todos',auth, postOneTodo);
app.delete('/todo/:id',auth, deleteTodo);
app.put('/todo/:id',auth, editTodo);

app.post('/login', loginUser);
app.post('/signup', signUpUser);

app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);