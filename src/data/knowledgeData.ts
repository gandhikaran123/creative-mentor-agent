export type FileType = "product-label" | "email-copy" | "social-media-ad" | "amazon-dsp-ad" | "social-post" | "amazon-pdp";

export type Category = "Compliance Rules" | "Brand Guidelines" | "Product Knowledge";

export interface KnowledgeDocument {
  id: string;
  fileName: string;
  fileType: FileType;
  brand: string;
  category: Category;
  uploadedBy: string;
  uploadedDate: string;
  fileUrl: string;
}

export const brands = ["Acme Corp", "Nova Labs", "Orbit Media", "Peak Digital"];

export const typeMap: Record<string, FileType[]> = {
  "Acme Corp": ["product-label", "email-copy", "social-media-ad"],
  "Nova Labs": ["amazon-dsp-ad", "social-post", "product-label"],
  "Orbit Media": ["email-copy", "amazon-pdp", "social-media-ad"],
  "Peak Digital": ["social-post", "amazon-dsp-ad", "product-label"],
};

export const fileTypeLabels: Record<FileType, string> = {
  "product-label": "Product Label",
  "email-copy": "Email Copy",
  "social-media-ad": "Social Media Ad",
  "amazon-dsp-ad": "Amazon DSP Ad",
  "social-post": "Social Post",
  "amazon-pdp": "Amazon PDP",
};

export const fileTypes: FileType[] = ["product-label", "email-copy", "social-media-ad", "amazon-dsp-ad", "social-post", "amazon-pdp"];

export const categories: Category[] = ["Compliance Rules", "Brand Guidelines", "Product Knowledge"];

