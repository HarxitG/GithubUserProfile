import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
}

interface CommitWeek {
  total: number;
  week: number;
  days: number[];
}

export default function UserRepos({ username }: { username: string }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [commitData, setCommitData] = useState<{ day: string; commits: number }[]>([]);


  // Fetch list of repos
  useEffect(() => {
    if (!username) return;

    fetch(`https://api.github.com/users/${username}/repos`)
      .then((res) => res.json())
      .then((data) => setRepos(data))
      .catch(() => setRepos([]));
  }, [username]);

  // Fetch commit activity
  useEffect(() => {
    if (!selectedRepo) return;

    fetch(`https://api.github.com/repos/${username}/${selectedRepo}/stats/commit_activity`)
      .then((res) => res.json())
      .then((data: CommitWeek[]) => {
        // Sum the days into one array of day totals (Sun-Sat)
        const dailyTotals = Array(7).fill(0);
        data.forEach((week) => {
          week.days.forEach((commits, i) => {
            dailyTotals[i] += commits;
          });
        });

        const chartData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => ({
          day,
          commits: dailyTotals[i],
        }));

        setCommitData(chartData);
      });
  }, [selectedRepo, username]);

  return (
    <div className="grid gap-4 mt-6">
      <h2 className="text-xl font-bold">Repositories</h2>
      {repos.map((repo) => (
        <Card
          key={repo.id}
          className="cursor-pointer hover:border-blue-500 transition"
          onClick={() => setSelectedRepo(repo.name)}
        >
          <CardContent className="p-4">
            <a href={repo.html_url} className="text-blue-600 font-semibold" target="_blank">
              {repo.name}
            </a>
            <p className="text-sm text-muted-foreground">{repo.description || "No description"}</p>
          </CardContent>
        </Card>
      ))}

      {selectedRepo && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📊 Commit Activity - {selectedRepo}</h3>
          {commitData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commitData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commits" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">Loading chart data...</p>
          )}
        </div>
      )}
    </div>
  );
}

