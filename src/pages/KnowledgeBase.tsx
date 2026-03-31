import { useState } from "react";
import { Plus, Trash2, FileText, Upload, Pencil, ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
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

  // Upload form state
  const [uploadBrand, setUploadBrand] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadFileType, setUploadFileType] = useState<FileType | "">("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

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
    if (!uploadBrand || !uploadCategory || !uploadFileType || !uploadFileName) return;
    const newDoc = addDocument({
      fileName: uploadFileName,
      fileType: uploadFileType as FileType,
      brand: uploadBrand,
      category: uploadCategory,
      uploadedBy: "Current User",
      uploadedDate: new Date().toISOString().split("T")[0],
      fileUrl: "#",
    });
    setDocs(getDocuments());
    setUploadBrand("");
    setUploadCategory("");
    setUploadFileType("");
    setUploadFileName("");
    setDialogOpen(false);
    toast({ title: "Document uploaded", description: uploadFileName + " has been added to the knowledge base." });
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
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
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
                <label className="text-sm font-medium text-foreground">File</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUploadFileName(file.name);
                    }}
                  />
                </div>
                {uploadFileName && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <FileText className="h-3 w-3" /> {uploadFileName}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleUpload}
                  disabled={!uploadBrand || !uploadCategory || !uploadFileType || !uploadFileName}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand</label>
            <Select value={filterBrand} onValueChange={(v) => { setFilterBrand(v); setFilterCategory("all"); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
            <Select value={filterCategory} onValueChange={setFilterCategory} disabled={filterBrand === "all"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filterCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">File Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {fileTypes.map((ft) => <SelectItem key={ft} value={ft}>{fileTypeLabels[ft]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    {doc.fileName}
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
    </div>
  );
}
