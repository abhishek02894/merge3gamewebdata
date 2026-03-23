import { formatDistanceToNow, format } from "date-fns"

export function formatBytes(bytes: number | bigint | null | undefined): string {
  if (bytes == null) return "—"
  const n = typeof bytes === "bigint" ? Number(bytes) : bytes
  if (n === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(n) / Math.log(1024))
  return `${(n / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

export function formatPercentage(pct: number | null | undefined): string {
  if (pct == null) return "—"
  return `${pct.toFixed(1)}%`
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return format(new Date(date), "MMM d, yyyy")
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return format(new Date(date), "MMM d, yyyy HH:mm")
}

export function formatVersion(
  name: string | null | undefined,
  code: number | null | undefined
): string {
  if (!name) return "—"
  return code ? `v${name} (${code})` : `v${name}`
}

export function formatCommitType(message: string): string {
  const match = message.match(/^(feat|fix|chore|perf|docs|style|refactor|test|ci|build)(\(.+?\))?:/)
  return match ? match[1] : "other"
}

export function groupCommitsByType<T extends { message: string }>(
  commits: T[]
): Record<string, T[]> {
  const groups: Record<string, T[]> = {}
  for (const commit of commits) {
    const type = formatCommitType(commit.message)
    if (!groups[type]) groups[type] = []
    groups[type].push(commit)
  }
  return groups
}

export const statusColors: Record<string, string> = {
  DETECTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  BUILDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  REVIEW: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  ROLLING_OUT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  HALTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}
