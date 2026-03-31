import { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Trash2, FileText, Upload, Pencil, ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight, Calendar, User, Tag, FolderOpen, ExternalLink, UploadCloud, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  brands,
  categoryMap,
  fileTypes,
  fileTypeLabels,
  getDocuments,
  addDocument,
  deleteDocument,
  updateDocument,
  type FileType,
  type KnowledgeDocument,
} from "@/data/knowledgeData";

const fileTypeBadgeClass: Record<FileType, string> = {
  compliance: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  brand: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  product: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

export default function KnowledgeBase() {
  const { toast } = useToast();
  const [docs, setDocs] = useState<KnowledgeDocument[]>(getDocuments());
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDocument | null>(null);

  // Upload form state
  const [uploadBrand, setUploadBrand] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadFileType, setUploadFileType] = useState<FileType | "">("");
  const [uploadFileNames, setUploadFileNames] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Drag-and-drop state
  const [isDraggingPage, setIsDraggingPage] = useState(false);
  const [isDraggingZone, setIsDraggingZone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const acceptedExtensions = [".pdf", ".doc", ".docx", ".xlsx", ".xls"];
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const isAcceptedFile = (file: File) =>
    acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

  const handleFileDrop = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles: string[] = [];
    const invalidType: string[] = [];
    const oversized: string[] = [];
    Array.from(files).forEach((file) => {
      if (!isAcceptedFile(file)) { invalidType.push(file.name); return; }
      if (file.size > MAX_FILE_SIZE) { oversized.push(file.name); return; }
      validFiles.push(file.name);
    });
    if (oversized.length > 0) {
      toast({ title: "Files too large", description: `${oversized.length} file(s) exceed the 20 MB limit: ${oversized.join(", ")}`, variant: "destructive" });
    }
    if (invalidType.length > 0) {
      toast({ title: "Unsupported files", description: `${invalidType.length} file(s) had unsupported types (PDF, DOC, DOCX, XLS, XLSX only).`, variant: "destructive" });
    }
    if (validFiles.length > 0) {
      setUploadFileNames((prev) => [...prev, ...validFiles]);
      if (!dialogOpen) setDialogOpen(true);
    }
  }, [dialogOpen, toast]);

  // Page-level drag handlers
  const handlePageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes("Files")) setIsDraggingPage(true);
  };
  const handlePageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDraggingPage(false);
  };
  const handlePageDragOver = (e: React.DragEvent) => e.preventDefault();
  const handlePageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDraggingPage(false);
    setIsDraggingZone(false);
    handleFileDrop(e.dataTransfer.files);
  };

  // Edit form state
  const [editDoc, setEditDoc] = useState<KnowledgeDocument | null>(null);
  const [editBrand, setEditBrand] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFileType, setEditFileType] = useState<FileType | "">("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground/50" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 ml-1 text-primary" />
      : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
  };

  const filteredDocs = docs.filter((d) => {
    if (filterBrand !== "all" && d.brand !== filterBrand) return false;
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (filterType !== "all" && d.fileType !== filterType) return false;
    if (searchQuery && !d.fileName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String(a[sortField as keyof KnowledgeDocument] ?? "");
    const bVal = String(b[sortField as keyof KnowledgeDocument] ?? "");
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Pagination
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sortedDocs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedDocs = sortedDocs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const filterCategories = filterBrand !== "all" ? categoryMap[filterBrand] || [] : [];

  const handleUpload = () => {
    if (!uploadBrand || !uploadCategory || !uploadFileType || uploadFileNames.length === 0) return;
    uploadFileNames.forEach((fileName) => {
      addDocument({
        fileName,
        fileType: uploadFileType as FileType,
        brand: uploadBrand,
        category: uploadCategory,
        uploadedBy: "Current User",
        uploadedDate: new Date().toISOString().split("T")[0],
        fileUrl: "#",
      });
    });
    setDocs(getDocuments());
    const count = uploadFileNames.length;
    setUploadBrand("");
    setUploadCategory("");
    setUploadFileType("");
    setUploadFileNames([]);
    setDialogOpen(false);
    toast({ title: `${count} document${count !== 1 ? "s" : ""} uploaded`, description: `Added to the knowledge base.` });
  };

  const [deleteTarget, setDeleteTarget] = useState<KnowledgeDocument | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const fileName = deleteTarget.fileName;
    deleteDocument(deleteTarget.id);
    setDocs(getDocuments());
    setDeleteTarget(null);
    toast({ title: "Document deleted", description: fileName + " has been removed." });
  };

  const openEdit = (doc: KnowledgeDocument) => {
    setEditDoc(doc);
    setEditBrand(doc.brand);
    setEditCategory(doc.category);
    setEditFileType(doc.fileType);
    setEditDialogOpen(true);
  };

  const handleEdit = () => {
    if (!editDoc || !editBrand || !editCategory || !editFileType) return;
    updateDocument(editDoc.id, { brand: editBrand, category: editCategory, fileType: editFileType as FileType });
    setDocs(getDocuments());
    setEditDialogOpen(false);
    setEditDoc(null);
    toast({ title: "Document updated", description: editDoc.fileName + " has been updated." });
  };

  return (
    <div
      className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative"
      onDragEnter={handlePageDragEnter}
      onDragLeave={handlePageDragLeave}
      onDragOver={handlePageDragOver}
      onDrop={handlePageDrop}
    >
      {/* Full-page drag overlay */}
      {isDraggingPage && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="border-2 border-dashed border-primary rounded-2xl p-12 text-center">
            <UploadCloud className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">Drop file to upload</p>
            <p className="text-sm text-muted-foreground mt-1">PDF, DOC, DOCX, XLS, XLSX</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage compliance, brand, and product documents by brand and category.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Brand</label>
                <Select value={uploadBrand} onValueChange={(v) => { setUploadBrand(v); setUploadCategory(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select value={uploadCategory} onValueChange={setUploadCategory} disabled={!uploadBrand}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {(categoryMap[uploadBrand] || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">File Type</label>
                <Select value={uploadFileType} onValueChange={(v) => setUploadFileType(v as FileType)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((ft) => <SelectItem key={ft} value={ft}>{fileTypeLabels[ft]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Files {uploadFileNames.length > 0 && <span className="text-muted-foreground font-normal">({uploadFileNames.length})</span>}
                </label>
                {/* Drop zone - always visible */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                    isDraggingZone
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                  onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingZone(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingZone(false); }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingZone(false);
                    handleFileDrop(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-7 w-7 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-sm font-medium text-foreground">
                    Drag & drop files here, or <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, XLS, XLSX</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleFileDrop(e.target.files);
                    }}
                  />
                </div>
                {/* File list */}
                {uploadFileNames.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {uploadFileNames.map((name, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1.5">
                        <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-sm text-foreground truncate flex-1">{name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadFileNames((prev) => prev.filter((_, idx) => idx !== i));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleUpload}
                  disabled={!uploadBrand || !uploadCategory || !uploadFileType || uploadFileNames.length === 0}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload {uploadFileNames.length > 1 ? `${uploadFileNames.length} Files` : ""}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by file name…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand</label>
            <Select value={filterBrand} onValueChange={(v) => { setFilterBrand(v); setFilterCategory("all"); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
            <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(1); }} disabled={filterBrand === "all"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filterCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">File Type</label>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {fileTypes.map((ft) => <SelectItem key={ft} value={ft}>{fileTypeLabels[ft]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bulk actions & Table */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} of {sortedDocs.length} selected
          </span>
          {selectedIds.size < sortedDocs.length && (
            <Button
              variant="link"
              size="sm"
              className="text-primary px-0"
              onClick={() => setSelectedIds(new Set(sortedDocs.map((d) => d.id)))}
            >
              Select all {sortedDocs.length}
            </Button>
          )}
          <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setBulkDeleteOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
            Clear
          </Button>
        </div>
      )}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={paginatedDocs.length > 0 && paginatedDocs.every((d) => selectedIds.has(d.id))}
                  onCheckedChange={(checked) => {
                    const next = new Set(selectedIds);
                    paginatedDocs.forEach((d) => checked ? next.add(d.id) : next.delete(d.id));
                    setSelectedIds(next);
                  }}
                />
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("fileName")}>
                <span className="inline-flex items-center">File Name{sortIcon("fileName")}</span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("fileType")}>
                <span className="inline-flex items-center">Type{sortIcon("fileType")}</span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("brand")}>
                <span className="inline-flex items-center">Brand{sortIcon("brand")}</span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("category")}>
                <span className="inline-flex items-center">Category{sortIcon("category")}</span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("uploadedBy")}>
                <span className="inline-flex items-center">Uploaded By{sortIcon("uploadedBy")}</span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("uploadedDate")}>
                <span className="inline-flex items-center">Date{sortIcon("uploadedDate")}</span>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocs.map((doc) => (
                <TableRow key={doc.id} className={selectedIds.has(doc.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(doc.id)}
                      onCheckedChange={(checked) => {
                        const next = new Set(selectedIds);
                        checked ? next.add(doc.id) : next.delete(doc.id);
                        setSelectedIds(next);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="font-medium flex items-center gap-2 hover:text-primary transition-colors text-left"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="underline-offset-2 hover:underline">{doc.fileName}</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={fileTypeBadgeClass[doc.fileType]}>
                      {fileTypeLabels[doc.fileType]}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.brand}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.uploadedBy}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.uploadedDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(doc)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(doc)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{sortedDocs.length} document{sortedDocs.length !== 1 ? "s" : ""}</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          {editDoc && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">File</label>
                <p className="text-sm font-medium text-foreground">{editDoc.fileName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Brand</label>
                <Select value={editBrand} onValueChange={(v) => { setEditBrand(v); setEditCategory(""); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select value={editCategory} onValueChange={setEditCategory} disabled={!editBrand}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {(categoryMap[editBrand] || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">File Type</label>
                <Select value={editFileType} onValueChange={(v) => setEditFileType(v as FileType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((ft) => <SelectItem key={ft} value={ft}>{fileTypeLabels[ft]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleEdit} disabled={!editBrand || !editCategory || !editFileType}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget?.fileName}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Documents</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected document{selectedIds.size !== 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                const count = selectedIds.size;
                selectedIds.forEach((id) => deleteDocument(id));
                setDocs(getDocuments());
                setSelectedIds(new Set());
                setBulkDeleteOpen(false);
                toast({ title: "Documents deleted", description: `${count} document${count !== 1 ? "s" : ""} removed.` });
              }}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Document Preview Panel */}
      <Sheet open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Document Details
            </SheetTitle>
            <SheetDescription>Preview document metadata and properties.</SheetDescription>
          </SheetHeader>
          {previewDoc && (
            <div className="space-y-6 pt-2">
              {/* File name */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">File Name</p>
                <p className="text-sm font-semibold text-foreground break-all">{previewDoc.fileName}</p>
              </div>

              <Separator />

              {/* Details grid */}
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Type</p>
                    <Badge variant="secondary" className={fileTypeBadgeClass[previewDoc.fileType]}>
                      {fileTypeLabels[previewDoc.fileType]}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FolderOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Brand</p>
                    <p className="text-sm text-foreground">{previewDoc.brand}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FolderOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Category</p>
                    <p className="text-sm text-foreground">{previewDoc.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Uploaded By</p>
                    <p className="text-sm text-foreground">{previewDoc.uploadedBy}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Upload Date</p>
                    <p className="text-sm text-foreground">{previewDoc.uploadedDate}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    setPreviewDoc(null);
                    openEdit(previewDoc);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={() => {
                    setPreviewDoc(null);
                    setDeleteTarget(previewDoc);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
