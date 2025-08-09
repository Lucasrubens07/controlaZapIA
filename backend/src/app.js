const express = require('express');
const cors = require('cors');
require('dotenv').config();

const gastosRoutes = require('./routes/gastos.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/gastos', gastosRoutes);

module.exports = app;
