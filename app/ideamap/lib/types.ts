export type Lang = "fr" | "ar" | "en";

export type Role = "holder" | "coordinator" | "admin";

export type StepId =
  | "info"
  | "idea"
  | "dialogue"
  | "profile"
  | "plan"
  | "budget"
  | "logo"
  | "compliance"
  | "documents"
  | "export";

export type Gender = "male" | "female" | "other";
export type EducationLevel = "college" | "bac" | "bac2" | "bac3" | "bac5" | "doctorat";
export type OccupationStatus = "student" | "jobseeker" | "employed" | "selfemployed";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageGroup: string;
  gender: Gender | "";
  educationLevel: EducationLevel | "";
  occupationStatus: OccupationStatus | "";
  region: string;
  prefecture?: string;
  photoDataUrl?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ProjectProfile {
  projectName: string;
  sector: string;
  legalStructure: string;
  location: string;
  beneficiaries: number;
  activities: string[];
  strengths: string[];
  estimatedBudget: number;
  pillar: string;
}

export interface BusinessPlan {
  executiveSummary: string;
  problemStatement: string;
  solution: string;
  marketAnalysis: string;
  businessModel: string;
  socialImpact: string;
  operationalPlan: string;
  indh_alignment: string;
  risks: string[];
  projections: { year1: number; year2: number; year3: number };
}

export interface BudgetItem {
  category: string;
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Budget {
  items: BudgetItem[];
  indhContribution: number;
  beneficiaryContribution: number;
}

export interface JuryScore {
  impact: number;
  viability: number;
  relevance: number;
  management: number;
  sustainability: number;
  innovation: number;
}

export interface ComplianceReport {
  eligible: boolean;
  score: number;
  pillar: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  juryScore: JuryScore;
}

export type DocumentsState = Record<string, boolean>;

export interface DocumentUpload {
  fileName: string;
  fileType: string;
  dataUrl: string;
  uploadedAt: string;
}

export type UploadsState = Record<string, DocumentUpload>;

export const LOGO_ICONS = ["leaf", "wheat", "fish", "thread", "hammer", "house", "book", "chip", "hand", "sun"] as const;
export type LogoIcon = (typeof LOGO_ICONS)[number];

export interface LogoConcept {
  initials: string;
  primaryColor: string;
  secondaryColor: string;
  icon: LogoIcon;
  tagline: string;
}

export interface LogoState {
  source: "uploaded" | "generated";
  imageDataUrl?: string;
  concept?: LogoConcept;
}

export interface HolderState {
  cin: string;
  name: string;
  createdAt: string;
  step: StepId;
  idea: string;
  msgs: ChatMessage[];
  qN: number;
  proj: ProjectProfile | null;
  plan: BusinessPlan | null;
  budget: Budget | null;
  comp: ComplianceReport | null;
  docs: DocumentsState;
  uploads: UploadsState;
  logo: LogoState | null;
  info: PersonalInfo;
  coordinatorCode?: string;
}
