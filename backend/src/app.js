require('dotenv').config();
const express = require('express');
const cors = require('cors');

const homeRouter = require('./routers/home_router');
const userRouter = require('./routers/user_router');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', homeRouter);
app.use('/users', userRouter);

module.exports = app;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
