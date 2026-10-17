import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatINR, formatMonthYear } from '../utils/formatters';
import { getMonthlySummaries } from '../utils/calculations';
import { BarChart3, ArrowDownRight, ArrowUpRight, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlyReportsProps {
  transactions: Transaction[];
}

export const MonthlyReports: React.FC<MonthlyReportsProps> = ({ transactions }) => {
  const summaries = getMonthlySummaries(transactions);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (summaries.length === 0) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Monthly Financial Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Analyze your monthly income, expenses, and category breakdowns.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-16 text-center text-slate-400">
          <BarChart3 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-base font-semibold text-slate-700">No monthly financial records available</p>
          <p className="text-xs text-slate-500 mt-1">Add transactions with dates to generate monthly analytical reports.</p>
        </div>
      </div>
    );
  }

  const currentSummary = summaries[selectedIndex] || summaries[0];
  const previousSummary = summaries[selectedIndex + 1]; // because sorted desc

  // Calculate percentage change if previous month exists
  let incomeDiffPercent = 0;
  let expenseDiffPercent = 0;
  if (previousSummary) {
    if (previousSummary.income > 0) {
      incomeDiffPercent = Math.round(((currentSummary.income - previousSummary.income) / previousSummary.income) * 100);
    }
    if (previousSummary.expenses > 0) {
      expenseDiffPercent = Math.round(((currentSummary.expenses - previousSummary.expenses) / previousSummary.expenses) * 100);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Monthly Financial Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Detailed income, expense breakdown, and net performance.</p>
        </div>

        {/* Month Selector Carousel */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setSelectedIndex((prev) => Math.min(summaries.length - 1, prev + 1))}
            disabled={selectedIndex >= summaries.length - 1}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 min-w-[150px] justify-center">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{currentSummary.monthName}</span>
          </div>
          <button
            onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
            disabled={selectedIndex <= 0}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* KPI Cards for Selected Month */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Monthly Income */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Income</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono tabular-nums">
              {formatINR(currentSummary.income)}
            </div>
            {previousSummary && (
              <p className="text-xs text-slate-500 mt-1">
                <span className={`font-semibold ${incomeDiffPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {incomeDiffPercent >= 0 ? `+${incomeDiffPercent}%` : `${incomeDiffPercent}%`}
                </span>{' '}
                vs previous month
              </p>
            )}
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-rose-600 font-mono tabular-nums">
              {formatINR(currentSummary.expenses)}
            </div>
            {previousSummary && (
              <p className="text-xs text-slate-500 mt-1">
                <span className={`font-semibold ${expenseDiffPercent <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {expenseDiffPercent >= 0 ? `+${expenseDiffPercent}%` : `${expenseDiffPercent}%`}
                </span>{' '}
                vs previous month
              </p>
            )}
          </div>
        </div>

        {/* Net Balance Change */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Monthly Savings</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
              currentSummary.net >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {formatINR(currentSummary.net)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentSummary.net >= 0 ? 'Positive cash flow' : 'Deficit this month'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Expense Breakdown by Category</h2>
          <p className="text-xs text-slate-500">Distribution of spending for {currentSummary.monthName}</p>
        </div>

        {Object.keys(currentSummary.categoryBreakdown).length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">No expenses recorded for this month.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(currentSummary.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const percentage = currentSummary.expenses > 0 ? Math.round((amount / currentSummary.expenses) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-semibold text-slate-800">{cat}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-500 text-xs">{percentage}%</span>
                        <span className="font-bold text-slate-900">{formatINR(amount)}</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
