import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { ArrowUpRight, Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';

interface ExpenseManagerProps {
  transactions: Transaction[];
  onOpenTransactionModal: (type?: 'income' | 'expense', transaction?: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  transactions,
  onOpenTransactionModal,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const expenses = transactions.filter((t) => t.type === 'expense');

  const filteredExpenses = expenses.filter((t) => {
    const matchesSearch =
      (t.sourceOrPayee && t.sourceOrPayee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpense = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Expense Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track food, transport, shopping, education, bills, and subscriptions.</p>
        </div>
        <button
          onClick={() => onOpenTransactionModal('expense')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Cumulative Expenses</span>
          <div className="text-3xl font-bold text-rose-600 font-mono tabular-nums mt-1">
            {formatINR(totalExpense)}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <ArrowUpRight className="w-6 h-6" />
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search payee or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          {['all', 'food', 'transport', 'shopping', 'education', 'bills', 'subscriptions', 'entertainment', 'other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expense Records List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm">No expenses found matching your filters.</p>
            <button
              onClick={() => onOpenTransactionModal('expense')}
              className="mt-3 text-xs font-medium text-emerald-600 hover:underline"
            >
              Add a new expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <div key={expense.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {expense.sourceOrPayee || 'Expense Payee'}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="capitalize font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          {expense.category}
                        </span>
                        <span>·</span>
                        <span>{formatDate(expense.date)}</span>
                        {expense.paymentMethod && (
                          <>
                            <span>·</span>
                            <span>{expense.paymentMethod}</span>
                          </>
                        )}
                        {expense.notes && (
                          <>
                            <span>·</span>
                            <span className="italic truncate max-w-[200px]">{expense.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                        −{formatINR(expense.amount)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenTransactionModal('expense', expense)}
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(expense.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
