import { 
  Project, CreateProjectDto, ConstantExpense, CreateConstantExpenseDto, 
  MonthlyExpenseRecord, UpdateExpenseRecordDto, DeveloperWithFinancials,
  CreateDeveloperDto, Developer, CreateProjectAssignmentDto
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086'; // Using backend exposed port

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  return res.json();
}

export async function createProject(data: CreateProjectDto): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to create project');
  }
  
  return res.json();
}

export async function fetchConstantExpenses(): Promise<ConstantExpense[]> {
  const res = await fetch(`${API_BASE_URL}/api/expenses`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch constant expenses');
  }
  return res.json();
}

export async function createConstantExpense(data: CreateConstantExpenseDto): Promise<ConstantExpense> {
  const res = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to create constant expense');
  }
  
  return res.json();
}

export const deleteConstantExpense = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/constant-expenses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error deleting expense');
};

export const fetchLmaasLeads = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/lmaas/leads`);
  if (!res.ok) throw new Error('Failed to fetch LMaaS leads');
  return res.json();
};

export const createLmaasLead = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/lmaas/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create LMaaS lead');
  return res.json();
};

export const updateLmaasLead = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/lmaas/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update LMaaS lead');
  return res.json();
};

export const updateLmaasSubscription = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/lmaas/subscriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update LMaaS subscription');
  return res.json();
};

export const fetchLmaasTickets = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/lmaas/tickets`);
  if (!res.ok) throw new Error('Failed to fetch LMaaS tickets');
  return res.json();
};

export const createLmaasTicket = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/lmaas/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create LMaaS ticket');
  return res.json();
};

export const updateLmaasTicket = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/lmaas/tickets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update LMaaS ticket');
  return res.json();
};

export async function getMonthlyReport(year: number, month: number): Promise<MonthlyExpenseRecord[]> {
  const response = await fetch(`${API_BASE_URL}/reports/monthly/${year}/${month}`);
  if (!response.ok) {
    throw new Error('Failed to fetch monthly report');
  }
  return response.json();
}

export async function updateExpenseRecord(id: number, data: UpdateExpenseRecordDto): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reports/monthly/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update expense record');
  }
}

export async function updateProject(id: string, data: Project): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to update project');
  }
  
  return res.json();
}

// Developer & Engineering HR endpoints
export async function fetchDevelopers(month: number, year: number): Promise<DeveloperWithFinancials[]> {
  const res = await fetch(`${API_BASE_URL}/developers?month=${month}&year=${year}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch developers');
  }
  return res.json();
}
export async function fetchDeveloper(id: string, month: number, year: number): Promise<DeveloperWithFinancials> {
  const res = await fetch(`${API_BASE_URL}/developers/${id}?month=${month}&year=${year}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch developer');
  }
  return res.json();
}
export async function createDeveloper(data: CreateDeveloperDto): Promise<Developer> {
  const res = await fetch(`${API_BASE_URL}/developers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create developer');
  return res.json();
}

export async function updateDeveloper(id: string, data: Developer): Promise<Developer> {
  const res = await fetch(`${API_BASE_URL}/developers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update developer');
  return res.json();
}

export async function createAssignment(data: CreateProjectAssignmentDto[]): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create assignment');
  }
}

export async function fetchProjectAssignments(projectId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/assignments/legacy_project/${projectId}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}

export async function deleteAssignment(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete assignment');
}
