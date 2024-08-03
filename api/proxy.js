import express from 'express';
import httpProxy from 'http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

app.use(express.static(path.join(__dirname, 'static')));

app.get('/proxy', (req, res) => {
    const targetUrl = req.query.target;

    if (targetUrl) {
        proxy.web(req, res, { target: targetUrl }, (err) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        });
    } else {
        res.status(404).send('Not Found');
    }
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'static', '404.html'));
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).sendFile(path.join(__dirname, 'static', '500.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
