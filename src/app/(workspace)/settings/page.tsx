import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { formatDateTime } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { Settings, Webhook, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Settings - Game Release Tracker",
}

export default async function SettingsPage() {
  const webhookEvents = await prisma.webhookEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { game: { select: { name: true } } },
  })

  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="size-4" />
            Webhook Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Ingest Webhook URL</p>
            <code className="block rounded bg-muted p-2 text-sm">
              POST /api/webhooks/ingest
            </code>
            <p className="text-xs text-muted-foreground mt-1">
              Use this URL in Make.com to send GitLab commit/tag data
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">PlayStore Webhook URL</p>
            <code className="block rounded bg-muted p-2 text-sm">
              POST /api/webhooks/playstore
            </code>
            <p className="text-xs text-muted-foreground mt-1">
              Use this URL in Make.com to send Apify PlayStore data
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Authentication</p>
            <code className="block rounded bg-muted p-2 text-sm">
              Authorization: Bearer YOUR_API_SECRET
            </code>
            <p className="text-xs text-muted-foreground mt-1">
              Set API_SECRET env variable and use it in Make.com HTTP headers
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Games Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Registered Games</CardTitle>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No games registered. Run the seed script to add your games.
            </p>
          ) : (
            <div className="space-y-2">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{game.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {game.packageName}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>GitLab ID: {game.gitlabProjectId}</p>
                    {game.playStoreAppId && (
                      <p>PlayStore: {game.playStoreAppId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Event Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Webhook className="size-4" />
            Recent Webhook Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {webhookEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No webhook events yet. Configure Make.com to start receiving data.
            </p>
          ) : (
            <div className="space-y-2">
              {webhookEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-md border p-2 text-sm"
                >
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {event.source}
                  </Badge>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {event.eventType}
                  </Badge>
                  <span className="truncate text-muted-foreground">
                    {event.game?.name ?? "Unknown game"}
                  </span>
                  {event.error && (
                    <AlertCircle className="size-4 text-destructive shrink-0" />
                  )}
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(event.createdAt)}
                  </span>
                  {event.processedAt ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    >
                      OK
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                    >
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
