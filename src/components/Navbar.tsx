import React from 'react';
import { Wallet, LayoutDashboard, ArrowDownRight, ArrowUpRight, Target, History, BarChart3, Box, Download, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTransactionModal: (type?: 'income' | 'expense') => void;
  onOpenBackupModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTransactionModal,
  onOpenBackupModal,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Pocket</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Personal Finance
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'income' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              Income
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'expenses' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'goals' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Target className="w-4 h-4 text-indigo-600" />
              Goals
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'history' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-amber-600" />
              History
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reports' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-sky-600" />
              Reports
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'vault' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Box className="w-4 h-4 text-purple-600" />
              3D Vault
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenBackupModal}
              title="Backup & Restore Data"
              className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenTransactionModal('expense')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar row */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'income' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" /> Income
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'expenses' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Expenses
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'goals' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Goals
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <History className="w-3.5 h-3.5" /> History
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Reports
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vault' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3D Vault
          </button>
        </div>
      </div>
    </header>
  );
};