const initialDocuments: KnowledgeDocument[] = [
  // Acme Corp – Product Label
  { id: "1", fileName: "FTC_Endorsement_Policy.pdf", fileType: "product-label", brand: "Acme Corp", category: "Compliance Rules", uploadedBy: "Sarah Chen", uploadedDate: "2026-02-10", fileUrl: "#" },
  { id: "2", fileName: "GDPR_Social_Disclaimer.pdf", fileType: "product-label", brand: "Acme Corp", category: "Compliance Rules", uploadedBy: "Sarah Chen", uploadedDate: "2026-02-12", fileUrl: "#" },
  { id: "3", fileName: "Acme_Brand_Book_v3.pdf", fileType: "product-label", brand: "Acme Corp", category: "Brand Guidelines", uploadedBy: "Mark Rivera", uploadedDate: "2026-01-20", fileUrl: "#" },
  { id: "4", fileName: "Acme_Tone_of_Voice.docx", fileType: "product-label", brand: "Acme Corp", category: "Brand Guidelines", uploadedBy: "Mark Rivera", uploadedDate: "2026-01-22", fileUrl: "#" },
  { id: "5", fileName: "Acme_Product_Claims_Q1.xlsx", fileType: "product-label", brand: "Acme Corp", category: "Product Knowledge", uploadedBy: "Lisa Park", uploadedDate: "2026-03-01", fileUrl: "#" },
  // Acme Corp – Email Copy
  { id: "6", fileName: "Display_Ad_Compliance.pdf", fileType: "email-copy", brand: "Acme Corp", category: "Compliance Rules", uploadedBy: "Sarah Chen", uploadedDate: "2026-02-15", fileUrl: "#" },
  { id: "7", fileName: "Acme_Banner_Guidelines.pdf", fileType: "email-copy", brand: "Acme Corp", category: "Brand Guidelines", uploadedBy: "Mark Rivera", uploadedDate: "2026-01-25", fileUrl: "#" },
  { id: "8", fileName: "Banner_Pricing_Rules.pdf", fileType: "email-copy", brand: "Acme Corp", category: "Product Knowledge", uploadedBy: "Lisa Park", uploadedDate: "2026-03-05", fileUrl: "#" },
  // Nova Labs – Amazon DSP Ad
  { id: "9", fileName: "Nova_WCAG_Checklist.pdf", fileType: "amazon-dsp-ad", brand: "Nova Labs", category: "Compliance Rules", uploadedBy: "James Wu", uploadedDate: "2026-02-20", fileUrl: "#" },
  { id: "10", fileName: "Nova_Visual_Identity.pdf", fileType: "amazon-dsp-ad", brand: "Nova Labs", category: "Brand Guidelines", uploadedBy: "Emily Tran", uploadedDate: "2026-01-18", fileUrl: "#" },
  { id: "11", fileName: "Nova_Hero_Copy_Rules.docx", fileType: "amazon-dsp-ad", brand: "Nova Labs", category: "Product Knowledge", uploadedBy: "Emily Tran", uploadedDate: "2026-02-28", fileUrl: "#" },
  // Nova Labs – Social Post
  { id: "12", fileName: "Product_Photo_Standards.pdf", fileType: "social-post", brand: "Nova Labs", category: "Compliance Rules", uploadedBy: "James Wu", uploadedDate: "2026-03-10", fileUrl: "#" },
  { id: "13", fileName: "Nova_Photography_Guide.pdf", fileType: "social-post", brand: "Nova Labs", category: "Brand Guidelines", uploadedBy: "Emily Tran", uploadedDate: "2026-01-30", fileUrl: "#" },
  { id: "14", fileName: "Nova_Product_Specs.xlsx", fileType: "social-post", brand: "Nova Labs", category: "Product Knowledge", uploadedBy: "James Wu", uploadedDate: "2026-03-12", fileUrl: "#" },
  // Orbit Media – Email Copy
  { id: "15", fileName: "CAN_SPAM_Compliance.pdf", fileType: "email-copy", brand: "Orbit Media", category: "Compliance Rules", uploadedBy: "David Kim", uploadedDate: "2026-02-08", fileUrl: "#" },
  { id: "16", fileName: "Orbit_Email_Brand_Kit.pdf", fileType: "email-copy", brand: "Orbit Media", category: "Brand Guidelines", uploadedBy: "Anna Lee", uploadedDate: "2026-01-15", fileUrl: "#" },
  { id: "17", fileName: "Orbit_Promo_Restrictions.pdf", fileType: "email-copy", brand: "Orbit Media", category: "Product Knowledge", uploadedBy: "Anna Lee", uploadedDate: "2026-03-02", fileUrl: "#" },
  // Peak Digital – Social Post
  { id: "18", fileName: "Peak_FTC_Guidelines.pdf", fileType: "social-post", brand: "Peak Digital", category: "Compliance Rules", uploadedBy: "Tom Harris", uploadedDate: "2026-02-25", fileUrl: "#" },
  { id: "19", fileName: "Peak_Brand_Standards.pdf", fileType: "social-post", brand: "Peak Digital", category: "Brand Guidelines", uploadedBy: "Rachel Ng", uploadedDate: "2026-01-28", fileUrl: "#" },
  { id: "20", fileName: "Peak_Approved_Claims.docx", fileType: "social-post", brand: "Peak Digital", category: "Product Knowledge", uploadedBy: "Rachel Ng", uploadedDate: "2026-03-08", fileUrl: "#" },
];

let documents = [...initialDocuments];

export function getDocuments(): KnowledgeDocument[] {
  return [...documents];
}

export function getDocumentsForBrandType(brand: string, fileType: string): KnowledgeDocument[] {
  return documents.filter((d) => d.brand === brand && d.fileType === fileType);
}

export function addDocument(doc: Omit<KnowledgeDocument, "id">): KnowledgeDocument {
  const newDoc = { ...doc, id: String(Date.now()) };
  documents = [...documents, newDoc];
  return newDoc;
}

export function deleteDocument(id: string): void {
  documents = documents.filter((d) => d.id !== id);
}

export function updateDocument(id: string, updates: Partial<Pick<KnowledgeDocument, "fileType" | "brand" | "category">>): void {
  documents = documents.map((d) => (d.id === id ? { ...d, ...updates } : d));
}
