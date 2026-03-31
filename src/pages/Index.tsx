import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ImageIcon, X, FileText, Shield, BookOpen, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ReviewResults } from "@/components/ReviewResults";
import {
  brands,
  categoryMap,
  fileTypeLabels,
  fileTypes,
  getDocumentsForBrandCategory,
  type FileType,
  type KnowledgeDocument,
} from "@/data/knowledgeData";

const fileTypeIcons: Record<FileType, typeof Shield> = {
  compliance: Shield,
  brand: BookOpen,
  product: Package,
};

interface UploadedImage {
  name: string;
  url: string;
}

export default function Index() {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [frontImage, setFrontImage] = useState<UploadedImage | null>(null);
  const [backImage, setBackImage] = useState<UploadedImage | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const categories = brand ? categoryMap[brand] || [] : [];
  const knowledgeDocs = brand && category ? getDocumentsForBrandCategory(brand, category) : [];

  const groupedDocs = fileTypes.reduce<Record<FileType, KnowledgeDocument[]>>((acc, ft) => {
    acc[ft] = knowledgeDocs.filter((d) => d.fileType === ft);
    return acc;
  }, { compliance: [], brand: [], product: [] });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: (img: UploadedImage | null) => void) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setter({ name: file.name, url: URL.createObjectURL(file) });
      setShowResults(false);
    }
  };

  const handleRunReview = () => {
    setIsReviewing(true);
    setTimeout(() => {
      setIsReviewing(false);
      setShowResults(true);
    }, 1500);
  };

  const canRunReview = brand && category && frontImage && backImage;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Creative Review</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Select brand and category, upload front &amp; back images, then run an AI-powered compliance review.
        </p>
      </div>

      <Separator />

      {/* Brand & Category */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Brand</label>
          <Select value={brand} onValueChange={(v) => { setBrand(v); setCategory(""); setShowResults(false); }}>
            <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
            <SelectContent>
              {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <Select value={category} onValueChange={(v) => { setCategory(v); setShowResults(false); }} disabled={!brand}>
            <SelectTrigger><SelectValue placeholder={brand ? "Select category" : "Select brand first"} /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dynamic Knowledge Display */}
      {brand && category && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Loaded Knowledge</h3>
          {knowledgeDocs.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No documents uploaded for this brand &amp; category.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fileTypes.map((ft) => {
                const Icon = fileTypeIcons[ft];
                const docs = groupedDocs[ft];
                return (
                  <Card key={ft} className="p-5 card-hover">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="rounded-lg bg-accent p-2">
                        <Icon className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <h4 className="text-sm font-medium text-foreground">{fileTypeLabels[ft]}</h4>
                      <Badge variant="secondary" className="ml-auto text-[10px]">{docs.length}</Badge>
                    </div>
                    {docs.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No files</p>
                    ) : (
                      <ul className="space-y-2">
                        {docs.map((doc) => (
                          <li key={doc.id} className="flex items-start gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{doc.fileName}</p>
                              <p className="text-[10px] text-muted-foreground">{doc.uploadedBy} · {doc.uploadedDate}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Image Uploads */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Creative Assets</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Front Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Front Image <span className="text-destructive">*</span>
            </label>
            <input ref={frontRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => handleImageSelect(e, setFrontImage)} />
            {frontImage ? (
              <Card className="relative overflow-hidden">
                <img src={frontImage.url} alt="Front preview" className="w-full h-40 object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground truncate">{frontImage.name}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setFrontImage(null); setShowResults(false); }}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card
                className="border-dashed border-2 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => frontRef.current?.click()}
              >
                <div className="p-8 flex flex-col items-center gap-2 text-center">
                  <div className="rounded-full bg-accent p-3">
                    <ImageIcon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <p className="text-xs font-medium text-foreground">Upload Front Image</p>
                  <p className="text-[10px] text-muted-foreground">JPG or PNG only</p>
                </div>
              </Card>
            )}
          </div>

          {/* Back Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Back Image <span className="text-destructive">*</span>
            </label>
            <input ref={backRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => handleImageSelect(e, setBackImage)} />
            {backImage ? (
              <Card className="relative overflow-hidden">
                <img src={backImage.url} alt="Back preview" className="w-full h-40 object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground truncate">{backImage.name}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setBackImage(null); setShowResults(false); }}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card
                className="border-dashed border-2 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => backRef.current?.click()}
              >
                <div className="p-8 flex flex-col items-center gap-2 text-center">
                  <div className="rounded-full bg-accent p-3">
                    <ImageIcon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <p className="text-xs font-medium text-foreground">Upload Back Image</p>
                  <p className="text-[10px] text-muted-foreground">JPG or PNG only</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Run Review */}
      <div className="flex justify-end">
        <Button onClick={handleRunReview} disabled={!canRunReview || isReviewing} className="gap-2 px-6">
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
