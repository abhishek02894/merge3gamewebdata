export const dynamic = "force-dynamic"

import Link from "next/link"
import { notFound } from "next/navigation"
import { getReleaseDetail } from "@/lib/data/releases"
import { StatusBadge } from "@/components/status-badge"
import { CommitList } from "@/components/commit-list"
import { RolloutHistory } from "@/components/rollout-history"
import { RolloutChart } from "@/components/rollout-chart"
import { BuildInfoCard } from "@/components/build-info-card"
import { formatVersion, formatDate } from "@/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Tag, GitCommit, TrendingUp } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; releaseId: string }>
}) {
  const { releaseId } = await params
  const release = await getReleaseDetail(releaseId)
  return {
    title: release
      ? `v${release.versionName} - ${release.game.name}`
      : "Not Found",
  }
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ id: string; releaseId: string }>
}) {
  const { id, releaseId } = await params
  const release = await getReleaseDetail(releaseId)

  if (!release) notFound()

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/games/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {release.game.name}
      </Link>

      {/* Release Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Tag className="size-5 text-primary" />
        <h1 className="text-2xl font-bold">
          {formatVersion(release.versionName, release.versionCode)}
        </h1>
        <StatusBadge status={release.status} />
        <span className="text-sm text-muted-foreground">
          {formatDate(release.releaseDate)}
        </span>
      </div>

      {release.changelog && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm whitespace-pre-wrap">{release.changelog}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Commits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <GitCommit className="size-4" />
              Commits ({release.commits.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommitList commits={release.commits} />
          </CardContent>
        </Card>

        {/* Right column: Rollout + Build */}
        <div className="space-y-6">
          <RolloutChart entries={release.rolloutEntries} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="size-4" />
                Rollout History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RolloutHistory entries={release.rolloutEntries} />
            </CardContent>
          </Card>

          <BuildInfoCard buildInfo={release.buildInfo} />
        </div>
      </div>
    </div>
  )
}
