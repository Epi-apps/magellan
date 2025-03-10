const express = require('express');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth.js');
const cors = require('cors');


const port = 5000;

var app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
