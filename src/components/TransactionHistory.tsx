import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { ArrowDownRight, ArrowUpRight, Search, Filter, Pencil, Trash2, Download, Upload } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onOpenTransactionModal: (type?: 'income' | 'expense', transaction?: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenBackupModal: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onOpenTransactionModal,
  onDeleteTransaction,
  onOpenBackupModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      (t.sourceOrPayee && t.sourceOrPayee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Transaction History</h1>
          <p className="text-sm text-slate-500 mt-1">Complete searchable ledger of all your income and expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBackupModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export / Import JSON
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search description, payee, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-colors ${
                  typeFilter === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Categories</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="business">Business</option>
            <option value="gifts">Gifts</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="education">Education</option>
            <option value="bills">Bills</option>
            <option value="subscriptions">Subscriptions</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Ledger Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm">No transactions found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((t) => (
                <div key={t.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.type === 'income' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {t.sourceOrPayee || (t.type === 'income' ? 'Income' : 'Expense')}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className={`capitalize font-medium px-2 py-0.5 rounded-md ${
                          t.type === 'income' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {t.category}
                        </span>
                        <span>·</span>
                        <span>{formatDate(t.date)}</span>
                        {t.paymentMethod && (
                          <>
                            <span>·</span>
                            <span>{t.paymentMethod}</span>
                          </>
                        )}
                        {t.notes && (
                          <>
                            <span>·</span>
                            <span className="italic truncate max-w-[200px]">{t.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-base font-bold font-mono tabular-nums ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {t.type === 'income' ? '+' : '−'}{formatINR(t.amount)}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">{t.type}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenTransactionModal(t.type, t)}
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
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
