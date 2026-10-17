import React from 'react';
import { Transaction, SavingsGoal } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { calculateFinancialSummary, calculateGoalProgress } from '../utils/calculations';
import { ArrowDownRight, ArrowUpRight, Wallet, Target, Plus, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  goals: SavingsGoal[];
  setActiveTab: (tab: string) => void;
  onOpenTransactionModal: (type?: 'income' | 'expense') => void;
  onOpenGoalModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  goals,
  setActiveTab,
  onOpenTransactionModal,
  onOpenGoalModal,
}) => {
  const summary = calculateFinancialSummary(transactions, goals);
  const recentTransactions = [...transactions].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Financial Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Here is your personal finance overview and recent activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenTransactionModal('income')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            Add Income
          </button>
          <button
            onClick={() => onOpenTransactionModal('expense')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatINR(summary.availableBalance)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Total Income − Total Expenses</span>
            </p>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Income</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 font-mono tabular-nums">
              {formatINR(summary.totalIncome)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {transactions.filter(t => t.type === 'income').length} recorded sources
            </p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 font-mono tabular-nums">
              {formatINR(summary.totalExpenses)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {transactions.filter(t => t.type === 'expense').length} recorded expenses
            </p>
          </div>
        </div>

        {/* Savings Allocated */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Goal Savings</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600 font-mono tabular-nums">
              {formatINR(summary.totalGoalSavings)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Allocated across {goals.length} active goals
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Recent Transactions & Savings Goals Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              <p className="text-xs text-slate-500">Latest earnings and expenditures</p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No transactions recorded yet.</p>
              <button
                onClick={() => onOpenTransactionModal('expense')}
                className="mt-3 text-xs font-medium text-emerald-600 hover:underline"
              >
                Add your first transaction
              </button>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.type === 'income' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {t.sourceOrPayee || (t.type === 'income' ? 'Income' : 'Expense')}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="capitalize">{t.category}</span>
                        <span>·</span>
                        <span>{formatDate(t.date)}</span>
                        {t.paymentMethod && (
                          <>
                            <span>·</span>
                            <span>{t.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold font-mono tabular-nums ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {t.type === 'income' ? '+' : '−'}{formatINR(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Savings Goals Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Savings Goals</h2>
              <p className="text-xs text-slate-500">Target purchase progress</p>
            </div>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Manage <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No savings goals created.</p>
              <button
                onClick={onOpenGoalModal}
                className="mt-3 text-xs font-medium text-indigo-600 hover:underline"
              >
                Create a goal
              </button>
            </div>
          ) : (
            <div className="space-y-5 flex-1">
              {goals.slice(0, 3).map((goal) => {
                const progress = calculateGoalProgress(goal.savedAmount, goal.targetAmount);
                const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900 truncate max-w-[160px]">{goal.name}</span>
                      <span className="text-xs font-mono font-bold text-indigo-600">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>Saved: {formatINR(goal.savedAmount)}</span>
                      <span>Left: {formatINR(remaining)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('vault')}
              className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore 3D Savings Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
