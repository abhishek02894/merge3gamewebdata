import { formatRelativeDate, groupCommitsByType } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { GitCommit } from "lucide-react"

type Commit = {
  id: string
  hash: string
  shortHash: string
  message: string
  author: string
  committedAt: Date | string
  url: string | null
}

const typeLabels: Record<string, string> = {
  feat: "Features",
  fix: "Bug Fixes",
  chore: "Chores",
  perf: "Performance",
  docs: "Documentation",
  style: "Styling",
  refactor: "Refactoring",
  test: "Tests",
  ci: "CI/CD",
  build: "Build",
  other: "Other",
}

export function CommitList({ commits }: { commits: Commit[] }) {
  const grouped = groupCommitsByType(commits)

  if (commits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">No commits recorded</p>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([type, typeCommits]) => (
        <div key={type}>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {typeLabels[type] ?? type}
            </Badge>
            <span className="text-muted-foreground text-xs">
              ({typeCommits.length})
            </span>
          </h4>
          <ul className="space-y-1.5">
            {typeCommits.map((commit) => (
              <li key={commit.id} className="flex items-start gap-2 text-sm">
                <GitCommit className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{commit.message}</p>
                  <p className="text-xs text-muted-foreground">
                    <code className="text-xs">{commit.shortHash}</code>
                    {" by "}
                    {commit.author}
                    {" · "}
                    {formatRelativeDate(commit.committedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
