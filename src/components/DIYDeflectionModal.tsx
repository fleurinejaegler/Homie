import React, { useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, DollarSign, X, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import { TriageDiagnostic } from '../types';

interface DIYDeflectionModalProps {
  diagnostic: TriageDiagnostic;
  onResolvedDIY: () => void;
  onDispatchAnyway: () => void;
  onClose: () => void;
}

export const DIYDeflectionModal: React.FC<DIYDeflectionModalProps> = ({
  diagnostic,
  onResolvedDIY,
  onDispatchAnyway,
  onClose,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allCompleted =
    diagnostic.diy_instructions.length > 0 &&
    completedSteps.length === diagnostic.diy_instructions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(51.4_15.6%_78%)] bg-[hsl(50_20.7%_88.6%)]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Wrench className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs uppercase font-semibold tracking-wider text-emerald-900">
              Autonomous Self-Resolution Intercept
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black transition-colors rounded-xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header & Subhead in Editorial Serif */}
          <div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl text-neutral-950 font-normal leading-tight">
              Instant Resolution Available
            </h2>
            <p className="mt-2 text-sm text-neutral-700 leading-relaxed font-medium">
              Estimated repair savings: <strong className="text-emerald-700 font-semibold">$150</strong>. 
              You can resolve this right now without waiting for a technician.
            </p>
          </div>

          {/* Diagnostic Context Pill */}
          <div className="p-3 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-neutral-500 font-medium">Identified Issue:</span>{' '}
              <span className="font-semibold text-neutral-900">{diagnostic.issue_title}</span>
            </div>
            {diagnostic.identified_parts.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-neutral-500 font-medium">Tools/Parts:</span>
                {diagnostic.identified_parts.map((part, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-xs font-mono text-[11px] text-neutral-800"
                  >
                    {part}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Step-by-step checklist formatted with circular step numbers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-800">
                Resolution Steps (Self-Guided)
              </h3>
              <span className="text-xs text-neutral-500 font-medium">
                {completedSteps.length} of {diagnostic.diy_instructions.length} steps checked
              </span>
            </div>

            <div className="space-y-2.5">
              {diagnostic.diy_instructions.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3.5 p-3.5 border transition-all cursor-pointer rounded-md ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-[hsl(50_20.7%_88.6%)] border-[hsl(51.4_15.6%_78%)] hover:border-neutral-400'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-[hsl(51.4_15.6%_78%)] text-neutral-800'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <p className={`text-sm leading-relaxed ${isDone ? 'line-through text-neutral-600' : 'text-neutral-900 font-medium'}`}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Callout Box with warning icon */}
          <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-md flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-amber-900">
                Safety Protocol Callout
              </h4>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed font-medium">
                {diagnostic.safety_warning ||
                  'Always ensure the primary electrical power or water valve is disengaged before attempting any mechanical adjustment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[hsl(51.4_15.6%_78%)] bg-[hsl(50_20.7%_88.6%)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDispatchAnyway}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-neutral-800 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-neutral-200 border border-[hsl(51.4_15.6%_78%)] rounded-md transition-colors"
          >
            Still Needs Technician — Dispatch Work Order
          </button>

          <button
            type="button"
            onClick={onResolvedDIY}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white rounded-md transition-all flex items-center justify-center gap-2 ${
              allCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                : 'bg-[#0000EE] hover:bg-blue-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>This Fixed My Issue — Close Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DIYDeflectionModal;
