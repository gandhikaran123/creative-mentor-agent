import { useState, useCallback } from "react";
import { Upload, Play, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { KnowledgePanel } from "@/components/KnowledgePanel";
import { ReviewResults } from "@/components/ReviewResults";

const brands = ["Acme Corp", "Nova Labs", "Orbit Media", "Peak Digital"];
const categories = ["Social Media Ad", "Display Banner", "Email Header", "Landing Page Hero", "Product Photo"];

export default function Index() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setUploadedFile(file.name);
      setShowResults(false);
    }
  }, []);

  const handleFileSelect = () => {
    setUploadedFile("summer-campaign-hero.png");
    setShowResults(false);
  };

  const handleRunReview = () => {
    setIsReviewing(true);
    setTimeout(() => {
      setIsReviewing(false);
      setShowResults(true);
    }, 1500);
  };

  const canRunReview = uploadedFile && brand && category;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Creative Review</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Upload a creative asset and run an automated compliance and brand review.
        </p>
      </div>

      <Separator />

      {/* Upload */}
      <Card
        className="border-dashed border-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
          <div className="p-5 flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-accent flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{uploadedFile}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Image • Ready for review</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setUploadedFile(null);
                setShowResults(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            onClick={handleFileSelect}
            className="w-full p-10 flex flex-col items-center gap-4 text-center cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
          >
            <div className="rounded-full bg-accent p-4">
              <Upload className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Upload creative asset</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag & drop or click to browse • PNG, JPG, WebP
              </p>
            </div>
          </button>
        )}
      </Card>

      {/* Brand & Category */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Brand</label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Knowledge */}
      <KnowledgePanel />

      {/* Run Review */}
      <div className="flex justify-end">
        <Button
          onClick={handleRunReview}
          disabled={!canRunReview || isReviewing}
          className="gap-2 px-6"
        >
          <Play className="h-4 w-4" />
          {isReviewing ? "Reviewing…" : "Run Review"}
        </Button>
      </div>

      {/* Results */}
      {showResults && (
        <>
          <Separator />
          <ReviewResults />
        </>
      )}
    </div>
  );
}
