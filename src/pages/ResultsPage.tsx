import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReviewState {
  frontImage: { name: string; url: string };
  backImage: { name: string; url: string };
  brand: string;
  category: string;
}

interface AnalysisSection {
  title: string;
  items: string[];
}

interface AnalysisResult {
  summary: string;
  sections: AnalysisSection[];
  suggestions: string[];
}

const dummyAnalysis: AnalysisResult = {
  summary:
    "This creative meets most brand standards but has several compliance risks that should be addressed before approval. The front label is visually strong and on-brand, but the back label contains claims that may not align with current regulatory guidelines. Overall, the creative is close to approval-ready with minor revisions.",
  sections: [
    {
      title: "Compliance Check",
      items: [
        "⚠️ Missing FDA disclaimer — Required disclaimer text was not found on the back label. All product creatives must include the standard FDA disclosure per regulatory policy.",
        "⚠️ Potential unverified health claim — The phrase 'clinically proven to improve energy' on the front label has not been pre-approved by the legal team. This language must be substantiated or revised.",
        "✅ Ingredient list is present and formatted correctly per compliance template v2.4.",
        "✅ Net weight and manufacturer information are displayed in the required font size.",
      ],
    },
    {
      title: "Brand Guidelines Check",
      items: [
        "⚠️ Inconsistent typography usage — The subheading on the front label uses 'Helvetica Neue Light' instead of the approved 'Inter 500'. All text elements must adhere to the brand typography scale.",
        "✅ Primary brand color (#6C3CE1) is used correctly for headline text and accents.",
        "✅ Logo placement and clear-space requirements are met on both front and back labels.",
        "✅ Photography style is consistent with the approved mood board for Q1 2026.",
      ],
    },
    {
      title: "Product Knowledge Check",
      items: [
        "⚠️ Ingredient benefit misalignment — The claim 'rich in antioxidants' is attributed to Ingredient X, but approved product documentation only supports this claim for Ingredient Y. Please update the attribution.",
        "✅ Product name and SKU match the approved product database entry.",
        "✅ Flavor descriptor 'Natural Berry Blend' is consistent with the approved naming convention.",
        "✅ Nutritional panel values match the certified lab report (Report #NTR-2026-0412).",
      ],
    },
  ],
  suggestions: [
    "Add the standard FDA disclaimer to the bottom of the back label using the approved legal copy block (Template: FDA-DISC-v3).",
    "Replace 'clinically proven to improve energy' with the pre-approved alternative: 'formulated to support natural energy levels†' and include the corresponding footnote.",
    "Update the front label subheading font from 'Helvetica Neue Light' to 'Inter 500' per Brand Guidelines v3.2 §5.3.",
    "Correct the antioxidant claim attribution from Ingredient X to Ingredient Y, or submit a new claim substantiation request to the regulatory team.",
    "Consider adding a QR code linking to the full product information page, as recommended in the Digital Label Initiative guidelines.",
  ],
};

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const state = location.state as ReviewState | null;

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
      return;
    }
    const timer = setTimeout(() => {
      setAnalysis(dummyAnalysis);
      setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, [state, navigate]);

  if (!state) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Running analysis…</p>
        <p className="text-xs text-muted-foreground/60">
          Checking compliance, brand guidelines, and product knowledge
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Review Results</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {state.brand} · {state.category}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/")}>
          <ArrowLeft className="h-3.5 w-3.5" />
          New Review
        </Button>
      </div>

      <Separator />

      {/* Section 1: Images */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Creative Assets</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Front</span>
            <Card className="overflow-hidden">
              <img
                src={state.frontImage.url}
                alt="Front creative"
                className="w-full h-56 object-contain bg-muted/30"
              />
              <div className="p-3 border-t">
                <p className="text-xs text-muted-foreground truncate">{state.frontImage.name}</p>
              </div>
            </Card>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Back</span>
            <Card className="overflow-hidden">
              <img
                src={state.backImage.url}
                alt="Back creative"
                className="w-full h-56 object-contain bg-muted/30"
              />
              <div className="p-3 border-t">
                <p className="text-xs text-muted-foreground truncate">{state.backImage.name}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 2: Analysis Output */}
      {analysis && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-foreground">Creative Review Output</h2>

          <Card className="p-0 overflow-hidden">
            <ScrollArea className="max-h-[600px]">
              <div className="p-6 space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Summary
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
                </div>

                <Separator />

                {/* Analysis Sections */}
                {analysis.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-sm text-foreground/90 leading-relaxed pl-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <Separator />

                {/* Suggestions */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Suggestions
                  </h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-foreground/90 leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
}
