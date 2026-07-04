export interface Project {
  id: string;
  companyName: string;
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

export interface UpdateExpenseRecordDto {
  actualAmount: number;
  modificationNote: string;
}
