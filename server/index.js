const express = require('express');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth.js');
const githubRoutes = require('./routes/github.js');
const downloadRoutes = require('./routes/downloader.js');
const cors = require('cors');
const downloadRepo = require('./repo_downloader/repo_downloader.js');


const port = 5000;

var app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/auth', authRoutes);
app.use("/github", githubRoutes)
app.use("/downloader", downloadRoutes)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
