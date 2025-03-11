import { useEffect, useState } from "react";
import { Octokit } from "octokit";
import RepoCard, { RepoCardMax } from "./Repos";

interface CreateRepoFormProps {
    accessToken: string;
}

interface issue {
  title: string,
  description: string,
  assignee: string,
}

interface repos {
  name: string,
  description: string,
  owner: string,
  issues: issue[]
}


export default function CreateRepoForm({ accessToken }: CreateRepoFormProps) {
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState(null);
  const [repositories, setRepositories] = useState<repos[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<repos | null>(null);
  
  const octokit = new Octokit({
      auth: accessToken
  })

  
  useEffect(() => {
      const fetchRepositories = async () => {
          try {
              const response = await octokit.request("GET /user/repos", {
                  headers: {
                      "X-GitHub-Api-Version": "2022-11-28",
                  },
              });

              console.log(response)
              
              const fetchedRepos: repos[] = response.data.map((repo: any) => ({
                  name: repo.name,
                  description: repo.description,
                  owner: repo.owner.login,
                  issues: [],
              }));
              setRepositories(fetchedRepos);
          } catch (error: any) {
              setMessage(`❌ Error fetching repositories: ${error.response?.data?.message || error.message}`);
          }
      };
      fetchRepositories();
    }, []);
    

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
        })

      setMessage(`✅ Repository created: ${response.data.html_url}`);
      setRepoName("");
      setDescription("");
      setIsPrivate(false);
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      <div className="w-1/2 bg-blue-500 flex items-center justify-center">
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
      </div>
      <div className="w-1/2 bg-slate-500 h-screen p-10 overflow-auto">
      {selectedRepo ? (
        <RepoCardMax key={selectedRepo.name} repository={selectedRepo} onSelect={() => setSelectedRepo(null)} octokit={octokit} />
      ) : (
        <div className="w-full bg-slate-500 h-screen p-4 overflow-auto grid grid-cols-3 gap-4">
          {repositories.map((repo) => (
            <RepoCard key={repo.name} repository={repo} onSelect={() => setSelectedRepo(repo)} octokit={octokit} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}