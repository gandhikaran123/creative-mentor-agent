import { CheckCircle2, BookOpen, Shield, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const knowledgeSources = [
  {
    icon: Shield,
    title: "Compliance Rules",
    description: "FTC guidelines, GDPR disclaimers, accessibility standards",
    items: ["FTC Endorsement Guidelines", "GDPR Cookie Consent", "WCAG 2.1 AA"],
    status: "loaded" as const,
  },
  {
    icon: BookOpen,
    title: "Brand Guidelines",
    description: "Logo usage, color palette, tone of voice, typography",
    items: ["Logo Clear Space", "Primary Color Palette", "Brand Voice"],
    status: "loaded" as const,
  },
  {
    icon: Package,
    title: "Product Knowledge",
    description: "Product claims, pricing rules, promotional constraints",
    items: ["Approved Claims", "Pricing Display Rules", "Promo Restrictions"],
    status: "loaded" as const,
  },
];

export function KnowledgePanel() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Loaded Knowledge</h3>
      <div className="space-y-2">
        {knowledgeSources.map((source) => (
          <Card key={source.title} className="p-3">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-secondary p-1.5">
                <source.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{source.title}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                </div>
                <p className="text-xs text-muted-foreground mb-2">{source.description}</p>
                <div className="flex flex-wrap gap-1">
                  {source.items.map((item) => (
                    <Badge key={item} variant="secondary" className="text-[10px] font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
