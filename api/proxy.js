const { createServer } = require('http');
const { createProxyServer } = require('http-proxy');
const url = require('url');
const proxy = createProxyServer({});

const server = createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const targetUrl = parsedUrl.query.target;

    if (targetUrl) {
        proxy.web(req, res, { target: targetUrl, changeOrigin: true });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Proxy</h1><p>Use <code>?target=URL</code> to proxy a request.</p></body></html>');
    }
});

server.on('error', (err, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
});

server.listen(3000, () => {
    console.log('Proxy server is listening on port 3000');
});
