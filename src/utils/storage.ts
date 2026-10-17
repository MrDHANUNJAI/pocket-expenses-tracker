import { Transaction, SavingsGoal } from '../types';

const TRANSACTIONS_KEY = 'pocket_app_transactions_v1';
const GOALS_KEY = 'pocket_app_goals_v1';

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load transactions from localStorage', err);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to localStorage', err);
  }
}

export function loadGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load goals from localStorage', err);
    return [];
  }
}

export function saveGoals(goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save goals to localStorage', err);
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(TRANSACTIONS_KEY);
    localStorage.removeItem(GOALS_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage data', err);
  }
}

export function exportDataAsJSON(): void {
  const transactions = loadTransactions();
  const goals = loadGoals();
  const exportObject = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    transactions,
    goals,
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `pocket_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function validateAndImportJSON(jsonString: string): { success: boolean; message: string; data?: { transactions: Transaction[]; goals: SavingsGoal[] } } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Invalid JSON file structure.' };
    }

    const transactions = parsed.transactions;
    const goals = parsed.goals;

    if (!Array.isArray(transactions) || !Array.isArray(goals)) {
      return { success: false, message: 'Import file missing transactions or savings goals arrays.' };
    }

    // Basic structure validation for transactions
    for (const t of transactions) {
      if (!t.id || !t.type || typeof t.amount !== 'number' || !t.date) {
        return { success: false, message: 'Invalid transaction record found in backup.' };
      }
    }

    // Basic structure validation for goals
    for (const g of goals) {
      if (!g.id || !g.name || typeof g.targetAmount !== 'number' || typeof g.savedAmount !== 'number') {
        return { success: false, message: 'Invalid savings goal record found in backup.' };
      }
    }

    return {
      success: true,
      message: `Successfully validated backup containing ${transactions.length} transactions and ${goals.length} goals.`,
      data: { transactions, goals },
    };
  } catch (err) {
    return { success: false, message: 'Could not parse JSON string. Please upload a valid backup file.' };
  }
}
