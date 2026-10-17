import { Transaction, SavingsGoal, FinancialSummary, MonthlySummary } from '../types';

export function calculateFinancialSummary(
  transactions: Transaction[],
  goals: SavingsGoal[]
): FinancialSummary {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += Number(t.amount) || 0;
    } else if (t.type === 'expense') {
      totalExpenses += Number(t.amount) || 0;
    }
  }

  const availableBalance = totalIncome - totalExpenses;

  let totalGoalSavings = 0;
  for (const g of goals) {
    totalGoalSavings += Number(g.savedAmount) || 0;
  }

  const netChange = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    availableBalance,
    totalGoalSavings,
    netChange,
  };
}

export function getMonthlySummaries(transactions: Transaction[]): MonthlySummary[] {
  const map: Record<string, { income: number; expenses: number; breakdown: Record<string, number> }> = {};

  for (const t of transactions) {
    if (!t.date) continue;
    const yearMonth = t.date.substring(0, 7); // "YYYY-MM"
    if (!map[yearMonth]) {
      map[yearMonth] = { income: 0, expenses: 0, breakdown: {} };
    }

    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      map[yearMonth].income += amt;
    } else {
      map[yearMonth].expenses += amt;
      map[yearMonth].breakdown[t.category] = (map[yearMonth].breakdown[t.category] || 0) + amt;
    }
  }

  const months = Object.keys(map).sort().reverse(); // newest first

  return months.map((ym) => {
    const data = map[ym];
    return {
      month: ym,
      monthName: formatMonthYearName(ym),
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
      categoryBreakdown: data.breakdown,
    };
  });
}

function formatMonthYearName(ym: string): string {
  try {
    const [year, month] = ym.split('-').map(Number);
    if (!year || !month) return ym;
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  } catch {
    return ym;
  }
}

export function calculateGoalProgress(saved: number, target: number): number {
  if (!target || target <= 0) return 0;
  const pct = (saved / target) * 100;
  return Math.min(Math.round(pct * 10) / 10, 100);
}
