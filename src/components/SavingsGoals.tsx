import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { calculateGoalProgress } from '../utils/calculations';
import { Target, Plus, Pencil, Trash2, CheckCircle2, Calendar, Sparkles } from 'lucide-react';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onOpenGoalModal: (goal?: SavingsGoal) => void;
  onUpdateGoalSaved: (goalId: string, newSavedAmount: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  onOpenGoalModal,
  onUpdateGoalSaved,
  onDeleteGoal,
}) => {
  const [depositingGoalId, setDepositingGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');

  const totalTarget = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
  const totalSaved = goals.reduce((sum, g) => sum + (Number(g.savedAmount) || 0), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleDepositSubmit = (goal: SavingsGoal, e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (!isNaN(val)) {
      const updated = Math.max(0, goal.savedAmount + val);
      onUpdateGoalSaved(goal.id, updated);
      setDepositingGoalId(null);
      setDepositAmount('');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Savings Goals</h1>
          <p className="text-sm text-slate-500 mt-1">Allocate your available funds toward purchasing items and reaching targets.</p>
        </div>
        <button
          onClick={() => onOpenGoalModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Goal
        </button>
      </div>

      {/* Note about goal allocations */}
      <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-900">
          <span className="font-semibold">Financial Note:</span> Savings goals are allocations of your existing available balance. Allocating funds toward a goal tracks your progress toward specific purchases without duplicating expense records.
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overall Savings Progress</span>
            <div className="text-3xl font-bold text-indigo-600 font-mono tabular-nums mt-1">
              {formatINR(totalSaved)} <span className="text-sm text-slate-400 font-normal">of {formatINR(totalTarget)}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Progress: {overallProgress}%</span>
            <span>Remaining: {formatINR(Math.max(0, totalTarget - totalSaved))}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal.savedAmount, goal.targetAmount);
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          const isCompleted = goal.savedAmount >= goal.targetAmount;

          return (
            <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {goal.category && (
                      <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-2">
                        {goal.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{goal.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenGoalModal(goal)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Goal"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{goal.description}</p>
                )}

                {goal.targetDate && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target Date: {formatDate(goal.targetDate)}</span>
                  </div>
                )}
              </div>

              {/* Progress section */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono font-bold text-indigo-600">{progress}%</span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reached
                    </span>
                  )}
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                  <span>Saved: {formatINR(goal.savedAmount)}</span>
                  <span>Target: {formatINR(goal.targetAmount)}</span>
                </div>
                <div className="text-xs text-slate-400 text-right font-mono">
                  Remaining: {formatINR(remaining)}
                </div>

                {/* Quick Add Funds / Deposit Modal Drawer */}
                {depositingGoalId === goal.id ? (
                  <form onSubmit={(e) => handleDepositSubmit(goal, e)} className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="Amount to add"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      autoFocus
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shrink-0"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositingGoalId(null)}
                      className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg shrink-0"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setDepositingGoalId(goal.id);
                        setDepositAmount('');
                      }}
                      className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Funds
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
