import express from 'express';
import httpProxy from 'http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

app.use(express.static(path.join(__dirname, '../static')));

// Proxy endpoint
app.get('/proxy', (req, res) => {
    const targetUrl = req.query.target;

    if (!targetUrl) {
        console.error('Target URL is missing');
        return res.status(400).send('Target URL is required');
    }

    console.log('Proxying request for:', targetUrl);

    proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (err) => {
        if (err) {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        }
    });
});

// Serve static files
app.use((req, res, next) => {
    console.log('Serving static file for:', req.url);
    res.status(404).sendFile(path.join(__dirname, '../static', '404.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).sendFile(path.join(__dirname, '../static', '500.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
