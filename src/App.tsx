import React, { useState, useEffect } from 'react';
import { Transaction, SavingsGoal, TransactionType } from './types';
import { loadTransactions, saveTransactions, loadGoals, saveGoals, clearAllData } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { IncomeManager } from './components/IncomeManager';
import { ExpenseManager } from './components/ExpenseManager';
import { SavingsGoals } from './components/SavingsGoals';
import { TransactionHistory } from './components/TransactionHistory';
import { MonthlyReports } from './components/MonthlyReports';
import { ThreeDVault } from './components/ThreeDVault';
import { TransactionModal } from './components/TransactionModal';
import { GoalModal } from './components/GoalModal';
import { BackupModal } from './components/BackupModal';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  useEffect(() => {
    // Completely clear all old stored transactions and goals so user starts with a 100% clean slate
    clearAllData();
    setTransactions([]);
    setGoals([]);
  }, []);

  const handleSaveTransaction = (transaction: Transaction) => {
    setTransactions((prev) => {
      const exists = prev.some((t) => t.id === transaction.id);
      const updated = exists
        ? prev.map((t) => (t.id === transaction.id ? transaction : t))
        : [transaction, ...prev];
      saveTransactions(updated);
      return updated;
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        saveTransactions(updated);
        return updated;
      });
    }
  };

  const handleSaveGoal = (goal: SavingsGoal) => {
    setGoals((prev) => {
      const exists = prev.some((g) => g.id === goal.id);
      const updated = exists
        ? prev.map((g) => (g.id === goal.id ? goal : g))
        : [...prev, goal];
      saveGoals(updated);
      return updated;
    });
  };

  const handleUpdateGoalSaved = (goalId: string, newSavedAmount: number) => {
    setGoals((prev) => {
      const updated = prev.map((g) => (g.id === goalId ? { ...g, savedAmount: newSavedAmount } : g));
      saveGoals(updated);
      return updated;
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      setGoals((prev) => {
        const updated = prev.filter((g) => g.id !== goalId);
        saveGoals(updated);
        return updated;
      });
    }
  };

  const handleImportData = (newTransactions: Transaction[], newGoals: SavingsGoal[]) => {
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  const handleClearAll = () => {
    clearAllData();
    setTransactions([]);
    setGoals([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTransactionModal={(type = 'expense') => {
          setTransactionModalType(type);
          setEditingTransaction(null);
          setIsTransactionModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      <main className="pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            goals={goals}
            setActiveTab={setActiveTab}
            onOpenTransactionModal={(type = 'expense') => {
              setTransactionModalType(type);
              setEditingTransaction(null);
              setIsTransactionModalOpen(true);
            }}
            onOpenGoalModal={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
          />
        )}

        {activeTab === 'income' && (
          <IncomeManager
            transactions={transactions}
            onOpenTransactionModal={(type = 'income', tx = undefined) => {
              setTransactionModalType('income');
              setEditingTransaction(tx || null);
              setIsTransactionModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseManager
            transactions={transactions}
            onOpenTransactionModal={(type = 'expense', tx = undefined) => {
              setTransactionModalType('expense');
              setEditingTransaction(tx || null);
              setIsTransactionModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'goals' && (
          <SavingsGoals
            goals={goals}
            onOpenGoalModal={(goal = undefined) => {
              setEditingGoal(goal || null);
              setIsGoalModalOpen(true);
            }}
            onUpdateGoalSaved={handleUpdateGoalSaved}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistory
            transactions={transactions}
            onOpenTransactionModal={(type = 'expense', tx = undefined) => {
              setTransactionModalType(type);
              setEditingTransaction(tx || null);
              setIsTransactionModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
          />
        )}

        {activeTab === 'reports' && (
          <MonthlyReports transactions={transactions} />
        )}

        {activeTab === 'vault' && (
          <ThreeDVault goals={goals} />
        )}
      </main>

      {/* Modals */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        initialType={transactionModalType}
        editingTransaction={editingTransaction}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onImportData={handleImportData}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
