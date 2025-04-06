import { useState } from "react";
import GitHubForm from "./components/GitHubForm";
import UserRepos from "./components/UserRepos";

function App() {
  const [username, setUsername] = useState("");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">GitHub Profile Analyzer</h1>
      <GitHubForm onSubmit={setUsername} />
      {username && <UserRepos username={username} />}
    </div>
  );
}

export default App;

