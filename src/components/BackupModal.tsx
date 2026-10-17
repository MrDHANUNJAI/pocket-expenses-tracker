import React, { useState } from 'react';
import { Transaction, SavingsGoal } from '../types';
import { exportDataAsJSON, validateAndImportJSON, clearAllData } from '../utils/storage';
import { X, Download, Upload, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportData: (transactions: Transaction[], goals: SavingsGoal[]) => void;
  onClearAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onImportData,
  onClearAll,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pendingData, setPendingData] = useState<{ transactions: Transaction[]; goals: SavingsGoal[] } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = validateAndImportJSON(content);
        if (result.success && result.data) {
          setSuccessMsg(result.message);
          setErrorMsg('');
          setPendingData(result.data);
        } else {
          setErrorMsg(result.message);
          setSuccessMsg('');
          setPendingData(null);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (pendingData) {
      if (window.confirm('Are you sure you want to replace current financial records with imported data?')) {
        onImportData(pendingData.transactions, pendingData.goals);
        onClose();
      }
    }
  };

  const handleClearAllRecords = () => {
    if (window.confirm('Are you sure you want to delete ALL records and start fresh? This action cannot be undone.')) {
      clearAllData();
      onClearAll();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Data Backup & Reset</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Export Backup</h3>
            <p className="text-xs text-slate-500">
              Download your complete financial ledger and savings goals as a secure JSON backup file.
            </p>
            <button
              onClick={exportDataAsJSON}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Download JSON Backup
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Import Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Restore / Import Backup</h3>
            <p className="text-xs text-slate-500">
              Upload a previously exported Pocket JSON backup file to restore your records.
            </p>

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-600 font-medium">Click to upload JSON backup</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Validates records before import</p>
                </div>
                <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
                <button
                  onClick={handleConfirmImport}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Confirm & Replace Records
                </button>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Reset / Clear All Records Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-rose-600">Start Fresh</h3>
            <p className="text-xs text-slate-500">
              Permanently delete all existing transactions and savings goals so you can start fresh from scratch.
            </p>
            <button
              onClick={handleClearAllRecords}
              className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors border border-rose-200"
            >
              <Trash2 className="w-4 h-4" /> Clear All Records & Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
