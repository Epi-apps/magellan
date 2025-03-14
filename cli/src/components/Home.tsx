import { useState } from "react";
import { Octokit } from "octokit";

interface CreateRepoFormProps {
    accessToken: string;
}

export default function CreateRepoForm({ accessToken }: CreateRepoFormProps) {
    const [repoName, setRepoName] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [message, setMessage] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [keyword, setKeyword] = useState('');

    console.log(accessToken);

    const octokit = new Octokit({
        auth: accessToken
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await octokit.request('POST /user/repos', {
                name: repoName,
                description: description,
                homepage: 'https://github.com',
                'private': isPrivate,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            setMessage(`✅ Repository created: ${response.data.html_url}`);
            setRepoName("");
            setDescription("");
            setIsPrivate(false);
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/github/search/?query=${query}`);
            const json = await response.json();
            setResults(json);
        } catch (error) {
            console.log('Error fetching search results:', error);
        }
    };

    const handleDownloadRepo = async (repoUrl) => {
        try {
            const response = await fetch('http://localhost:5000/github/download_repo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ repoUrl })
            });
            if (response.ok) {
                setMessage('✅ Repository download initiated on the server.');
            } else {
                console.log('Error initiating repository download:', response.statusText);
                setMessage('❌ Error initiating repository download.');
            }
        } catch (error) {
            console.log('Error initiating repository download:', error);
            setMessage('❌ Error initiating repository download.');
        }
    };

    const handleDownloadByKeyword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/downloader/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ keyword })
            });
            if (response.ok) {
                setMessage('✅ Repository download initiated on the server.');
            } else {
                console.log('Error initiating repository download:', response.statusText);
                setMessage('❌ Error initiating repository download.');
            }
        } catch (error) {
            console.log('Error initiating repository download:', error);
            setMessage('❌ Error initiating repository download.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-slate-500 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Create a GitHub Repository</h2>
                {message && <p className="mb-4 text-center text-sm text-gray-700">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Repository Name
                        <input
                            type="text"
                            value={repoName}
                            onChange={(e) => setRepoName(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border rounded"
                        />
                    </label>
                    <label className="block mb-2">
                        Description (optional)
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                        ></textarea>
                    </label>
                    <label className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        Private Repository
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Create Repository
                    </button>
                </form>
            </div>
            <div className="bg-slate-500 p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
                <h2 className="text-xl font-bold mb-4 text-center">Search for a repository</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='w-full mt-1 p-2 border rounded text-black'
                    />
                    <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-2'>Search</button>
                </form>
                <div className='mt-4'>
                    {results.map((result, index) => (
                        <div key={index} className='p-2 border-b border-gray-700 flex justify-between items-center'>
                            {result.name}
                            <button
                                onClick={() => handleDownloadRepo(result.html_url)}
                                className='bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600'
                            >
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-slate-500 p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
                <h2 className="text-xl font-bold mb-4 text-center">Download Repository by Keyword</h2>
                <form onSubmit={handleDownloadByKeyword}>
                    <input
                        type='text'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className='w-full mt-1 p-2 border rounded text-black'
                    />
                    <button type='submit' className='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-2'>Download</button>
                </form>
            </div>
        </div>
    );
}
