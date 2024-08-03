const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const targetUrl = parsedUrl.query.target;

    if (targetUrl) {
        proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (e) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Something went wrong. And we are reporting a custom error message.');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.on('error', (err) => {
    console.error('Error:', err);
    // Optionally handle specific errors or send a response
});

server.listen(3000, () => {
    console.log('Proxy server is listening on port 3000');
});
