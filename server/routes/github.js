const express = require('express');
const router = express.Router();

router.get('/search', async (req, res) => {

    const { default: fetch } = await import('node-fetch');

    const query = req.query.query;
    const token = process.env.ACCESS_TOKEN;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const data = await response.json();
        res.json(data.items);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

module.exports = router;
