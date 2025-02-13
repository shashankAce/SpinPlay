const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '..', 'dist')));
// app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (req, res) => {
    // console.log(req);
    res.sendFile(path.join(__dirname, '..', 'client/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
