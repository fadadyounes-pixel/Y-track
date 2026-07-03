export type Lang = "fr" | "ar" | "en";

export type Role = "holder" | "coordinator" | "admin";

export type StepId =
  | "idea"
  | "dialogue"
  | "profile"
  | "plan"
  | "budget"
  | "compliance"
  | "documents"
  | "export";

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
  coordinatorCode?: string;
}
