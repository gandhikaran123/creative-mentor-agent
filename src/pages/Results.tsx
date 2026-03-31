import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reviews = [
  { id: "REV-1042", asset: "summer-campaign-hero.png", brand: "Acme Corp", category: "Social Media Ad", score: 78, status: "needs_changes" as const, date: "2026-03-30T14:22:00Z" },
  { id: "REV-1041", asset: "product-banner-q2.jpg", brand: "Nova Labs", category: "Display Banner", score: 94, status: "approved" as const, date: "2026-03-29T09:15:00Z" },
  { id: "REV-1040", asset: "email-promo-spring.png", brand: "Orbit Media", category: "Email Header", score: 62, status: "needs_changes" as const, date: "2026-03-28T16:48:00Z" },
  { id: "REV-1039", asset: "landing-hero-v3.webp", brand: "Peak Digital", category: "Landing Page Hero", score: 88, status: "approved" as const, date: "2026-03-27T11:30:00Z" },
  { id: "REV-1038", asset: "social-carousel-01.png", brand: "Acme Corp", category: "Social Media Ad", score: 45, status: "rejected" as const, date: "2026-03-26T08:05:00Z" },
  { id: "REV-1037", asset: "product-shot-white.jpg", brand: "Nova Labs", category: "Product Photo", score: 91, status: "approved" as const, date: "2026-03-25T13:12:00Z" },
  { id: "REV-1036", asset: "retargeting-banner.png", brand: "Orbit Media", category: "Display Banner", score: 73, status: "needs_changes" as const, date: "2026-03-24T10:44:00Z" },
  { id: "REV-1035", asset: "newsletter-header-apr.png", brand: "Peak Digital", category: "Email Header", score: 96, status: "approved" as const, date: "2026-03-23T15:30:00Z" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-[hsl(142,71%,45%,0.1)] text-success border-[hsl(142,71%,45%,0.2)]" },
  needs_changes: { label: "Needs Changes", className: "bg-[hsl(38,92%,50%,0.1)] text-warning border-[hsl(38,92%,50%,0.2)]" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function scoreColor(score: number) {
  if (score >= 85) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Results() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Review History</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Past creative reviews with scores, status, and details.
        </p>
      </div>

      <Separator />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => {
              const status = statusConfig[r.status];
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                  <TableCell className="font-medium text-sm text-foreground">{r.asset}</TableCell>
                  <TableCell className="text-sm">{r.brand}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.category}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold tabular-nums ${scoreColor(r.score)}`}>{r.score}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatDate(r.date)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
