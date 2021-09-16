const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 1338;
const serve = express.static(__dirname + '/public');

app.use(cors());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        errors: [
            {
                status: err.status,
                title: err.message,
                detail: err.message,
            },
        ],
    });
});

app.use('/', express.static(__dirname));

const server = app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    console.log(`> Ready on http://localhost:${port}`);
});

module.exports = server;
