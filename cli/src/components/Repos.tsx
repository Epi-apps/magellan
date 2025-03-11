import { Octokit } from "octokit";
import { useEffect, useState } from "react";

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
  
  interface RepoCardProps {
    repository: repos;
    onSelect: () => void;
    octokit: Octokit
  }

  export function RepoCardMax({ repository, onSelect, octokit }: RepoCardProps) {
    const [newIssue, setNewIssue] = useState<issue>({ title: '', description: '', assignee: '' });
    const [isNew, setIsNew] = useState<boolean>(false);
    const [repo, setRepo] = useState<repos | null>(null);

    useEffect(() => {
        if (!repository) return;
        setRepo(repository);

        const fetchIssues = async () => {
            try {
                const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
                    owner: repository.owner,
                    repo: repository.name,
                    headers: {
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                });

                console.log(response);
                
                const issues = response.data.map((issue: any) => ({
                    title: issue.title,
                    description: issue.body || "No description",
                    assignee: issue.assignee?.login || "Unassigned",
                }));

                setRepo((prevRepo) => prevRepo ? { ...prevRepo, issues } : null);
            } catch (error) {
                console.error("Error fetching issues:", error);
            }
        };

        fetchIssues();
    }, [repository, octokit]);

    const createIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repo) return;

        try {
            await octokit.request(`POST /repos/${repo.owner}/${repo.name}/issues`, {
                owner: repo.owner,
                repo: repo.name,
                title: newIssue.title,
                body: newIssue.description,
                assignee: newIssue.assignee || undefined,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });

            alert("Issue created successfully!");
            setNewIssue({ title: "", description: "", assignee: "" });
            setIsNew(false);

            const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
                owner: repo.owner,
                repo: repo.name,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });

            const updatedIssues = response.data.map((issue: any) => ({
                title: issue.title,
                description: issue.body || "No description",
                assignee: issue.assignee?.login || "Unassigned",
            }));

            setRepo((prevRepo) => prevRepo ? { ...prevRepo, issues: updatedIssues } : null);

        } catch (error) {
            console.error("Error creating issue:", error);
        }
    };

    return (
        <div>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full border border-gray-300">
                <h3 className="text-2xl font-bold text-blue-600">{repo?.name}</h3>
                <p className="text-gray-700 text-md">{repo?.description || "No description available."}</p>
                <p className="text-gray-500 text-sm">Owner: {repo?.owner}</p>
                
                <div className="mt-3 text-black">
                    <h4 className="text-lg font-semibold">Issues:</h4>
                    {repo?.issues && repo.issues.length > 0 ? (
                        <ul className="list-disc pl-5 text-md">
                            {repo.issues.map((issue, index) => (
                                <li key={index}>
                                    <strong>{issue.title}</strong>: {issue.description} (Assigned to: {issue.assignee || "Unassigned"})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-md">No issues available.</p>
                    )}
                </div>
                <div className="mt-4 flex flex-row justify-between">
                    <button onClick={onSelect} className="bg-red-500 text-white p-2 rounded-lg transform transition-transform duration-300 hover:scale-105">Back</button>
                    <button onClick={() => setIsNew(true)} className="bg-blue-500 text-white p-2 rounded-lg transform transition-transform duration-300 hover:scale-105">New Issue</button>
                </div>
            </div>
            {isNew && (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full border border-gray-300 mt-10">
                    <form onSubmit={createIssue} className="mt-4">
                        <input type="text" placeholder="Issue title" value={newIssue.title} onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })} className="border p-2 w-full bg-slate-500 rounded-lg" required />
                        <textarea placeholder="Issue description" value={newIssue.description} onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })} className="border p-2 w-full mt-2 bg-slate-500 rounded-lg" required></textarea>
                        <input type="text" placeholder="Assignee (optional)" value={newIssue.assignee} onChange={(e) => setNewIssue({ ...newIssue, assignee: e.target.value })} className="border p-2 w-full mt-2 bg-slate-500 rounded-lg" />
                        <button type="submit" className="bg-blue-500 text-white p-2 mt-2 rounded-lg">Create Issue</button>
                    </form>
                </div>
            )}
        </div>
    );
}

  
  export default function RepoCard({ repository, onSelect }: RepoCardProps) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm border border-gray-300 transform transition-transform duration-300 hover:scale-105">
        <h3 className="text-lg font-bold text-blue-600 truncate">{repository.name}</h3>
        <p className="text-gray-700 text-sm truncate">{repository.description || "No description available."}</p>
        <p className="text-gray-500 text-xs truncate">Owner: {repository.owner}</p>
        <div className="mt-10">
          <button onClick={onSelect} className="bg-blue-600 p-2 rounded-lg">More</button>
        </div>
      </div>
    );
  }