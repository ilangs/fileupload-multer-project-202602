const express = require('express');
const app = express();
const shopRouter = require('./routes/shop');

app.use("/", shopRouter);
module.exports = app;