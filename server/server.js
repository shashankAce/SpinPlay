const { log } = require('console');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '..', 'dist')));
// app.use(express.static(path.join(__dirname, '..', 'client')));
app.get('/', (req, res) => {
    log('bingo');
    // const file = isProd ? 'dist/index.html' : 'client/index.html';
    // res.sendFile(path.join(__dirname, '..', file));
});

app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT} (prod=${isProd})`);
    console.log(`Server is running on port ${PORT}`);
});
