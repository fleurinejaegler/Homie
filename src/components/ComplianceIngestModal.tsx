import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  FileCheck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { PreventiveInspection } from '../types';

interface ComplianceIngestModalProps {
  onTaskExtracted: (task: PreventiveInspection) => void;
  onClose: () => void;
}

export const ComplianceIngestModal: React.FC<ComplianceIngestModalProps> = ({
  onTaskExtracted,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [customManualTitle, setCustomManualTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedResult, setExtractedResult] = useState<PreventiveInspection | null>(null);
  const [processingStage, setProcessingStage] = useState('');

  // Sample institutional compliance PDF presets
  const sampleManuals = [
    {
      title: 'Greystar ASME A17.1 Traction Elevator & Hoistway Safety Protocol (2026)',
      size: '2.4 MB PDF',
      sampleSnippet: 'Requires semi-annual governor calibration, brake lining micrometer analysis, and car door interlock voltage testing by QEI certified technician.',
    },
    {
      title: 'NFPA 25 Inspection, Testing, and Maintenance of Water-Based Fire Protection',
      size: '4.1 MB PDF',
      sampleSnippet: 'Mandates quarterly main drain flow test, semi-annual vane-type waterflow switch testing, and annual dry-pipe valve trip test.',
    },
    {
      title: 'ASHRAE 188 Legionellosis Risk Management & Cooling Tower Biocide Logs',
      size: '1.8 MB PDF',
      sampleSnippet: 'Monthly chemical dip slide analysis, bi-monthly drift eliminator inspection, and quarterly total dissolved solids sensor recalibration.',
    },
  ];

  const handleSelectSample = (sample: typeof sampleManuals[0]) => {
    setSelectedFile(sample.title);
    setCustomManualTitle(sample.title);
  };

  const handleRunExtraction = async () => {
    if (!selectedFile && !customManualTitle.trim()) {
      return;
    }

    setIsProcessing(true);
    setExtractedResult(null);
    setProcessingStage('Gemini 3.8 Flash parsing document AST, regulatory code references & frequency tables...');

    try {
      const titleToUse = customManualTitle.trim() || selectedFile || 'Greystar Life Safety Standard';
      
      const res = await fetch('/api/compliance/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manualTitle: titleToUse,
          manualText: 'Extracted regulatory compliance specifications for enterprise multifamily residential asset preservation.',
        }),
      });

      const data = await res.json();

      const newTask: PreventiveInspection = {
        id: `PREV-${Math.floor(105 + Math.random() * 800)}`,
        title: data.title || titleToUse,
        cycle: data.cycle || 'Semi-annual Mandatory',
        dueInDays: data.dueInDays || 18,
        dueDate: data.dueDate || 'Oct 15, 2026',
        frequency: data.frequency || 'Semi-Annual',
        assetTag: data.assetTag || 'AST-COMPL-09',
        location: data.location || 'Building Mechanical Core & Riser Shafts',
        complianceStandard: data.complianceStandard || 'Institutional Regulatory Safety Standard',
        requiredTradeCert: data.requiredTradeCert || 'Certified Systems Inspector',
        status: data.status || 'Action Required',
        lastInspectionDate: data.lastInspectionDate || 'Apr 12, 2026',
        technicianAssigned: data.technicianAssigned || 'Carrier Commercial Safety Division',
        actionProtocol: data.actionProtocol || 'Execute rigorous multi-point mechanical inspection with certified digital sign-off.',
      };

      setExtractedResult(newTask);
    } catch (err) {
      console.error('Failed to extract compliance manual:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSchedule = () => {
    if (extractedResult) {
      onTaskExtracted(extractedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[hsl(51.4_15.6%_78%)] bg-[hsl(50_20.7%_88.6%)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0000EE]" />
            <h2 className="font-serif-editorial text-2xl text-neutral-900 font-normal">
              Ingest Compliance Manual (PDF)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black transition-colors rounded-xs"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            Homie Autonomous Compliance extracts mandatory inspection intervals, state trade licensure requirements, and statutory OSHA/NFPA regulations directly from enterprise manuals.
          </p>

          {/* Preset selector or file upload */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-neutral-700">
              Select Institutional Compliance Document
            </div>

            <div className="space-y-2">
              {sampleManuals.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3.5 border rounded-md cursor-pointer transition-all ${
                    selectedFile === sample.title
                      ? 'bg-blue-50/70 border-[#0000EE]'
                      : 'bg-[hsl(50_20.7%_88.6%)] border-[hsl(51.4_15.6%_78%)] hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {sample.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-neutral-500 bg-[hsl(46.2_33.3%_92.4%)] px-1.5 py-0.5 border border-[hsl(51.4_15.6%_78%)] rounded-xs">
                      {sample.size}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-600 line-clamp-1">
                    {sample.sampleSnippet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Or Custom Name */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold tracking-wider text-neutral-700">
              Or Enter Custom Manual Name
            </label>
            <input
              type="text"
              value={customManualTitle}
              onChange={(e) => {
                setCustomManualTitle(e.target.value);
                setSelectedFile(null);
              }}
              placeholder="e.g. California Title 24 Energy Efficiency & Chiller Protocol 2026"
              className="w-full p-2.5 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-md text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Extraction Processing State */}
          {isProcessing && (
            <div className="p-4 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-md space-y-2">
              <div className="flex items-center gap-2 text-[#0000EE]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold">{processingStage}</span>
              </div>
              <div className="w-full bg-[hsl(46.2_33.3%_92.4%)] h-1 rounded-full overflow-hidden">
                <div className="bg-[#0000EE] h-full w-3/4 animate-pulse" />
              </div>
            </div>
          )}

          {/* Extracted Preview Result */}
          {extractedResult && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-900">
                    Compliance Schedule Successfully Extracted
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 rounded-xs border border-emerald-300">
                  {extractedResult.cycle}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  {extractedResult.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-700">
                  <strong>Standard:</strong> {extractedResult.complianceStandard} • <strong>Target Due:</strong> {extractedResult.dueDate} (in {extractedResult.dueInDays} days)
                </p>
                <p className="mt-1 text-xs text-neutral-700">
                  <strong>Required Licensure:</strong> {extractedResult.requiredTradeCert}
                </p>
                <p className="mt-2 text-xs text-neutral-800 bg-white/70 p-2.5 rounded-xs border border-emerald-200">
                  <strong>Protocol:</strong> {extractedResult.actionProtocol}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[hsl(51.4_15.6%_78%)] bg-[hsl(50_20.7%_88.6%)] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-black"
          >
            Cancel
          </button>

          {!extractedResult ? (
            <button
              type="button"
              onClick={handleRunExtraction}
              disabled={isProcessing || (!selectedFile && !customManualTitle.trim())}
              className="px-4 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-[#0000EE] hover:bg-blue-700 disabled:opacity-50 rounded-md border border-blue-900 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze & Extract Mandates</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddSchedule}
              className="px-4 py-2.5 text-xs uppercase font-bold tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-md border border-emerald-900 transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Add to Active Compliance Schedule</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ComplianceIngestModal;
