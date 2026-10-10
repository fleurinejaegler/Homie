import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { WorkOrderTicket, TicketStatus } from '../types';

interface TicketDetailModalProps {
  ticket: WorkOrderTicket;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus, assignedEntity?: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onUpdateStatus,
}) => {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-[hsl(50_20.7%_88.6%)] text-neutral-700 border-[hsl(51.4_15.6%_78%)]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[hsl(51.4_15.6%_78%)] bg-[hsl(50_20.7%_88.6%)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-neutral-500">{ticket.id}</span>
            <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-xs border ${getUrgencyBadge(ticket.diagnostic.urgency)}`}>
              {ticket.diagnostic.urgency}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold text-neutral-800 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-xs">
              {ticket.diagnostic.required_trade}
            </span>
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
          
          {/* Title & Location */}
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-neutral-500">
              {ticket.unit} • Reported {ticket.reportedAt} by {ticket.tenantName}
            </div>
            <h2 className="font-serif-editorial text-3xl text-neutral-950 font-normal mt-1 leading-tight">
              {ticket.diagnostic.issue_title}
            </h2>
          </div>

          {/* Media & Telemetry preview if present */}
          {ticket.mediaUrl && (
            <div className="p-4 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-md space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>Tenant Attached Media Telemetry ({ticket.mediaType?.toUpperCase()})</span>
                <span className="text-[11px] text-neutral-500">Multimodal ingestion verified</span>
              </div>
              <div className="relative rounded-xs overflow-hidden border border-[hsl(51.4_15.6%_78%)] max-h-72 flex items-center justify-center bg-black/80">
                {ticket.mediaType === 'video' ? (
                  <video
                    src={ticket.mediaUrl}
                    controls
                    playsInline
                    className="w-full max-h-72 object-contain"
                  />
                ) : (
                  <img
                    src={ticket.mediaUrl}
                    alt="Incident inspection evidence"
                    className="w-full h-full object-contain max-h-72"
                  />
                )}
              </div>
            </div>
          )}

          {/* Tenant Voice description */}
          <div className="p-4 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-md space-y-1.5">
            <div className="text-xs uppercase font-bold tracking-wider text-neutral-600">
              Resident Verbatim Report
            </div>
            <p className="text-sm text-neutral-900 font-medium leading-relaxed italic">
              "{ticket.description}"
            </p>
          </div>

          {/* AI Technician Diagnostic Summary */}
          <div className="p-4 bg-[hsl(46.2_33.3%_92.4%)] border-l-4 border-l-[#0000EE] border border-[hsl(51.4_15.6%_78%)] rounded-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase font-bold tracking-wider text-[#0000EE] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.8 Flash Diagnostic Blueprint
              </div>
              <span className="text-[11px] font-mono text-neutral-500">Autonomous Reasoning</span>
            </div>
            <p className="text-sm text-neutral-900 leading-relaxed font-medium">
              {ticket.diagnostic.technician_summary}
            </p>
          </div>

          {/* Safety Callout */}
          {ticket.diagnostic.safety_warning && (
            <div className="p-4 bg-red-50/90 border border-red-300 rounded-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-red-900">
                  Critical Safety & Liability Warning
                </h4>
                <p className="mt-1 text-xs text-red-800 leading-relaxed font-medium">
                  {ticket.diagnostic.safety_warning}
                </p>
              </div>
            </div>
          )}

          {/* Parts & Equipment Required */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-700">
              Identified Parts, Tools & Hardware Needed
            </h3>
            <div className="flex flex-wrap gap-2">
              {ticket.diagnostic.identified_parts.map((part, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-md text-xs font-medium text-neutral-800 flex items-center gap-1.5"
                >
                  <Wrench className="w-3 h-3 text-neutral-500" />
                  <span>{part}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry / Audit Log */}
          {ticket.telemetryLog && ticket.telemetryLog.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-700">
                Autonomous Telemetry Log
              </h3>
              <div className="p-3 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-md space-y-1.5 font-mono text-[11px] text-neutral-700">
                {ticket.telemetryLog.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-neutral-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions for Property Manager */}
        <div className="p-4 sm:p-6 border-t border-[hsl(51.4_15.6%_78%)] bg-[hsl(50_20.7%_88.6%)] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-600">
            Current Status: <strong className="text-neutral-900">{ticket.status}</strong>
            {ticket.assignedEntity && (
              <span className="block text-[11px] text-neutral-500">
                Assignee: {ticket.assignedEntity} {ticket.dispatchETA ? `(ETA: ${ticket.dispatchETA})` : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {ticket.status !== 'Resolved via DIY' && ticket.status !== 'Completed' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(ticket.id, 'Assigned In-House', 'Carlos Gomez (In-House Senior Tech)');
                    onClose();
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-neutral-200 border border-[hsl(51.4_15.6%_78%)] rounded-md transition-colors"
                >
                  Assign In-House Tech
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(ticket.id, 'Dispatched Vendor', `Bay Area Mechanical Emergency (${ticket.diagnostic.required_trade})`);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0000EE] hover:bg-blue-700 border border-blue-900 rounded-md transition-colors"
                >
                  Dispatch Vendor
                </button>
              </>
            )}

            {(ticket.status === 'Dispatched Vendor' || ticket.status === 'Assigned In-House') && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(ticket.id, 'Completed');
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-md transition-colors"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketDetailModal;
