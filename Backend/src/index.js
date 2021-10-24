const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const todoListRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(todoListRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen port ${port}`);
});
