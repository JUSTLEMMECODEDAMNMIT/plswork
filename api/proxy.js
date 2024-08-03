// api/proxy.js
export default async function handler(req, res) {
    let { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Convert URL to lowercase and check if it's a full URL or a search query
    url = url.toLowerCase().trim();
    let targetUrl;

    if (/^https?:\/\//i.test(url)) {
        targetUrl = url;
    } else {
        // Perform a Google search for the query
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }

    try {
        // Fetch the content from the provided URL
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const content = await response.text();

        // Set headers to ensure the response is treated as HTML
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch the URL' });
    }
}
