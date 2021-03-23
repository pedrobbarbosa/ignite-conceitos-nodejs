const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete 
  const {username} = request.headers;

  const user = users.find( user => user.username === username);

  if (!user) {
    return response.status(404).json({error: 'User not found'});
  }

  request.user = user;

  next();
}

function checkIfUserAlreadyExists(request, response, next) {
  const {name, username} = request.body;

  const user = users.some(user => user.username === username);

  if (user) {
    return response.status(400).json({error: 'User already exists'});
  }

  next();
}

app.post('/users', checkIfUserAlreadyExists, (request, response) => {
  // Complete 
  const {name, username} = request.body;

  if ( !(name && username)) {
    return response.status(400).json({credentials: 'You need to pass name and username'});
  }

  const user = {
    id: v4(),
    name,
    username,
    todos: [],
    created_at: new Date()
  };

  users.push(user);

  request.user = user;

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  const {user} = request;

  const taskNameAlreadyExist = user.todos.find(todo => todo.title === title);

  if (taskNameAlreadyExist) {
    return response.status(400).json({error: 'This task name already exists'});
  }

  const task = {
    id: v4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(task);

  return response.status(201).json(task);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete 
  const {title, deadline} = request.body;
  const {id} = request.params;
  const {user} = request;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: 'Todo not found'});
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "task not founded"})
  }
  todo.done = true

  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "task not founded"})
  }

  user.todos.splice(todo, 1);

  return response.status(204).send("No content");

});

module.exports = app;