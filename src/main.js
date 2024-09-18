const express = require('express');
const app= express();
app.use(express.json());
require('dotenv').config();
const Auth = require("./Routes/Auth");
const errorHandler = require('./Services/utils/ErrorHandler');
app.use(Auth);
app.use(errorHandler)

const PORT = process.env.PORT || 3030
app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`)
});