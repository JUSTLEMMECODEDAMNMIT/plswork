import express from 'express';
import httpProxy from 'http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

app.use(express.static(path.join(__dirname, 'static')));

// Proxy endpoint
app.get('/proxy', (req, res) => {
    const targetUrl = req.query.target;

    if (targetUrl) {
        console.log('Proxying to:', targetUrl);
        proxy.web(req, res, { target: targetUrl }, (err) => {
            if (err) {
                console.error('Proxy error:', err);
                res.status(500).send('Proxy error');
            }
        });
    } else {
        console.log('404 Not Found - No target URL provided');
        res.status(404).send('Not Found');
    }
});

// Handle 404 for other routes
app.use((req, res, next) => {
    console.log('404 Not Found - Serving 404.html');
    res.status(404).sendFile(path.join(__dirname, 'static', '404.html'));
});

// Handle errors
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).sendFile(path.join(__dirname, 'static', '500.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
