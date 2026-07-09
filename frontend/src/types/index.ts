export interface Project {
  id: string;
  companyName: string;
  projectName?: string;
  companySize?: string;
  industry?: string;
  contactName: string;
  contactEmail?: string;
  contactChannel: string;
  status: string; // 'LEAD', 'QUOTATION', 'NEGOTIATION', 'WON', 'LOST'
  firstContactDate: string;
  lastContactDate: string;
  nextMeetingDate?: string;
  quotedPrice?: number;
  counterOfferPrice?: number;
  finalPrice?: number;
  generatedRevenue: number;
  projectedRevenue: number;
  operationalCosts: number;
  
  projectType?: 'SAAS' | 'ONE_TIME';
  recurringRevenue?: number;
  recurringFrequency?: 'MONTHLY' | 'ANNUAL';
  isSetupFeeFirstHalfPaid?: boolean;
  isSetupFeeSecondHalfPaid?: boolean;

  projectNotes?: string;
  billingYear?: number;
  completionYear?: number;
  
  isLegacy?: boolean;
  developerCosts?: number;
}

export type CreateProjectDto = Omit<Project, 'id'>;

export interface ConstantExpense {
  id: number;
  concept: string;
  amount: number;
  frequency: string;
  expectedEvents?: number;
  type?: 'INCOME' | 'EXPENSE';
}

export type CreateConstantExpenseDto = Omit<ConstantExpense, 'id'>;

export interface MonthlyExpenseRecord {
  id: number;
  month: number;
  year: number;
  concept: string;
  originalAmount: number;
  actualAmount: number;
  isModified: boolean;
  modificationNote?: string;
}

export interface LmaasLead {
  id: string;
  companyName: string;
  projectName?: string;
  contactName: string;
  emails: string[];
  status: string; // 'STEP_0' to 'STEP_8'
  createdAt: string;
  updatedAt: string;
}

export interface LmaasSubscription {
  id: string;
  leadId: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  monthlyFee: number;
  annualizedValue: number;
  generatedRevenue: number;
  operatingCosts: number;
}

export interface LmaasLeadWithSubscription {
  lead: LmaasLead;
  subscription: LmaasSubscription;
}

export interface LmaasTicket {
  id: string;
  subscriptionId: string;
  title: string;
  status: 'BACKLOG' | 'DEVELOPMENT' | 'QA' | 'COOLDOWN' | 'DELIVERED';
  estimatedHours: number;
  createdAt: string;
  deliveredAt: string | null;
}

export interface UpdateExpenseRecordDto {
  actualAmount: number;
  modificationNote: string;
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle: string;
  hourlyRate: number;
  availableHoursPerMonth: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectAssignment {
  id: string;
  developerId: string;
  legacyProjectId?: string;
  lmaasLeadId?: string;
  assignmentType: string;
  assignedMonth: number;
  assignedYear: number;
  allocatedHours: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectAssignmentWithDetails {
  assignment: ProjectAssignment;
  projectName: string;
  projectType: 'LEGACY' | 'LMAAS';
}

export interface DeveloperWithFinancials {
  developer: Developer;
  month: number;
  year: number;
  usedHours: number;
  remuneration: number;
  assignments: ProjectAssignmentWithDetails[];
}

export interface CreateDeveloperDto {
  name: string;
  email: string;
  role: string;
  jobTitle: string;
  hourlyRate: number;
  availableHoursPerMonth: number;
}

export interface CreateProjectAssignmentDto {
  developerId: string;
  legacyProjectId?: string;
  lmaasLeadId?: string;
  assignmentType: string;
  assignedMonth: number;
  assignedYear: number;
  allocatedHours: number;
}
