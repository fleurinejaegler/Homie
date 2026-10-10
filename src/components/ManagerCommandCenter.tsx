import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Wrench, 
  CheckCircle2, 
  TrendingUp, 
  Filter, 
  Search, 
  Plus, 
  FileText, 
  Clock, 
  DollarSign, 
  Eye, 
  UserCheck, 
  Truck, 
  ChevronRight,
  Sparkles,
  Calendar,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { WorkOrderTicket, PreventiveInspection, UrgencyLevel, TicketStatus } from '../types';
import TicketDetailModal from './TicketDetailModal';
import ComplianceIngestModal from './ComplianceIngestModal';

interface ManagerCommandCenterProps {
  tickets: WorkOrderTicket[];
  preventiveTasks: PreventiveInspection[];
  metrics: {
    activeWorkOrdersCount: number;
    noiSavedMTD: number;
    diyDeflectionsCount: number;
    preventiveComplianceScore: number;
    buildingName: string;
  };
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus, assignedEntity?: string) => void;
  onAddPreventiveTask: (task: PreventiveInspection) => void;
  onUpdatePreventiveStatus: (taskId: string, status: 'Compliant' | 'Action Required' | 'Scheduled') => void;
}

export const ManagerCommandCenter: React.FC<ManagerCommandCenterProps> = ({
  tickets,
  preventiveTasks,
  metrics,
  onUpdateTicketStatus,
  onAddPreventiveTask,
  onUpdatePreventiveStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'corrective' | 'preventive'>('corrective');
  const [filterUrgency, setFilterUrgency] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<WorkOrderTicket | null>(null);
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setActionToast({ message, type });
    setTimeout(() => {
      setActionToast(null);
    }, 3500);
  };

  // Compute live breakdown counts
  const emergencyCount = tickets.filter((t) => t.diagnostic.urgency === 'Emergency' && t.status !== 'Completed').length;
  const highCount = tickets.filter((t) => t.diagnostic.urgency === 'High' && t.status !== 'Completed').length;
  const routineCount = tickets.filter((t) => t.diagnostic.urgency === 'Routine' && t.status !== 'Completed').length;
  const resolvedDIYCount = tickets.filter((t) => t.isResolvedByDIY || t.status === 'Resolved via DIY').length;

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    // Filter urgency/status tab
    if (filterUrgency === 'Emergency' && ticket.diagnostic.urgency !== 'Emergency') return false;
    if (filterUrgency === 'High Priority' && ticket.diagnostic.urgency !== 'High') return false;
    if (filterUrgency === 'Routine' && ticket.diagnostic.urgency !== 'Routine') return false;
    if (filterUrgency === 'Resolved via DIY' && !ticket.isResolvedByDIY && ticket.status !== 'Resolved via DIY') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUnit = ticket.unit.toLowerCase().includes(q);
      const matchTitle = ticket.diagnostic.issue_title.toLowerCase().includes(q);
      const matchDesc = ticket.description.toLowerCase().includes(q);
      const matchTrade = ticket.diagnostic.required_trade.toLowerCase().includes(q);
      const matchTenant = ticket.tenantName.toLowerCase().includes(q);
      if (!matchUnit && !matchTitle && !matchDesc && !matchTrade && !matchTenant) return false;
    }
    return true;
  });

  const getUrgencyTagClass = (urgency: UrgencyLevel, isDIY?: boolean) => {
    if (isDIY) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
    switch (urgency) {
      case 'Emergency':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Routine':
      default:
        return 'bg-[hsl(50_20.7%_88.6%)] text-neutral-700 border-[hsl(51.4_15.6%_78%)]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Floating Action Confirmation Toast */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce sm:animate-none flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900 text-white text-xs font-semibold shadow-2xl border border-neutral-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionToast.message}</span>
        </div>
      )}
      
      {/* 1. Executive Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Metric 1: Active Work Orders */}
        <div className="p-5 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-600">
              Active Work Orders
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
              <Clock className="w-3 h-3" />
              Live Queue
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-serif-editorial text-4xl sm:text-5xl text-neutral-950 font-normal">
              {metrics.activeWorkOrdersCount}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-red-100 text-red-800 border border-red-300 rounded-xs">
                {emergencyCount} Emergency
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 rounded-xs">
                {highCount} High
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-[hsl(46.2_33.3%_92.4%)] text-neutral-700 border border-[hsl(51.4_15.6%_78%)] rounded-xs">
                {routineCount} Routine
              </span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 font-medium">
            Autonomous triage classifying live tenant reports & vendor dispatches.
          </p>
        </div>

        {/* Metric 2: Estimated NOI Saved (MTD) */}
        <div className="p-5 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-600">
              Estimated NOI Saved (MTD)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 border border-emerald-300 rounded-xs">
              <TrendingUp className="w-3 h-3" />
              +18.4% vs Baseline
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-editorial text-4xl sm:text-5xl text-neutral-950 font-normal">
              ${metrics.noiSavedMTD.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-600 font-medium">
              ({metrics.diyDeflectionsCount} DIY deflections @ $150 avg trip cost)
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 font-medium">
            Tenant self-guided deflection preventing avoidable in-unit truck rolls.
          </p>
        </div>

      </div>

      {/* 2. Tabbed Navigation & Views */}
      <div className="space-y-4">
        
        {/* Tab Headers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(51.4_15.6%_78%)] pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('corrective')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all ${
                activeTab === 'corrective'
                  ? 'bg-black text-white border-black'
                  : 'bg-[hsl(50_20.7%_88.6%)] text-neutral-700 border-[hsl(51.4_15.6%_78%)] hover:text-black'
              }`}
            >
              Corrective Triage ({tickets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preventive')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all ${
                activeTab === 'preventive'
                  ? 'bg-black text-white border-black'
                  : 'bg-[hsl(50_20.7%_88.6%)] text-neutral-700 border-[hsl(51.4_15.6%_78%)] hover:text-black'
              }`}
            >
              Preventive Maintenance & Asset Lifespan ({preventiveTasks.length})
            </button>
          </div>

          {activeTab === 'preventive' && (
            <button
              type="button"
              onClick={() => setShowComplianceModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase font-bold tracking-wider text-white bg-[#0000EE] hover:bg-blue-700 rounded-md border border-blue-900 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest New Compliance Manual (PDF)</span>
            </button>
          )}
        </div>

        {/* TAB 1: CORRECTIVE TRIAGE */}
        {activeTab === 'corrective' && (
          <div className="space-y-4">
            
            {/* Filter Bar & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'Emergency', 'High Priority', 'Routine', 'Resolved via DIY'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setFilterUrgency(filter)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-all ${
                      filterUrgency === filter
                        ? 'bg-black text-white border-black'
                        : 'bg-[hsl(46.2_33.3%_92.4%)] text-neutral-700 border-[hsl(51.4_15.6%_78%)] hover:bg-white'
                    }`}
                  >
                    {filter}
                    {filter === 'All' && ` (${tickets.length})`}
                    {filter === 'Emergency' && ` (${emergencyCount})`}
                    {filter === 'High Priority' && ` (${highCount})`}
                    {filter === 'Routine' && ` (${routineCount})`}
                    {filter === 'Resolved via DIY' && ` (${resolvedDIYCount})`}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter unit, trade, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-md text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Tickets Table (Desktop Grid with High Editorial Polish) */}
            <div className="bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[hsl(51.4_15.6%_78%)] bg-[hsl(46.2_33.3%_92.4%)] text-[11px] uppercase font-bold tracking-wider text-neutral-600">
                      <th className="py-3.5 px-4">Unit & Time</th>
                      <th className="py-3.5 px-4">Issue & AI Diagnostic Title</th>
                      <th className="py-3.5 px-4">Urgency</th>
                      <th className="py-3.5 px-4">Required Trade</th>
                      <th className="py-3.5 px-4">Identified Parts / Tools</th>
                      <th className="py-3.5 px-4">Technician Summary</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(51.4_15.6%_78%)] text-xs">
                    {filteredTickets.map((ticket, idx) => (
                      <tr
                        key={ticket.id}
                        className={`hover:bg-[hsl(46.2_33.3%_92.4%)]/70 transition-colors group cursor-pointer ${
                          idx === 0 && ticket.reportedAt === 'Just now' ? 'bg-blue-50/40 animate-pulse' : ''
                        }`}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        {/* Unit & Timestamp */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-neutral-900">{ticket.unit}</div>
                          <div className="text-[11px] text-neutral-500">{ticket.reportedAt}</div>
                          <div className="text-[10px] text-neutral-400 truncate max-w-[100px]">{ticket.tenantName}</div>
                        </td>

                        {/* Issue & Title */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-semibold text-neutral-950 group-hover:text-[#0000EE] transition-colors leading-snug">
                            {ticket.diagnostic.issue_title}
                          </div>
                          <p className="mt-1 text-[11px] text-neutral-600 line-clamp-1 italic">
                            "{ticket.description}"
                          </p>
                          {ticket.status === 'Resolved via DIY' && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-xs border border-emerald-300">
                              Resolved by Tenant (Saved $150)
                            </span>
                          )}
                        </td>

                        {/* Urgency */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-xs border ${getUrgencyTagClass(ticket.diagnostic.urgency, ticket.isResolvedByDIY)}`}>
                            {ticket.isResolvedByDIY ? 'DIY Resolved' : ticket.diagnostic.urgency}
                          </span>
                        </td>

                        {/* Required Trade */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-[11px] font-medium text-neutral-800 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-xs">
                            {ticket.diagnostic.required_trade}
                          </span>
                        </td>

                        {/* Identified Parts / Tools Needed */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {ticket.diagnostic.identified_parts.slice(0, 2).map((part, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-2 py-0.5 text-[10px] font-mono bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-xs text-neutral-800 truncate max-w-[130px]"
                              >
                                {part}
                              </span>
                            ))}
                            {ticket.diagnostic.identified_parts.length > 2 && (
                              <span className="px-1.5 py-0.5 text-[10px] text-neutral-500 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-xs">
                                +{ticket.diagnostic.identified_parts.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Technician Diagnostic Summary */}
                        <td className="py-4 px-4 max-w-sm">
                          <p className="text-[11px] text-neutral-700 line-clamp-2 leading-relaxed font-medium">
                            {ticket.diagnostic.technician_summary}
                          </p>
                        </td>

                        {/* Status / Action Buttons */}
                        <td className="py-4 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Prominent View / Inspect button for all tickets */}
                            <button
                              type="button"
                              onClick={() => setSelectedTicket(ticket)}
                              title="Inspect full diagnostics, parts list & tenant media"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-white border border-[hsl(51.4_15.6%_78%)] rounded-xs transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-neutral-600" />
                              <span>View</span>
                            </button>

                            {/* Pending Review status: allow assigning tech or dispatching vendor */}
                            {ticket.status === 'Pending Review' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateTicketStatus(
                                      ticket.id, 
                                      'Assigned In-House', 
                                      'Carlos Gomez (In-House Tech)'
                                    );
                                    triggerToast(`Assigned ${ticket.unit} to Carlos Gomez`);
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-neutral-800 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-neutral-200 border border-[hsl(51.4_15.6%_78%)] rounded-xs transition-colors"
                                >
                                  Assign Tech
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateTicketStatus(
                                      ticket.id, 
                                      'Dispatched Vendor', 
                                      `Bay Area Mechanical (${ticket.diagnostic.required_trade})`
                                    );
                                    triggerToast(`Dispatched Bay Area Mechanical for ${ticket.unit} (ETA 45m)`);
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0000EE] hover:bg-blue-700 border border-blue-900 rounded-xs transition-colors shadow-2xs"
                                >
                                  Dispatch
                                </button>
                              </>
                            )}

                            {/* Assigned In-House status: show badge + option to escalate or complete */}
                            {ticket.status === 'Assigned In-House' && (
                              <>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-900 bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded-xs">
                                  <UserCheck className="w-3 h-3 text-blue-700" />
                                  <span>Assigned: Carlos G.</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateTicketStatus(
                                      ticket.id, 
                                      'Dispatched Vendor', 
                                      `Bay Area Mechanical (${ticket.diagnostic.required_trade})`
                                    );
                                    triggerToast(`Escalated ${ticket.unit} to vendor dispatch`);
                                  }}
                                  className="px-2 py-1 text-[10px] font-semibold text-neutral-700 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-white border border-[hsl(51.4_15.6%_78%)] rounded-xs transition-colors"
                                >
                                  Dispatch
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateTicketStatus(ticket.id, 'Completed');
                                    triggerToast(`Completed ${ticket.unit} work order`);
                                  }}
                                  className="px-2 py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xs transition-colors"
                                >
                                  Complete
                                </button>
                              </>
                            )}

                            {/* Dispatched Vendor status: show badge + option to complete */}
                            {ticket.status === 'Dispatched Vendor' && (
                              <>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-900 bg-indigo-100/90 border border-indigo-300 px-2 py-0.5 rounded-xs">
                                  <Truck className="w-3 h-3 text-indigo-700" />
                                  <span>Dispatched (Vendor)</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateTicketStatus(ticket.id, 'Completed');
                                    triggerToast(`Marked ${ticket.unit} as Completed`);
                                  }}
                                  className="px-2 py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xs transition-colors"
                                >
                                  Complete
                                </button>
                              </>
                            )}

                            {/* Resolved via DIY status */}
                            {ticket.status === 'Resolved via DIY' && (
                              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-xs">
                                Resolved (Tenant DIY)
                              </span>
                            )}

                            {/* Completed status */}
                            {ticket.status === 'Completed' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-xs">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                    {filteredTickets.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-xs text-neutral-500">
                          No work orders matching current filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PREVENTIVE MAINTENANCE & ASSET LIFESPAN */}
        {activeTab === 'preventive' && (
          <div className="space-y-4">
            
            {/* Future Roadmap / Hardware Telemetry Banner */}
            <div className="p-4 bg-[hsl(46.2_33.3%_92.4%)] border border-purple-200/90 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start sm:items-center gap-3">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-300 rounded-full shrink-0">
                  Roadmap • Future Feature
                </span>
                <div>
                  <span className="font-bold text-neutral-900">Continuous Hydro & Acoustic IoT Mesh:</span>
                  <span className="ml-1 text-neutral-600">
                    Hardware submeter telemetry & ultrasonic pipe sensors are scheduled for Phase 2 hardware rollout. Current operations focus on resident video/photo intake and basic statutory life-safety audits below.
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-800 font-semibold shrink-0">
                Phase 2 Integration
              </span>
            </div>
            
            <div className="p-4 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-neutral-900">Mandatory Building Inspection Schedule:</span>
                <span className="ml-1 text-neutral-600">
                  Synchronized with building life-safety standards & municipal inspection codes.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Compliant (1)
                </span>
                <span className="flex items-center gap-1.5 text-amber-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Action Required (2)
                </span>
                <span className="flex items-center gap-1.5 text-blue-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Scheduled (1)
                </span>
              </div>
            </div>

            {/* Inspection Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preventiveTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg space-y-4 hover:border-black transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                          {task.assetTag}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#0000EE] bg-blue-100/70 border border-blue-300 px-1.5 py-0.2 rounded-xs">
                          {task.cycle}
                        </span>
                      </div>
                      <h3 className="font-serif-editorial text-xl font-normal text-neutral-950 mt-1 leading-snug">
                        {task.title}
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded-xs border ${
                      task.status === 'Compliant'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : task.status === 'Action Required'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-700">
                    <div>
                      <strong className="text-neutral-900">Due Date:</strong> {task.dueDate} (in {task.dueInDays} days)
                    </div>
                    <div>
                      <strong className="text-neutral-900">Location:</strong> {task.location}
                    </div>
                    <div>
                      <strong className="text-neutral-900">Standard:</strong> {task.complianceStandard}
                    </div>
                    <div>
                      <strong className="text-neutral-900">Required Licensure:</strong> {task.requiredTradeCert}
                    </div>
                    <div>
                      <strong className="text-neutral-900">Assigned Vendor/Tech:</strong> {task.technicianAssigned}
                    </div>
                  </div>

                  <div className="p-3 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-md text-[11px] text-neutral-800 leading-relaxed font-medium">
                    <strong className="text-neutral-900 block mb-0.5">Statutory Action Protocol:</strong>
                    {task.actionProtocol}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[hsl(51.4_15.6%_78%)]">
                    <span className="text-[11px] text-neutral-500 font-medium">
                      Last logged audit: {task.lastInspectionDate}
                    </span>

                    <div className="flex items-center gap-2">
                      {task.status !== 'Compliant' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdatePreventiveStatus(task.id, 'Compliant');
                            triggerToast(`Signed off inspection: ${task.title}`);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 border border-emerald-900 rounded-md transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Digital Sign-Off</span>
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Certified Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Ticket Inspector Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateStatus={(ticketId, status, assignedEntity) => {
            onUpdateTicketStatus(ticketId, status, assignedEntity);
            triggerToast(`Work order ${selectedTicket.unit} updated to '${status}'`);
          }}
        />
      )}

      {/* Compliance Manual Ingestion Modal */}
      {showComplianceModal && (
        <ComplianceIngestModal
          onTaskExtracted={onAddPreventiveTask}
          onClose={() => setShowComplianceModal(false)}
        />
      )}

    </div>
  );
};

export default ManagerCommandCenter;
