export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 'salary' | 'freelance' | 'business' | 'gifts' | 'other';
export type ExpenseCategory = 'food' | 'transport' | 'shopping' | 'education' | 'bills' | 'subscriptions' | 'entertainment' | 'other';

export type Category = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  sourceOrPayee?: string; // source for income, payee/merchant for expense
  paymentMethod?: 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking' | 'Other';
  date: string; // ISO format YYYY-MM-DD
  notes?: string;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
  description?: string;
  category?: string;
  createdAt: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  totalGoalSavings: number;
  netChange: number;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  monthName: string; // e.g., "October 2026"
  income: number;
  expenses: number;
  net: number;
  categoryBreakdown: Record<string, number>;
}
