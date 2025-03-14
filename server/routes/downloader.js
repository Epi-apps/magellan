const express = require('express');
const router = express.Router();
const downloadRepo = require('../repo_downloader/repo_downloader.js');

router.post('/download', async (req, res) => {
    try {
        const { keyword } = req.body;

        if (!keyword) {
            return res.status(400).json({ error: "Keyword is required" });
        }

        console.log(`request for download keyword: ${keyword}`);

        await downloadRepo(keyword);

        res.status(200).json({
            message: `Repository for '${keyword}' is being downloaded.`,
            status: "success"
        });
    } catch (error) {
        console.error("Error in /download route:", error);
        res.status(500).json({ error: "Failed to download repository" });
    }
});

module.exports = router;
