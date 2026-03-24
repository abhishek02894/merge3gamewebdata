"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

type Game = {
  id: string
  name: string
}

export function AddReleaseDialog({ games }: { games: Game[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  const [gameId, setGameId] = useState("")
  const [versionName, setVersionName] = useState("")
  const [versionCode, setVersionCode] = useState("")
  const [changelog, setChangelog] = useState("")
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [status, setStatus] = useState("COMPLETED")

  function resetForm() {
    setGameId("")
    setVersionName("")
    setVersionCode("")
    setChangelog("")
    setReleaseDate(new Date().toISOString().split("T")[0])
    setStatus("COMPLETED")
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!gameId || !versionName) {
      setError("Game and version are required")
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/releases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId,
            versionName,
            versionCode: versionCode ? Number(versionCode) : undefined,
            tagName: `v${versionName}`,
            releaseDate,
            changelog: changelog || undefined,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? "Failed to create release")
        }

        // Update status if not DETECTED (default)
        if (status !== "DETECTED") {
          const release = await res.json()
          await fetch(`/api/releases/${release.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        }

        resetForm()
        setOpen(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-xl shadow-md shadow-primary/20">
          <Plus className="size-4" />
          Add Release
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Release</DialogTitle>
          <DialogDescription>
            Manually add a release from Play Console
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game">Game</Label>
            <Select value={gameId} onValueChange={setGameId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="version">Version Name</Label>
              <Input
                id="version"
                placeholder="1.2.3"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Version Code</Label>
              <Input
                id="code"
                type="number"
                placeholder="123"
                value={versionCode}
                onChange={(e) => setVersionCode(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Release Date</Label>
              <Input
                id="date"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DETECTED">Detected</SelectItem>
                  <SelectItem value="ROLLING_OUT">Rolling Out</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="HALTED">Halted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="changelog">Description / Changelog</Label>
            <Textarea
              id="changelog"
              placeholder="What's new in this release..."
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={4}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="gap-1.5">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Release"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
