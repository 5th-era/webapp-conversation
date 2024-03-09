const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'localhost+2-key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, 'localhost+2.pem'), 'utf8')
    // key: fs.readFileSync(path.join(__dirname, '../d5j.sharedir/finance.d5j.ai.key'), 'utf8'),
    // cert: fs.readFileSync(path.join(__dirname, '../d5j.sharedir/finance.d5j.ai.pem'), 'utf8')
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, '0.0.0.0', err => {
        if (err) throw err;
        console.log('> Ready on https://localhost:3000');
    });
});
