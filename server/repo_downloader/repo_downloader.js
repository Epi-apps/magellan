const fs = require('fs');
const path = require('path');
const axios = require('axios');

const repoMappings = {
    "C": "https://github.com/daytonaio/sample-c",
    "Racket": "https://github.com/daytonaio/sample-racket",
    "Deno": "https://github.com/daytonaio/sample-deno",
    "Zig": "https://github.com/daytonaio/sample-zig",
    "Prolog": "https://github.com/daytonaio/sample-prolog",
    "R": "https://github.com/daytonaio/sample-r",
    "Fortran": "https://github.com/daytonaio/sample-fortran",
    "Cobol": "https://github.com/daytonaio/sample-cobol",
    "Ada": "https://github.com/daytonaio/sample-ada",
    "Julia": "https://github.com/daytonaio/sample-julia",
    "Python": "https://github.com/daytonaio/sample-python",
    "Ruby": "https://github.com/daytonaio/sample-ruby",
    "Php": "https://github.com/daytonaio/sample-php",
    "Go": "https://github.com/daytonaio/sample-go",
    "Dotnet": "https://github.com/daytonaio/sample-dotnet",
    "Java": "https://github.com/daytonaio/sample-java",
    "Cpp": "https://github.com/daytonaio/sample-cpp",
    "Rust": "https://github.com/daytonaio/sample-rust",
};
//https://github.com/orgs/daytonaio/repositories?q=sample&page=4

async function downloadRepo(keyword, outputDir = "./downloads") {
    try {
        if (!repoMappings[keyword]) {
            console.error(`No repository found for keyword: ${keyword}`);
            return;
        }

        const repoUrl = repoMappings[keyword];
        const repoName = repoUrl.split('/').pop();
        const zipUrl = `${repoUrl}/archive/refs/heads/main.zip`; // branche main

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filePath = path.join(outputDir, `${repoName}.zip`);

        console.log(`Downloading ${repoName} from ${zipUrl}...`);

        const response = await axios({
            url: zipUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`Download complete: ${filePath}`);
    } catch (error) {
        console.error("Error downloading repository:", error.message);
    }
}

module.exports = downloadRepo;
