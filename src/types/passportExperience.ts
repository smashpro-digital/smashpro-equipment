export interface EquipmentVideo {
  equipmentId: string;
  videoId: string;
  format?: "short" | "video"; // Existing YouTube record format; default is full-length.
  title: string;
  description: string;
  category: string;
  lifecycleStage: string;
  publishedAt: string;
  verifiedAt: string;
  featured?: boolean;
  visibility: "public" | "private";
}

export interface CapabilityStory {
  title: string;
  classification: "Purchased configuration" | "Supplier-stated capability" | "Field-validated capability";
  description: string;
}

export interface CommissioningCheck {
  id: string;
  title: string;
  status: "pending" | "verified";
  evidence: { title: string; href: string; kind: "photo" | "video" | "record" }[];
}

export interface InquiryStory {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  instructions: string;
  href: string;
  action: string;
  readiness?: "inquiry-only" | "released";
}
