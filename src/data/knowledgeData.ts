export type FileType = "compliance" | "brand" | "product";

export interface KnowledgeDocument {
  id: string;
  fileName: string;
  fileType: FileType;
  brand: string;
  category: string;
  uploadedBy: string;
  uploadedDate: string;
  fileUrl: string;
}

export const brands = ["Acme Corp", "Nova Labs", "Orbit Media", "Peak Digital"];

export const categoryMap: Record<string, string[]> = {
  "Acme Corp": ["Social Media Ad", "Display Banner", "Email Header"],
  "Nova Labs": ["Landing Page Hero", "Product Photo", "Social Media Ad"],
  "Orbit Media": ["Display Banner", "Email Header", "Landing Page Hero"],
  "Peak Digital": ["Product Photo", "Social Media Ad", "Display Banner"],
};

export const fileTypeLabels: Record<FileType, string> = {
  compliance: "Compliance Rules",
  brand: "Brand Guidelines",
  product: "Product Knowledge",
};

export const fileTypes: FileType[] = ["compliance", "brand", "product"];

const initialDocuments: KnowledgeDocument[] = [
  // Acme Corp – Social Media Ad
  { id: "1", fileName: "FTC_Endorsement_Policy.pdf", fileType: "compliance", brand: "Acme Corp", category: "Social Media Ad", uploadedBy: "Sarah Chen", uploadedDate: "2026-02-10", fileUrl: "#" },
  { id: "2", fileName: "GDPR_Social_Disclaimer.pdf", fileType: "compliance", brand: "Acme Corp", category: "Social Media Ad", uploadedBy: "Sarah Chen", uploadedDate: "2026-02-12", fileUrl: "#" },
  { id: "3", fileName: "Acme_Brand_Book_v3.pdf", fileType: "brand", brand: "Acme Corp", category: "Social Media Ad", uploadedBy: "Mark Rivera", uploadedDate: "2026-01-20", fileUrl: "#" },
  { id: "4", fileName: "Acme_Tone_of_Voice.docx", fileType: "brand", brand: "Acme Corp", category: "Social Media Ad", uploadedBy: "Mark Rivera", uploadedDate: "2026-01-22", fileUrl: "#" },
  { id: "5", fileName: "Acme_Product_Claims_Q1.xlsx", fileType: "product", brand: "Acme Corp", category: "Social Media Ad", uploadedBy: "Lisa Park", uploadedDate: "2026-03-01", fileUrl: "#" },
  // Acme Corp – Display Banner
  { id: "6", fileName: "Display_Ad_Compliance.pdf", fileType: "compliance", brand: "Acme Corp", category: "Display Banner", uploadedBy: "Sarah Chen", uploadedDate: "2026-02-15", fileUrl: "#" },
  { id: "7", fileName: "Acme_Banner_Guidelines.pdf", fileType: "brand", brand: "Acme Corp", category: "Display Banner", uploadedBy: "Mark Rivera", uploadedDate: "2026-01-25", fileUrl: "#" },
  { id: "8", fileName: "Banner_Pricing_Rules.pdf", fileType: "product", brand: "Acme Corp", category: "Display Banner", uploadedBy: "Lisa Park", uploadedDate: "2026-03-05", fileUrl: "#" },
  // Nova Labs – Landing Page Hero
  { id: "9", fileName: "Nova_WCAG_Checklist.pdf", fileType: "compliance", brand: "Nova Labs", category: "Landing Page Hero", uploadedBy: "James Wu", uploadedDate: "2026-02-20", fileUrl: "#" },
  { id: "10", fileName: "Nova_Visual_Identity.pdf", fileType: "brand", brand: "Nova Labs", category: "Landing Page Hero", uploadedBy: "Emily Tran", uploadedDate: "2026-01-18", fileUrl: "#" },
  { id: "11", fileName: "Nova_Hero_Copy_Rules.docx", fileType: "product", brand: "Nova Labs", category: "Landing Page Hero", uploadedBy: "Emily Tran", uploadedDate: "2026-02-28", fileUrl: "#" },
  // Nova Labs – Product Photo
  { id: "12", fileName: "Product_Photo_Standards.pdf", fileType: "compliance", brand: "Nova Labs", category: "Product Photo", uploadedBy: "James Wu", uploadedDate: "2026-03-10", fileUrl: "#" },
  { id: "13", fileName: "Nova_Photography_Guide.pdf", fileType: "brand", brand: "Nova Labs", category: "Product Photo", uploadedBy: "Emily Tran", uploadedDate: "2026-01-30", fileUrl: "#" },
  { id: "14", fileName: "Nova_Product_Specs.xlsx", fileType: "product", brand: "Nova Labs", category: "Product Photo", uploadedBy: "James Wu", uploadedDate: "2026-03-12", fileUrl: "#" },
  // Orbit Media – Email Header
  { id: "15", fileName: "CAN_SPAM_Compliance.pdf", fileType: "compliance", brand: "Orbit Media", category: "Email Header", uploadedBy: "David Kim", uploadedDate: "2026-02-08", fileUrl: "#" },
  { id: "16", fileName: "Orbit_Email_Brand_Kit.pdf", fileType: "brand", brand: "Orbit Media", category: "Email Header", uploadedBy: "Anna Lee", uploadedDate: "2026-01-15", fileUrl: "#" },
  { id: "17", fileName: "Orbit_Promo_Restrictions.pdf", fileType: "product", brand: "Orbit Media", category: "Email Header", uploadedBy: "Anna Lee", uploadedDate: "2026-03-02", fileUrl: "#" },
  // Peak Digital – Social Media Ad
  { id: "18", fileName: "Peak_FTC_Guidelines.pdf", fileType: "compliance", brand: "Peak Digital", category: "Social Media Ad", uploadedBy: "Tom Harris", uploadedDate: "2026-02-25", fileUrl: "#" },
  { id: "19", fileName: "Peak_Brand_Standards.pdf", fileType: "brand", brand: "Peak Digital", category: "Social Media Ad", uploadedBy: "Rachel Ng", uploadedDate: "2026-01-28", fileUrl: "#" },
  { id: "20", fileName: "Peak_Approved_Claims.docx", fileType: "product", brand: "Peak Digital", category: "Social Media Ad", uploadedBy: "Rachel Ng", uploadedDate: "2026-03-08", fileUrl: "#" },
];

let documents = [...initialDocuments];

export function getDocuments(): KnowledgeDocument[] {
  return [...documents];
}

export function getDocumentsForBrandCategory(brand: string, category: string): KnowledgeDocument[] {
  return documents.filter((d) => d.brand === brand && d.category === category);
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
