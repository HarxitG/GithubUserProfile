import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: (username: string) => void;
}

export default function GitHubForm({ onSubmit }: Props) {
  const [username, setUsername] = useState("");

  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={() => onSubmit(username)}>Analyze</Button>
    </div>
  );
}
