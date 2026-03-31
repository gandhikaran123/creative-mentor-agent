import { AlertTriangle, CheckCircle2, Info, Lightbulb, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const dummyResults = {
  overallScore: 78,
  summary: "The creative meets most brand and compliance requirements but has a few issues that need attention before approval.",
  categories: [
    { name: "Brand Compliance", score: 92 },
    { name: "Legal / Regulatory", score: 65 },
    { name: "Visual Quality", score: 85 },
    { name: "Accessibility", score: 70 },
  ],
  issues: [
    {
      severity: "high" as const,
      title: "Missing required disclaimer",
      description: "FTC requires disclosure of material connection for sponsored content. No disclaimer found in the creative.",
      rule: "FTC Endorsement Guidelines §255.5",
    },
    {
      severity: "high" as const,
      title: "Contrast ratio below threshold",
      description: "CTA button text has a contrast ratio of 3.2:1, which falls below the WCAG 2.1 AA minimum of 4.5:1.",
      rule: "WCAG 2.1 Level AA - 1.4.3",
    },
    {
      severity: "medium" as const,
      title: "Logo clear space violation",
      description: "The brand logo is positioned too close to the edge. Minimum clear space of 24px is required; current spacing is ~12px.",
      rule: "Brand Guidelines v3.2 §4.1",
    },
    {
      severity: "low" as const,
      title: "Non-standard font weight used",
      description: "Body text uses font weight 300, which is not in the approved typography scale (400, 500, 600, 700).",
      rule: "Brand Guidelines v3.2 §5.3",
    },
  ],
  suggestions: [
    "Add 'Sponsored' or '#Ad' label in a clearly visible position within the first 3 seconds of viewable area.",
    "Increase CTA button text contrast by using the primary-foreground color on the primary background.",
    "Move logo inward by at least 12px to meet the 24px clear-space requirement.",
    "Consider using the approved 'Inter 400' weight instead of 300 for body copy.",
    "Add alt text metadata for the product image to improve accessibility scoring.",
  ],
};

function severityIcon(severity: string) {
  switch (severity) {
    case "high":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "medium":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "low":
      return <Info className="h-4 w-4 text-info" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
}

function severityBadge(severity: string) {
  const variants: Record<string, string> = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-info/10 text-info border-info/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${variants[severity] || ""}`}>
      {severity}
    </span>
  );
}

function scoreColor(score: number) {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

export function ReviewResults() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Review Results</h3>
          <Badge variant="outline" className="text-xs">
            Just now
          </Badge>
        </div>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className={`text-5xl font-bold tabular-nums ${scoreColor(dummyResults.overallScore)}`}>
              {dummyResults.overallScore}
            </span>
            <span className="text-xs text-muted-foreground mt-1">/ 100</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-3">{dummyResults.summary}</p>
            <div className="grid grid-cols-2 gap-3">
              {dummyResults.categories.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className={`font-medium ${scoreColor(cat.score)}`}>{cat.score}</span>
                  </div>
                  <Progress value={cat.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Issues */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Issues Found ({dummyResults.issues.length})
        </h3>
        <div className="space-y-3">
          {dummyResults.issues.map((issue, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
              {severityIcon(issue.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{issue.title}</span>
                  {severityBadge(issue.severity)}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{issue.description}</p>
                <span className="text-[10px] text-muted-foreground font-mono">{issue.rule}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Suggestions
        </h3>
        <div className="space-y-2">
          {dummyResults.suggestions.map((suggestion, i) => (
            <div key={i} className="flex gap-3 items-start text-sm">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{suggestion}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
