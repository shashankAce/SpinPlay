const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    app.use(express.static(path.join(__dirname, '..', 'dist')));
} else {
    // In dev, you probably run webpack-dev-server directly -> no need to serve client via Express.
    // But if you still want Express to serve client files without webpack-dev-server, uncomment below:
    // app.use(express.static(path.join(__dirname, '..', 'client')));
    console.log('⚠️  Running in dev mode — prefer running `npm run dev` (webpack-dev-server)');
}

app.get('/', (req, res) => {
    const file = isProd ? 'dist/index.html' : 'client/index.html';
    res.sendFile(path.join(__dirname, '..', file));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (prod=${isProd})`);
});
