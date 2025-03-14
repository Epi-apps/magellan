const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

router.get('/search', async (req, res) => {
    const query = req.query.query;
    const token = process.env.ACCESS_TOKEN;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`, {
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

// Ne pas utiliser celui la, l'autre est dans downloader.js
router.post('/download_repo', async (req, res) => {
    const { repoUrl } = req.body;
    const repoZipUrl = `${repoUrl}/archive/refs/heads/main.zip`;
    const filePath = path.join(__dirname, 'repo-main.zip');

    try {
        const response = await axios({
            url: repoZipUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log('Repository downloaded successfully');
            res.status(200).json({ message: 'Repository downloaded successfully' });
        });

        writer.on('error', (err) => {
            console.error('Error writing file:', err);
            res.status(500).json({ error: 'Failed to write file' });
        });
    } catch (error) {
        console.error('Error downloading repository:', error);
        res.status(500).json({ error: 'Failed to download repository' });
    }
});

module.exports = router;

