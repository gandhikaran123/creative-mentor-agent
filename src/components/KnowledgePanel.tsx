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
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">Loaded Knowledge</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {knowledgeSources.map((source) => (
          <Card key={source.title} className="p-5 card-hover">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-accent p-2.5">
                  <source.icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{source.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{source.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {source.items.map((item) => (
                  <Badge key={item} variant="secondary" className="text-[10px] font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
