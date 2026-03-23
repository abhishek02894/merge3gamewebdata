import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatBytes } from "@/lib/formatters"
import { Package } from "lucide-react"

type BuildInfo = {
  buildNumber: string | null
  aabSizeBytes: bigint | null
  apkSizeBytes: bigint | null
  minSdkVersion: number | null
  targetSdkVersion: number | null
} | null

export function BuildInfoCard({ buildInfo }: { buildInfo: BuildInfo }) {
  if (!buildInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="size-4" />
            Build Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No build data available</p>
        </CardContent>
      </Card>
    )
  }

  const items = [
    { label: "Build Number", value: buildInfo.buildNumber ?? "—" },
    { label: "AAB Size", value: formatBytes(buildInfo.aabSizeBytes) },
    { label: "APK Size", value: formatBytes(buildInfo.apkSizeBytes) },
    { label: "Min SDK", value: buildInfo.minSdkVersion?.toString() ?? "—" },
    { label: "Target SDK", value: buildInfo.targetSdkVersion?.toString() ?? "—" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="size-4" />
          Build Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {items.map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
