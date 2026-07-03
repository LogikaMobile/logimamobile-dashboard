import { Project, CreateProjectDto, ConstantExpense, CreateConstantExpenseDto, MonthlyExpenseRecord, UpdateExpenseRecordDto } from '../types';

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

export async function deleteConstantExpense(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete constant expense');
  }
}

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
